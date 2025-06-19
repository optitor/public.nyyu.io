// src/components/oauth2/redirect.js
import React, { useEffect, useReducer, useState } from "react";
import { navigate } from "gatsby";
import AuthLayout from "../common/AuthLayout";
import VerifyMutliFA from "../auth/verify-multiFA";
import TwoFactorModal from "../profile/two-factor-modal";
import CustomSpinner from "../common/custom-spinner";
import { ROUTES } from "../../utilities/routes";
import { setAuthToken } from "../../utilities/auth";

// Enhanced reducer for better state management
const initialState = {
    email: "",
    twoStep: [],
    tempToken: "",
    tfaOpen: false,
    success: false,
    loading: true,
    error: null,
    mobileCallback: false,
    redirectUrl: null,
    processed: false, // Add flag to prevent reprocessing
};

const stateReducer = (state, action) => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                loading: false,
                processed: true,
            };
        case "SET_SUCCESS":
            return {
                ...state,
                ...action.payload,
                success: true,
                loading: false,
                error: null,
                processed: true,
            };
        case "SET_TFA_OPEN":
            return {
                ...state,
                tfaOpen: action.payload,
                loading: false,
                processed: true,
            };
        case "SET_MOBILE_CALLBACK":
            return {
                ...state,
                mobileCallback: true,
                loading: false,
                processed: true,
            };
        case "RESET_STATE":
            return { ...initialState, loading: true, processed: false };
        default:
            return state;
    }
};

const OAuth2RedirectHandler = ({ type, dataType, data }) => {
    const [state, dispatch] = useReducer(stateReducer, initialState);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    // Mobile OAuth detection
    const detectMobile = () => {
        if (typeof window === "undefined") return false;
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isMobile =
            /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
                userAgent,
            );
        const isFlutter = userAgent.includes("flutter");
        return isMobile || isFlutter;
    };

    // Enhanced URL parameter parsing
    const parseOAuthData = (data) => {
        if (!data) {
            console.log("🔍 parseOAuthData: No data provided");
            return null;
        }

        try {
            console.log("🔍 parseOAuthData: Raw data:", data);

            // Handle both encoded and non-encoded data
            const decodedData = decodeURIComponent(data);
            console.log("🔍 parseOAuthData: Decoded data:", decodedData);

            const parts = decodedData.split("*");
            console.log("🔍 parseOAuthData: Split parts:", parts);

            if (parts.length < 1) {
                console.log("🔍 parseOAuthData: Not enough parts");
                return null;
            }

            const result = {
                email: parts[0],
                twoStep: parts.slice(1).filter((step) => step && step.trim()),
            };

            console.log("🔍 parseOAuthData: Parsed result:", result);
            return result;
        } catch (error) {
            console.error("🚨 Error parsing OAuth data:", error);
            return null;
        }
    };

    // Handle mobile deep link callback
    const handleMobileCallback = (token, email, twoStep = []) => {
        // Only treat as mobile if explicitly from mobile environment
        const isMobile = detectMobile();
        const isActualMobileApp =
            window.flutter_inappwebview || window.ReactNativeWebView;

        // Don't treat regular browser on mobile as mobile app
        if (!isActualMobileApp) {
            console.log(
                "🌐 Regular browser detected, not treating as mobile app",
            );
            return false;
        }

        console.log("📱 Actual mobile app detected, handling mobile callback");

        if (window.flutter_inappwebview) {
            // Flutter InAppWebView callback
            window.flutter_inappwebview.callHandler("oauth_success", {
                token,
                email,
                twoStep,
                timestamp: Date.now(),
            });
            return true;
        }

        if (window.ReactNativeWebView) {
            // React Native WebView callback
            window.ReactNativeWebView.postMessage(
                JSON.stringify({
                    type: "oauth_success",
                    token,
                    email,
                    twoStep,
                    timestamp: Date.now(),
                }),
            );
            return true;
        }

        // Custom mobile scheme redirect (only for actual mobile apps)
        if (process.env.GATSBY_MOBILE_DEEP_LINK_SCHEME && isActualMobileApp) {
            const mobileUrl = `${process.env.GATSBY_MOBILE_DEEP_LINK_SCHEME}://oauth/callback?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}&twoStep=${encodeURIComponent(twoStep.join(","))}`;
            window.location.href = mobileUrl;
            return true;
        }

        return false;
    };

    // Process OAuth response
    useEffect(() => {
        // Prevent reprocessing if already processed
        if (state.processed) {
            console.log("🔐 OAuth already processed, skipping");
            return;
        }

        console.log("🔐 Processing OAuth response:", { type, dataType, data });

        // Reset state on new request
        dispatch({ type: "RESET_STATE" });

        // Add delay to ensure proper state initialization
        const processTimeout = setTimeout(() => {
            try {
                if (type === "success") {
                    if (dataType && data) {
                        // Parse OAuth data
                        const parsedData = parseOAuthData(data);

                        if (parsedData) {
                            const { email, twoStep } = parsedData;

                            console.log("✅ OAuth Success - Parsed data:", {
                                email,
                                twoStep,
                            });
                            console.log("🔍 2FA Steps found:", twoStep.length);

                            // For web browsers, always handle 2FA properly
                            if (twoStep && twoStep.length > 0) {
                                console.log(
                                    "🔐 2FA required - showing 2FA interface",
                                );
                                dispatch({
                                    type: "SET_SUCCESS",
                                    payload: {
                                        tempToken: dataType,
                                        email,
                                        twoStep,
                                    },
                                });
                                return; // Don't proceed to mobile callback
                            }

                            // Only check mobile callback if no 2FA required
                            const isMobileHandled = handleMobileCallback(
                                dataType,
                                email,
                                twoStep,
                            );

                            if (isMobileHandled) {
                                dispatch({ type: "SET_MOBILE_CALLBACK" });
                                return;
                            }

                            // For web without 2FA, proceed directly
                            console.log(
                                "✅ No 2FA required - proceeding to login",
                            );
                            setAuthToken(dataType);
                            navigate(ROUTES.selectFigure);
                        } else {
                            // No 2FA required - direct login
                            console.log("✅ OAuth Success - Direct login");
                            setAuthToken(dataType);

                            // Handle mobile callback for direct login
                            const isMobileHandled = handleMobileCallback(
                                dataType,
                                data || "",
                                [],
                            );

                            if (!isMobileHandled) {
                                navigate(ROUTES.selectFigure);
                            } else {
                                dispatch({ type: "SET_MOBILE_CALLBACK" });
                            }
                        }
                    } else {
                        // Fallback for legacy success format
                        console.log("✅ OAuth Success - Legacy format");
                        navigate(ROUTES.selectFigure);
                    }
                } else if (type === "error" || type === "failed") {
                    console.log("❌ OAuth Error:", { dataType, data });

                    if (dataType === "No2FA") {
                        // User exists but 2FA is not enabled
                        dispatch({
                            type: "SET_TFA_OPEN",
                            payload: true,
                        });
                        dispatch({
                            type: "SET_SUCCESS",
                            payload: {
                                email: data,
                                twoStep: [],
                            },
                        });
                    } else {
                        // Other errors - redirect to sign in with error message
                        const errorMessage =
                            dataType && data
                                ? `${dataType}: ${data}`
                                : "OAuth authentication failed";
                        navigate(
                            `${ROUTES.signIn}?error=${encodeURIComponent(errorMessage)}`,
                        );
                    }
                } else {
                    console.log("❓ Unknown OAuth response type:", type);
                    dispatch({
                        type: "SET_ERROR",
                        payload: "Unknown OAuth response type",
                    });
                }
            } catch (error) {
                console.error("🚨 Error processing OAuth response:", error);
                dispatch({
                    type: "SET_ERROR",
                    payload: error.message || "Unknown error occurred",
                });
            }
        }, 100);

        return () => clearTimeout(processTimeout);
    }, [type, dataType, data, state.processed]); // Add state.processed to dependencies

    // Retry mechanism for failed OAuth
    const handleRetry = () => {
        if (retryCount < maxRetries) {
            setRetryCount((prev) => prev + 1);
            dispatch({ type: "RESET_STATE" });
            // Trigger re-processing
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            navigate(ROUTES.signIn);
        }
    };

    // Error boundary fallback
    const handleError = (error) => {
        console.error("🚨 OAuth component error:", error);
        dispatch({
            type: "SET_ERROR",
            payload: "An unexpected error occurred during authentication",
        });
    };

    // Loading state
    if (state.loading) {
        return (
            <AuthLayout>
                <div className="text-center p-4">
                    <CustomSpinner />
                    <div className="text-light fs-18px fw-500 mt-3">
                        Processing OAuth authentication...
                    </div>
                </div>
            </AuthLayout>
        );
    }

    // Mobile callback handled
    if (state.mobileCallback) {
        return (
            <AuthLayout>
                <div className="text-center p-4">
                    <div className="text-success fs-24px fw-bold mb-3">
                        ✅ Authentication Successful
                    </div>
                    <div className="text-light fs-16px">
                        You can now close this window and return to the app.
                    </div>
                </div>
            </AuthLayout>
        );
    }

    // Error state
    if (state.error) {
        return (
            <AuthLayout>
                <div className="text-center p-4">
                    <div className="text-danger fs-24px fw-bold mb-3">
                        ❌ Authentication Failed
                    </div>
                    <div className="text-light fs-16px mb-4">{state.error}</div>
                    {retryCount < maxRetries && (
                        <div className="d-flex gap-3 justify-content-center">
                            <button
                                className="btn btn-outline-light"
                                onClick={handleRetry}
                            >
                                Retry ({maxRetries - retryCount} attempts left)
                            </button>
                            <button
                                className="btn btn-light"
                                onClick={() => navigate(ROUTES.signIn)}
                            >
                                Back to Sign In
                            </button>
                        </div>
                    )}
                    {retryCount >= maxRetries && (
                        <button
                            className="btn btn-light"
                            onClick={() => navigate(ROUTES.signIn)}
                        >
                            Back to Sign In
                        </button>
                    )}
                </div>
            </AuthLayout>
        );
    }

    // Success state with 2FA
    return (
        <AuthLayout>
            {state.success && state.twoStep.length > 0 && (
                <VerifyMutliFA
                    twoStep={state.twoStep}
                    email={state.email}
                    tempToken={state.tempToken}
                    returnToSignIn={() => navigate(ROUTES.signIn)}
                    onError={handleError}
                    onSuccess={() => {
                        console.log(
                            "🎉 2FA completed successfully from OAuth - navigating to wallet",
                        );
                        // Navigate to wallet for OAuth login (since user is already authenticated)
                        navigate(ROUTES.wallet, { replace: true });
                    }}
                    resend={() => {
                        console.log("🔄 Resending 2FA codes for OAuth login");
                        // You might want to implement a resend mechanism here
                    }}
                    loading={false}
                />
            )}

            {state.tfaOpen && (
                <TwoFactorModal
                    is2FAModalOpen={state.tfaOpen}
                    setIs2FAModalOpen={(isOpen) => {
                        console.log(
                            "🔐 TwoFactorModal setIs2FAModalOpen called with:",
                            isOpen,
                        );
                        if (!isOpen) {
                            navigate(ROUTES.signIn);
                        } else {
                            dispatch({ type: "SET_TFA_OPEN", payload: isOpen });
                        }
                    }}
                    email={state.email}
                    twoStep={state.twoStep}
                    onResult={(success) => {
                        console.log(
                            "🔐 TwoFactorModal onResult called with:",
                            success,
                        );
                        if (success) {
                            dispatch({ type: "SET_TFA_OPEN", payload: false });
                            navigate(ROUTES.wallet); // Navigate to wallet instead of sign in
                        } else {
                            navigate(ROUTES.verifyFailed);
                        }
                    }}
                    redirect={true}
                    onError={handleError}
                />
            )}
        </AuthLayout>
    );
};

export default OAuth2RedirectHandler;
