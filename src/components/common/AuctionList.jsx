import React from "react"
import { useSelector } from "react-redux"
import { useAuction } from "../../providers/auction-context"
import { renderNumberFormat } from "../../utilities/number"

const AuctionList = ({ ranking, fullName, tokenPrice, mainAmount, paidAmount, winningResult, isCurrentUser }) => {
    const currency = useSelector(state => state.favAssets.currency)
    const currencyRates = useSelector(state => state.currencyRates)
    const { isAuction } = useAuction()

    const currencyRate = currencyRates[currency.value] ?? 1
    const totalBidAmount = renderNumberFormat((mainAmount * currencyRate), '', 2, 'dimgrey');
    const totalPaidAmount = renderNumberFormat((paidAmount * currencyRate), '', 2);

    return (
        <div className="w-100 row border-bottom-scorpion p-2 bid-list-item px-12px">
            <div className="col-2 d-flex align-items-center justify-content-start">
                <div
                    className={`pl-4px ${(isCurrentUser && isAuction) ? (winningResult ? "txt-mountainMeadow fw-bold" : "txt-cinnabar fw-bold") : "text-white fw-500"}`}>{ranking}</div>
            </div>
            <div className="col-10 d-flex justify-content-between align-items-center pr-4px">
                <div className="d-flex align-items-center justify-content-start">
                    <div className="d-flex justify-content-center align-items-center">
                        <div
                            className={(isCurrentUser && isAuction) ? winningResult ? "txt-mountainMeadow fw-bold" : "txt-cinnabar fw-bold" : "text-white"}>{fullName}</div>
                        {(isCurrentUser && isAuction) ? <span
                            className={`w-50px text-center fs-8px ml-8px ${winningResult ? " border-mountainMeadow txt-mountainMeadow" : "border-cinnabar txt-cinnabar"}`}>{winningResult ? "WINNING" : "LOST"}</span> : ""}
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                    {isAuction ?
                        <div className="d-flex flex-column">
                            <div className="text-white align-self-end fw-500">{tokenPrice}</div>
                            <div className="text-secondary align-self-end fs-12px">{totalBidAmount}</div>
                        </div> :
                        <div className="d-flex flex-column">
                            <div className="align-self-end fw-500">{totalPaidAmount}</div>
                            <div className="align-self-end fs-12px">{totalBidAmount}</div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default AuctionList