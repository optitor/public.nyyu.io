import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { useState } from "react"
import Modal from "react-modal"
import { CloseIcon } from "../../utilities/imgImport"
import CustomSpinner from "../common/custom-spinner"
import { FormInput } from "../common/FormControl"

export default function ResetPasswordModal({ isOpen, setIsOpen }) {
    const [sentCode, setSentCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
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
                <div className="text-center">
                    <p className="text-capitalize fs-30px fw-bold">reset password</p>
                    <p className="fs-16px mt-2 text-light fw-normald">
                        To secure your account, please complete the following verification
                    </p>
                </div>

                <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto text-light my-5">
                    <form action="form">
                        <div className="form-group">
                            <FormInput
                                type="text"
                                label="Email"
                                value={sentCode}
                                onChange={(e) => setSentCode(e.target.value)}
                                placeholder="Enter code"
                            />
                            <div className="fs-12px">
                                The code have been sent to email_address{" "}
                                <span className="txt-green fw-500 cursor-pointer">Resend</span>
                            </div>
                        </div>
                        <div className="my-5">
                            {error && (
                                <span className="errorsapn">
                                    <FontAwesomeIcon icon={faExclamationCircle} /> {error}
                                </span>
                            )}
                            <button
                                type="submit"
                                className="btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center py-2"
                                disabled={loading}
                                // onClick={signUserIn}
                            >
                                <div className={`${loading ? "opacity-1" : "opacity-0"}`}>
                                    <CustomSpinner />
                                </div>
                                <div className={`${loading ? "ms-3" : "pe-4"}`}>verify</div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    )
}
