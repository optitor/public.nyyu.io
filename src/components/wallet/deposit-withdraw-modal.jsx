import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import { CloseIcon } from "../../utilities/imgImport"
import { TRANSACTION_TYPES } from "../../utilities/staticData"

export default function DepositWithdrawModal({ showModal, setShowModal, transactionType }) {
    const [type, setType] = useState(transactionType)
    return (
        <Modal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            className="deposit-widthdraw-modal"
            overlayClassName="deposit-widthdraw-modal__overlay"
            ariaHideApp={false}
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
                        type === TRANSACTION_TYPES.deposit ? "btn-light" : "btn-outline-light"
                    } rounded-0 col-sm-6 fw-bold py-2`}
                    onClick={() => setType(TRANSACTION_TYPES.deposit)}
                >
                    Deposit
                </div>
                <div
                    className={`btn ${
                        type === TRANSACTION_TYPES.withdraw ? "btn-light" : "btn-outline-light"
                    } rounded-0 col-sm-6 fw-bold py-2`}
                    onClick={() => setType(TRANSACTION_TYPES.withdraw)}
                >
                    Withdraw
                </div>
            </div>
        </Modal>
    )
}
