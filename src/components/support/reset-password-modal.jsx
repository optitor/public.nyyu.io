import { useMutation, useQuery } from "@apollo/client";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Modal from "react-modal";
import { FORGOT_PASSWORD, RESET_PASSWORD } from "../../apollo/graphqls/mutations/Auth";
import { GET_USER } from "../../apollo/graphqls/querys/Auth";
import { CloseIcon, FailImage, SuccesImage } from "../../utilities/imgImport";
import { passwordValidatorOptions } from "../../utilities/staticData";
import CustomSpinner from "../common/custom-spinner";
import { FormInput } from "../common/FormControl";
import validator from "validator";

export default function ResetPasswordModal({ isOpen, setIsOpen }) {
    // Webservice
    useQuery(GET_USER, {
        fetchPolicy: "network-only",
        onCompleted: (res) => {
            setUserEmail(res.getUser.email);
        },
    });
    const [forgotPassword] = useMutation(FORGOT_PASSWORD, {
        onCompleted: (res) => {
            setForgotPasswordSent(true);
        },
    });
    const [resetPassword] = useMutation(RESET_PASSWORD, {
        onCompleted: (res) => {
            setPendingRequest(false);
            setResetPasswordResult(res.resetPassword);
        },
    });

    // Containers
    const [userEmail, setUserEmail] = useState(null);
    const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
    const [error, setError] = useState("");
    const loading = !userEmail && !forgotPasswordSent;
    const [pendingRequest, setPendingRequest] = useState(false);
    const [sentCode, setSentCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [resetPasswordResult, setResetPasswordResult] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // Methods
    const censorWord = (str) => str[0] + "*".repeat(3) + str.slice(-1);

    const censorEmail = (email) => {
        const arr = email.split("@");
        return censorWord(arr[0]) + "@" + censorWord(arr[1]);
    };

    const submit = (e) => {
        e.preventDefault();
        setError("");
        setPendingRequest(false);
        let error = false;
        if (!sentCode) {
            setError("Please enter the code!");
            return (error = true);
        }
        if (!newPassword || !validator.isStrongPassword(newPassword, passwordValidatorOptions)) {
            setError(
                "Password must contain at least 8 characters, including UPPER/lowercase and numbers!"
            );
            return (error = true);
        }
        if (!confirmNewPassword || newPassword !== confirmNewPassword) {
            setError("Password doest not match it's repeat!");
            return (error = true);
        }
        if (!error) {
            setPendingRequest(true);

            resetPassword({
                variables: {
                    email: userEmail,
                    code: sentCode,
                    newPassword: newPassword,
                },
            });
        }
    };
    useEffect(() => {
        if (userEmail) {
            forgotPassword({
                variables: {
                    email: userEmail,
                },
            });
        }
    }, [userEmail, forgotPassword]);

    // Render
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="support-modal border-0"
            overlayClassName="support-modal__overlay"
        >
            <div className="support-modal__header justify-content-end">
                <div
                    onClick={() => setIsOpen(false)}
                    onKeyDown={() => setIsOpen(false)}
                    role="button"
                    tabIndex="0"
                >
                    <img width="14px" height="14px" src={CloseIcon} alt="close" />
                </div>
            </div>
            <div className="my-5">
                {loading ? (
                    <div className="text-center">
                        <CustomSpinner />
                    </div>
                ) : resetPasswordResult === null ? (
                    <div>
                        <div className="text-center">
                            <p className="text-capitalize fs-30px fw-bold lh-36px">
                                reset password
                            </p>
                            <p className="fs-16px mt-2 text-light fw-normald">
                                To secure your account, please complete the following verification
                            </p>
                        </div>

                        <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto text-light my-5">
                            <form action="form">
                                <div className="form-group">
                                    <FormInput
                                        type="text"
                                        label="Code"
                                        value={sentCode}
                                        onChange={(e) => setSentCode(e.target.value)}
                                        placeholder="Enter code"
                                    />
                                    <div className="fs-12px">
                                        The code have been sent to {censorEmail(userEmail)}{" "}
                                        <span className="txt-green fw-500 cursor-pointer">
                                            Resend
                                        </span>
                                    </div>
                                </div>
                                <div className="form-group mt-3">
                                    <FormInput
                                        type={showPassword ? "text" : "password"}
                                        label="New password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <FormInput
                                        type={showPassword ? "text" : "password"}
                                        label="Confirm new password"
                                        placeholder="Confirm new password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    />
                                </div>
                                <label className="d-flex align-items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={showPassword}
                                        className="form-check-input bg-transparent border mt-0"
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                    <div className="keep-me-signed-in-text">Show password</div>
                                </label>
                                <div className="mb-5 mt-4">
                                    {error && (
                                        <span className="errorsapn">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> {error}
                                        </span>
                                    )}
                                    <button
                                        type="submit"
                                        className="btn btn-outline-light rounded-0 w-100 text-uppercase d-flex align-items-center justify-content-center py-2"
                                        disabled={pendingRequest}
                                        onClick={submit}
                                    >
                                        <div
                                            className={`${
                                                pendingRequest ? "opacity-1" : "opacity-0"
                                            }`}
                                        >
                                            <CustomSpinner />
                                        </div>
                                        <div
                                            className={`fs-20px ${
                                                pendingRequest ? "ms-3" : "pe-4"
                                            }`}
                                        >
                                            submit
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : resetPasswordResult === "Success" ? (
                    <div className="text-center">
                        <img src={SuccesImage} className="img-fluid" alt="success svg icon" />
                        <div className="fw-500 fs-24px mt-5 text-light">
                            Password changed successfully
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <img src={FailImage} className="img-fluid" alt="success svg icon" />
                        <div className="fw-500 fs-24px mt-5 text-light">
                            Failed to change password
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
