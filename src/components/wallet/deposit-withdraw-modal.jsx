import React, { useState } from "react"
import Modal from "react-modal"
import { CloseIcon } from "../../utilities/imgImport"

export default function DepositWithdrawModal({ showModal, setShowModal }) {
    const TYPES = {
        deposit: "DEPOSIT",
        withdraw: "WITHDRAW",
    }
    const [type, setType] = useState(TYPES.deposit)
    return (
        <Modal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            className="deposit-widthdraw-modal"
            overlayClassName="deposit-widthdraw-modal__overlay"
        >
            <div className="d-flex justify-content-between align-items-center">
                <div className="fw-bold h4 text-light">Desposits and withdrawals</div>
                <img
                    className="cursor-pointer"
                    src={CloseIcon}
                    alt="Cross"
                    onClick={() => setShowModal(false)}
                />
            </div>
            <div className="btn-group d-flex justify-content-between mt-3 align-items-center">
                <div
                    className={`btn ${
                        type === TYPES.deposit ? "btn-light" : "btn-outline-light"
                    } rounded-0 col-sm-6 fw-bold py-2`}
                    onClick={() => setType(TYPES.deposit)}
                >
                    Deposit
                </div>
                <div
                    className={`btn ${
                        type === TYPES.withdraw ? "btn-light" : "btn-outline-light"
                    } rounded-0 col-sm-6 fw-bold py-2`}
                    onClick={() => setType(TYPES.withdraw)}
                >
                    Withdraw
                </div>
            </div>
        </Modal>
    )
}
