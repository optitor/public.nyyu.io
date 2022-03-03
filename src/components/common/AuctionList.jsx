import React from "react"

const AuctionList = ({ ranking, fullName, tokenPrice, tokenAmount, winningResult, isCurrentUser }) => {

    return (
        <div className="w-100 d-flex justify-content-between align-items-center border-bottom-scorpion p-2">
            <div className="d-flex align-items-center justify-content-start">
                <div className={isCurrentUser === 405 ? "txt-cinnabar fw-bold" : "text-white fw-500"}>{ranking}</div>
            </div>
            <div className="d-flex align-items-center justify-content-start">
                <div className={isCurrentUser ? "txt-cinnabar fw-bold" : "text-white"}>{fullName}</div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
                <div className="d-flex flex-column">
                    <div className="text-white align-self-end fw-500">{tokenPrice}</div>
                    <div className="txt-scorpion align-self-end fs-12px">{tokenAmount}</div>
                </div>
            </div>
        </div>
    )
}

export default AuctionList