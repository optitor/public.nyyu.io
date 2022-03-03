import React from "react"

const AuctionList = ({ ranking, fullName, tokenPrice, tokenAmount, winningResult, isCurrentUser }) => {
    return (
        <div className="w-100 row border-bottom-scorpion p-2 bid-list-item px-12px">
            <div className="col-3 d-flex align-items-center justify-content-start">
                <div className={`pl-4px ${isCurrentUser ? (winningResult ? "txt-mountainMeadow fw-bold" : "txt-cinnabar fw-bold") : "text-white fw-500"}`}>{ranking}</div>
            </div>
            <div className="col-9 d-flex justify-content-between align-items-center pr-4px">
                <div className="d-flex align-items-center justify-content-start">
                    <div className="d-flex justify-content-center align-items-center">
                        <div className={isCurrentUser ? winningResult ? "txt-mountainMeadow fw-bold" : "txt-cinnabar fw-bold" : "text-white"}>{fullName}</div>
                        {isCurrentUser ? <div className={`w-50px text-center fs-8px ml-8px ${winningResult ? " border-mountainMeadow txt-mountainMeadow" : "border-cinnabar txt-cinnabar"}`}>{winningResult ? "WINNING" : "LOST"}</div> : ""}
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                    <div className="d-flex flex-column">
                        <div className="text-white align-self-end fw-500">{tokenPrice}</div>
                        <div className="txt-scorpion align-self-end fs-12px">{tokenAmount}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuctionList