import { useMutation } from "@apollo/client";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState } from "react";
import { isBrowser } from "react-device-detect";
import Modal from "react-modal";
import { CloseIcon } from "../../utilities/imgImport";
import CustomSpinner from "../common/custom-spinner";
import { FormInput } from "../common/FormControl";
import { CHANGE_BUY_NAME } from "./profile-queries";
import Successful from "./Successful";

export default function ChangeNameModal({ isOpen, setIsOpen }) {
    // Containers
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newName, setNewName] = useState("");
    const [successful, setSuccessful] = useState(false);

    // Webserver
    const [changeBuyName] = useMutation(CHANGE_BUY_NAME, {
        onCompleted: (data) => {
            if (data.changeBuyName === "1") setSuccessful(true);
            setLoading(false);
        },
        onError: (error) => {
            setError(error.message);
            setLoading(false);
        },
    });

    // Methods
    const containsSpecialCharacter = (text) => {
        const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        return format.test(text);
    };
    const submitNameChange = (e) => {
        e.preventDefault();
        setError("");
        if (!newName) return setError("New name cannot be empty");
        if (containsSpecialCharacter(newName))
            return setError("Cannot include special characters");

        setLoading(true);
        changeBuyName({
            variables: {
                newName: newName,
            },
        });
    };
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
                    <img
                        width="14px"
                        height="14px"
                        src={CloseIcon}
                        alt="close"
                    />
                </div>
            </div>

            {successful ? (
                <div className="my-5">
                    <Successful
                        title="Name Changed Successfully"
                        callback={() =>
                            isBrowser && window.location.reload(false)
                        }
                    />
                </div>
            ) : (
                <div className="py-4">
                    <div className="text-center">
                        <p className="text-capitalize fs-30px fw-bold lh-36px">
                            Name change
                        </p>
                        <p className="fs-16px mt-3 text-light fw-normald px-sm-5 px-0">
                            Name change will cost NDB coins, and it will be
                            drawn from your wallet
                        </p>
                    </div>
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 mx-auto text-light mt-4">
                        <form action="form">
                            <div className="form-group">
                                <FormInput
                                    type="text"
                                    label="New Name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Enter a new name"
                                />
                            </div>
                            <div className="mb-3 mt-4">
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
                                    className="btn btn-outline-light rounded-0 w-100 text-uppercase d-flex align-items-end justify-content-center py-2 mt-1"
                                    onClick={submitNameChange}
                                    disabled={loading}
                                >
                                    <div
                                        className={`${
                                            loading ? "opacity-1" : "opacity-0"
                                        }`}
                                    >
                                        <CustomSpinner sm />
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
            )}
        </Modal>
    );
}
