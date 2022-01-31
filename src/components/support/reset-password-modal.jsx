import React from "react"
import Modal from "react-modal"
import { CloseIcon } from "../../utilities/imgImport"

export default function ResetPasswordModal({ isOpen, setIsOpen }) {
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
            <div className="text-center mt-3">
                <p className="text-capitalize fs-30px fw-bold">reset password</p>
                <p className="fs-16px mt-2 text-light fw-normald">
                    To secure your account, please complete the following verification
                </p>
            </div>
        </Modal>
    )
}
