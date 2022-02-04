import React from "react"
import Modal from "react-modal"
import { CloseIcon } from "../../utilities/imgImport"

export default function QualifyModal({ isOpen, setIsOpen }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="support-modal border-0 p-5"
            overlayClassName="support-modal__overlay"
        >
            <div className="support-modal__header">
                <div className="text-uppercase fw-bold">
                    <div className="d-flex align-items-center">
                        <div className="gray-circle me-2"></div>
                        <div className="fs-22px">qualify first</div>
                    </div>
                </div>
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
            <div>
                <div className="text-center mt-5 pt-5">
                    <button className="btn btn-outline-light text-uppercase fw-bold rounded-0 mx-auto py-3 px-100px">
                        next
                    </button>
                </div>
            </div>
        </Modal>
    )
}
