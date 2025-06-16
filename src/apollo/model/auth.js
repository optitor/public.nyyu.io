import * as GraphQL from "../graphqls/mutations/Auth";
import { useMutation } from "@apollo/client";
import { navigate } from "gatsby";
import { isBrowser, setAuthToken } from "../../utilities/auth";
import { ROUTES } from "../../utilities/routes";

// Signin with 2FA
export const useSignIn2FA = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.SIGNIN_2FA, {
        onCompleted: (data) => {
            console.log("🔐 2FA Response received:", data);
            console.log("🔐 2FA Status:", data.confirm2FA?.status);
            console.log(
                "🔐 2FA Token:",
                data.confirm2FA?.token ? "Token received" : "No token",
            );

            if (data.confirm2FA.status === "Failed") {
                console.log("❌ 2FA Failed:", data.confirm2FA.token);
                return;
            } else if (data.confirm2FA.status === "Success") {
                console.log(
                    "✅ 2FA Success - Setting token only (letting AuthRoute handle redirect)",
                );
                console.log("🎯 Setting auth token...");

                setAuthToken(data.confirm2FA.token);

                console.log("🎯 Token set successfully");
                console.log("🎯 AuthRoute will handle navigation to wallet");

                // NO NAVIGATION HERE - let AuthRoute handle it
                // Just force auth state update so AuthRoute can detect the login
                setTimeout(() => {
                    if (window.forceAuthUpdate) {
                        console.log(
                            "🎫 Forcing auth update for AuthRoute detection",
                        );
                        window.forceAuthUpdate();
                    }
                }, 500);
            }
        },
        onError: (error) => {
            console.error("🚨 2FA Mutation Error:", error);
            console.error("🚨 GraphQL Errors:", error.graphQLErrors);
            console.error("🚨 Network Error:", error.networkError);
        },
    });

    const signin2fa = (email, token, code) => {
        console.log("🔐 Submitting 2FA verification:");
        console.log("📧 Email:", email);
        console.log("🎫 Temp Token:", token ? "Present" : "Missing");
        console.log("🔢 Code:", code);
        console.log("🔢 Code keys:", Object.keys(code));
        console.log("🔢 Code values:", Object.values(code));

        return mutation({
            variables: {
                email,
                token,
                code,
            },
        });
    };
    return [signin2fa, mutationResults];
};

export const useSignUp2FA = () => {
    const [mutation, mutationResults] = useMutation(
        GraphQL.CONFIRM_REQUEST_2FA,
        {
            onCompleted: (data) => {
                console.log("🔐 SignUp 2FA Response received:", data);
                console.log(
                    "🔐 SignUp 2FA Status:",
                    data.confirmRequest2FA?.status,
                );

                if (data.confirmRequest2FA.status === "Failed") {
                    console.log(
                        "❌ SignUp 2FA Failed:",
                        data.confirmRequest2FA.token,
                    );
                    return;
                } else if (data.confirmRequest2FA.status === "Success") {
                    console.log(
                        "✅ SignUp 2FA Success - Setting token only (letting AuthRoute handle redirect)",
                    );
                    console.log("🎯 Setting auth token...");

                    setAuthToken(data.confirmRequest2FA.token);

                    console.log("🎯 Token set successfully");
                    console.log(
                        "🎯 AuthRoute will handle navigation to wallet",
                    );

                    // NO NAVIGATION HERE - let AuthRoute handle it
                    setTimeout(() => {
                        if (window.forceAuthUpdate) {
                            console.log(
                                "🎫 Forcing auth update for AuthRoute detection",
                            );
                            window.forceAuthUpdate();
                        }
                    }, 500);
                }
            },
            onError: (error) => {
                console.error("🚨 SignUp 2FA Mutation Error:", error);
                console.error("🚨 GraphQL Errors:", error.graphQLErrors);
                console.error("🚨 Network Error:", error.networkError);
            },
        },
    );

    const signup2fa = (email, token, code) => {
        console.log("🔐 Submitting SignUp 2FA verification:");
        console.log("📧 Email:", email);
        console.log("🎫 Temp Token:", token ? "Present" : "Missing");
        console.log("🔢 Code:", code);
        console.log("🔢 Code keys:", Object.keys(code));
        console.log("🔢 Code values:", Object.values(code));

        return mutation({
            variables: {
                email,
                token,
                code,
            },
        });
    };
    return [signup2fa, mutationResults];
};

export const useForgotPassword = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.FORGOT_PASSWORD, {
        errorPolicy: "ignore",
        onCompleted: (data) => {
            console.log("🔑 Forgot Password Response:", data);

            if (data?.forgotPassword === "Success") {
                console.log(
                    "✅ Forgot Password Success - Navigating to change password",
                );
                navigate(ROUTES.changePassword);
            } else {
                console.log("❌ Forgot Password Failed:", data?.forgotPassword);
            }
        },
        onError: (error) => {
            console.error("🚨 Forgot Password Error:", error);
        },
    });

    const forgotPassword = (email) => {
        console.log("🔑 Submitting forgot password request for:", email);
        console.log("🌐 Browser check:", isBrowser);

        if (!isBrowser) {
            console.log("❌ Not in browser - skipping localStorage");
            return;
        }

        console.log("💾 Storing email in localStorage");
        localStorage.setItem("FORGOT_PASSWORD_EMAIL", email);

        return mutation({
            variables: {
                email,
            },
        });
    };
    return [forgotPassword, mutationResults];
};

export const useChangePassword = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.CHANGE_PASSWORD, {
        onCompleted: (data) => {
            console.log("🔑 Change Password Response:", data);
        },
        onError: (error) => {
            console.error("🚨 Change Password Error:", error);
        },
    });

    const changePassword = (newPassword) => {
        console.log("🔑 Submitting password change");
        console.log("🔒 New password length:", newPassword?.length);

        return mutation({
            variables: {
                newPassword,
            },
        });
    };
    return [changePassword, mutationResults];
};

export const useResetPassword = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.RESET_PASSWORD, {
        onCompleted: (data) => {
            console.log("🔑 Reset Password Response:", data);
        },
        onError: (error) => {
            console.error("🚨 Reset Password Error:", error);
        },
    });

    const resetPassword = (email, code, newPassword) => {
        console.log("🔑 Submitting password reset:");
        console.log("📧 Email:", email);
        console.log("🔢 Code:", code);
        console.log("🔒 New password length:", newPassword?.length);

        return mutation({
            variables: {
                email,
                code,
                newPassword,
            },
        });
    };
    return [resetPassword, mutationResults];
};

// Debug helper function to check auth state
export const debugAuthState = () => {
    if (!isBrowser) {
        console.log("🌐 Not in browser environment");
        return;
    }

    console.log("🔍 === AUTH STATE DEBUG ===");
    console.log("🌐 Browser:", isBrowser);
    console.log("📍 Current URL:", window.location.href);
    console.log("📍 Pathname:", window.location.pathname);
    console.log(
        "🎫 localStorage ACCESS_TOKEN:",
        localStorage.getItem("ACCESS_TOKEN") ? "Present" : "Missing",
    );
    console.log(
        "🚪 localStorage LOGGED_OUT_TIME:",
        localStorage.getItem("LOGGED_OUT_TIME"),
    );
    console.log("🍪 All cookies:", document.cookie);
    console.log("🎯 Available Routes:", ROUTES);

    // Additional auth state debugging
    try {
        const {
            getInMemoryAuthToken,
            isTokenExpired,
            isLoggedOut,
        } = require("../../utilities/auth");
        const token = getInMemoryAuthToken();
        console.log("🎫 In-memory token:", token ? "Present" : "Missing");
        if (token) {
            console.log("⏰ Token expired:", isTokenExpired(token));
        }
        console.log("🚪 Is logged out:", isLoggedOut());
    } catch (error) {
        console.log("❌ Could not check auth utilities:", error.message);
    }

    console.log("🔍 === END DEBUG ===");
};

// Call this function on page load to debug
if (isBrowser) {
    window.debugAuthState = debugAuthState;
    console.log("🔧 Debug function available: window.debugAuthState()");
}
