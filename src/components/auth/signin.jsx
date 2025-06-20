import React, { useReducer, useState } from "react";
import { Link, navigate } from "gatsby";
import validator from "validator";
import {
    passwordValidatorOptions,
    social_links,
} from "../../utilities/staticData";
import { FormInput } from "../common/FormControl";
import AuthLayout from "../common/AuthLayout";
import CustomSpinner from "../common/custom-spinner";
import { FaExclamationCircle } from "@react-icons/all-files/fa/FaExclamationCircle";
import { ROUTES } from "../../utilities/routes";
import * as GraphQL from "../../apollo/graphqls/mutations/Auth";
import { useMutation } from "@apollo/client";
import VerifyMutliFA from "./verify-multiFA";
import TwoFactorModal from "../profile/two-factor-modal";
import Seo from "../seo";

const Signin = () => {
    const [state, setState] = useReducer(
        (old, action) => ({ ...old, ...action }),
        {
            email: "",
            pwd: "",
            remember: false,
            emailError: "",
            pwdError: "",
            authError: false,
            pwdVisible: false,
            tempToken: "",
            twoStep: [],
            tfaOpen: false,
        },
    );

    const {
        email,
        pwd,
        remember,
        emailError,
        pwdError,
        authError,
        pwdVisible,
        tempToken,
        twoStep,
        tfaOpen,
    } = state;

    const [success, setSuccess] = useState(false);

    const [signinMutation, { loading }] = useMutation(GraphQL.SIGNIN, {
        retry: 1,
        onCompleted: (data) => {
            console.log("🔐 Initial signin response:", data);
            console.log("🔐 Signin status:", data.signin?.status);
            console.log(
                "🔐 Signin token:",
                data.signin?.token ? "Present" : "Missing",
            );
            console.log("🔐 TwoStep methods:", data.signin?.twoStep);

            setState({
                tempToken: data.signin.token,
                twoStep: data.signin.twoStep,
            });

            if (data.signin.status === "Failed") {
                console.log("❌ Signin failed:", data.signin.token);
                setState({ authError: true });
                setSuccess(false);
                if (
                    data.signin.token ===
                    "Please enable a two-step verification"
                ) {
                    console.log("🔐 Opening 2FA modal");
                    setState({ tfaOpen: true });
                } else if (
                    data.signin.token ===
                    "The account's email address is not verified"
                ) {
                    console.log("📧 Email not verified - redirecting");
                    navigate(ROUTES.verifyEmail + email);
                }
            } else if (data.signin.status === "Success") {
                console.log("✅ Signin success - showing 2FA form");
                setSuccess(true);
            }
        },
        onError: (error) => {
            console.error("🚨 Signin mutation error:", error);
        },
    });

    // Methods
    const signUserIn = (e) => {
        e.preventDefault();
        setState({ emailError: "", pwdError: "" });
        let error = false;
        if (!email || !validator.isEmail(email)) {
            setState({ emailError: "Invalid email address" });
            error = true;
        }
        if (
            !pwd ||
            !validator.isStrongPassword(pwd, passwordValidatorOptions)
        ) {
            setState({
                pwdError:
                    "Password must contain at least 8 characters, including UPPER/lowercase and numbers!",
            });
            error = true;
        }

        if (!error)
            signinMutation({
                variables: {
                    email,
                    password: pwd,
                },
            });
    };

    return (
        <>
            <Seo title="Sign In" />
            <AuthLayout>
                <TwoFactorModal
                    is2FAModalOpen={tfaOpen}
                    setIs2FAModalOpen={(res) => setState({ tfaOpen: res })}
                    email={email}
                    twoStep={twoStep}
                    onResult={(r) => {
                        if (r) {
                            setState({ tfaOpen: false, authError: false });
                        } else navigate(ROUTES.verifyFailed);
                    }}
                    redirect={false}
                />
                {success ? (
                    // This is the section to replace in src/components/auth/signin.jsx
                    // Find the VerifyMutliFA component usage and replace it with:

                    <VerifyMutliFA
                        twoStep={twoStep}
                        email={email}
                        tempToken={tempToken}
                        returnToSignIn={() => setSuccess(false)}
                        resend={(e) => signUserIn(e)}
                        loading={loading}
                        onSuccess={() => {
                            console.log(
                                "🎉 2FA completed successfully from Sign In - navigating to wallet",
                            );
                            // Reset success state and let the auth system handle navigation
                            setSuccess(false);
                            // The navigation will be handled by the useSignIn2FA hook
                        }}
                        onError={(error) => {
                            console.error("❌ 2FA Error from Sign In:", error);
                            // You can show an error message here or reset the form
                            setSuccess(false);
                            // Optionally show an error message to the user
                        }}
                    />
                ) : (
                    <>
                        <h3 className="signup-head mb-4">Sign In</h3>
                        <form className="form">
                            <div className="form-group">
                                <FormInput
                                    name="email"
                                    type="text"
                                    label="Email"
                                    value={email}
                                    onChange={(e) =>
                                        setState({ email: e.target.value })
                                    }
                                    placeholder="Enter email"
                                    error={emailError}
                                />
                            </div>
                            <div className="form-group position-relative">
                                <FormInput
                                    type={pwdVisible ? "text" : "password"}
                                    label="Password"
                                    value={pwd}
                                    onChange={(e) =>
                                        setState({ pwd: e.target.value })
                                    }
                                    placeholder="Enter password"
                                    error={pwdError}
                                />
                            </div>
                            <div className="form-group d-flex justify-content-between align-items-center">
                                <label className="d-flex align-items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={pwdVisible}
                                        className="form-check-input"
                                        onChange={() =>
                                            setState({
                                                pwdVisible: !pwdVisible,
                                            })
                                        }
                                    />
                                    <div className="keep-me-signed-in-text">
                                        Show password
                                    </div>
                                </label>
                                <Link
                                    className="txt-green forget-pwd"
                                    to={ROUTES.forgotPassword}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="form-group  mb-5">
                                <label className="d-flex align-items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        value={remember}
                                        className="form-check-input"
                                        onChange={() =>
                                            setState({ remember: !remember })
                                        }
                                    />
                                    <div className="keep-me-signed-in-text">
                                        Keep me signed in in this device
                                    </div>
                                </label>
                            </div>
                            {authError && (
                                <span className="errorsapn">
                                    <FaExclamationCircle /> {tempToken}
                                </span>
                            )}
                            <button
                                type="submit"
                                className="btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center py-2"
                                disabled={loading}
                                onClick={signUserIn}
                            >
                                <div
                                    className={`${loading ? "opacity-100" : "opacity-0"}`}
                                >
                                    <CustomSpinner />
                                </div>
                                <div className={`${loading ? "ms-3" : "pe-4"}`}>
                                    sign in
                                </div>
                            </button>
                        </form>
                        <ul className="social-links">
                            {social_links.map((item, idx) => (
                                <li key={idx}>
                                    <a href={item.to}>
                                        <img src={item.icon} alt="icon" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <p className="text-white text-center">
                            Do not have an account?{" "}
                            <Link to="/app/signup" className="signup-link">
                                Sign up
                            </Link>
                        </p>
                    </>
                )}
            </AuthLayout>
        </>
    );
};

export default Signin;
