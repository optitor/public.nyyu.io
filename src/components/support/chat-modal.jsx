import React from "react"
import { GloabIcon } from "../../utilities/imgImport"

export default function ChatModal({ isOpen, setIsOpen }) {
    return (
        <div className={`chat-modal ${isOpen ? "d-block" : "d-none"}`}>
            <div className="chat-modal-header">
                <div className="d-flex align-items-center justify-content-end">
                    <img src={GloabIcon} alt="Glob Icon" />
                    <svg
                        className="down-arrow"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => setIsOpen(false)}
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
    )
}
