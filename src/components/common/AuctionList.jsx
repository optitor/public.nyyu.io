import React from "react"
import { useSelector } from 'react-redux'
import { useAuction } from "../../providers/auction-context"

const AuctionList = ({ ranking, fullName, tokenPrice, mainAmount, winningResult, isCurrentUser }) => {
    const currency = useSelector(state => state.placeBid.currency);
    const currencyRates = useSelector(state => state.currencyRates);
    const currencyRate = currencyRates[currency.value]?? 1;

    const {isAuction} = useAuction()
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
                    {isAuction ?
                        <div className="d-flex flex-column">
                            <div className="text-white align-self-end fw-500">{tokenPrice}</div>
                            <div className="text-secondary align-self-end fs-12px">{currency.sign} {Number(mainAmount * currencyRate).toFixed(2)}</div>
                        </div> :
                        <div className="text-white align-self-end fw-500">{currency.sign} {Number(mainAmount * currencyRate).toFixed(2)}</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default AuctionList