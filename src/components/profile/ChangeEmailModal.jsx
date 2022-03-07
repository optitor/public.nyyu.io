import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import { CloseIcon } from "../../utilities/imgImport";
import CustomSpinner from "../common/custom-spinner";
import { FormInput } from "../common/FormControl";

export default function ChangeEmailModal({ isOpen, setIsOpen }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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
                    <img
                        width="14px"
                        height="14px"
                        src={CloseIcon}
                        alt="close"
                    />
                </div>
            </div>
            <div className="py-4">
                <div className="text-center">
                    <p className="text-capitalize fs-30px fw-bold lh-36px">
                        Email change
                    </p>
                    <p className="fs-16px mt-3 text-light fw-normald px-sm-5 px-0">
                        Email change will cost 10 NDB coins, and it will be
                        drawn from your wallet
                    </p>
                </div>
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto text-light mt-4">
                    <form action="form">
                        <div className="form-group">
                            <FormInput
                                type="text"
                                label="Email"
                                placeholder="Enter a new name"
                            />
                        </div>
                        <div className="mt-4 mb-3">
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
                                className="btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center py-1 mt-4"
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
                                    confirm
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
