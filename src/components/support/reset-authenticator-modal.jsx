import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import { useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

import { CONFIRM_GOOGLE_AUTH_RESET } from "../../apollo/graphqls/mutations/Auth";
import CustomSpinner from "../common/custom-spinner";
import { FormInput } from "../common/FormControl";
import { CloseIcon } from "../../utilities/imgImport";
import { showSuccessAlarm, showFailAlarm } from "../admin/AlarmModal";

export default function ResetAuthenticatorModal({ isOpen, setIsOpen, secret }) {
    const [sentCode, setSentCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error] = useState("");
    
    const resetModal = () => {
        setSentCode(''); setLoading(false); setIsOpen(false);
    }

    const [ confirmResetGoogleAuth ] = useMutation(CONFIRM_GOOGLE_AUTH_RESET, {
        onCompleted: data => {
            if(data.confirmGoogleAuthReset === 'Success') {
                showSuccessAlarm('Google Authenticator has been updated.');
            } else {
                // close modal
                showFailAlarm('Cannot Reset Google Authenticator.')
            }
            resetModal();
        },
        onError: error => {
            // show message and close modal
            showFailAlarm('Cannot Reset Google Authenticator.')
            resetModal();
        }
    })

    const handleSubmit = (e) => {
        e.stopPropagation();
        setLoading(true);
        confirmResetGoogleAuth({
            variables: {
                code: sentCode
            }
        });
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="support-modal border-0"
            overlayClassName="support-modal__overlay"
            ariaHideApp={false}
        >
            <div className="support-modal__header justify-content-end">
                <div
                    onClick={() => setIsOpen(false)}
                    onKeyDown={() => setIsOpen(false)}
                    role="button"
                    tabIndex="0"
                >
                    <img
                        width="14px"
                        height="14px"
                        src={CloseIcon}
                        alt="close"
                    />
                </div>
            </div>
            <div className="my-5">
                <div className="text-center">
                    <p className="text-capitalize fs-30px fw-bold lh-36px">
                        Get codes from authenticator app
                    </p>
                    <p className="fs-16px mt-2 text-light fw-normald mb-3">
                        Scan the QR code below or mannually type the secret key into
                                        your authenticator app.
                    </p>
                    <img src={secret} width={120} alt="qr code" />
                    <p>
                        <small className="fw-bold">123456xxxx</small>
                    </p>
                </div>

                <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto text-light my-5">
                    <form action="form">
                        <div className="form-group">
                            <FormInput
                                type="text"
                                label="Auth code"
                                value={sentCode}
                                onChange={(e) => setSentCode(e.target.value)}
                                placeholder="Enter code"
                            />
                        </div>
                        <div className="my-5">
                            {error && (
                                <span className="errorsapn">
                                    <FontAwesomeIcon
                                        icon={faExclamationCircle}
                                    />{" "}
                                    {error}
                                </span>
                            )}
                            <button
                                type="submit"
                                className="btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center py-2"
                                disabled={loading || sentCode === ''}
                                onClick={handleSubmit}
                            >
                                <div
                                    className={`${
                                        loading ? "opacity-1" : "opacity-0"
                                    }`}
                                >
                                    <CustomSpinner />
                                </div>
                                <div
                                    className={`fs-20px ${
                                        loading ? "ms-3" : "pe-4"
                                    }`}
                                >
                                    verify
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
