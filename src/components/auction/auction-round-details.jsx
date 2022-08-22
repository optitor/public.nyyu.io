import React from "react"
import { navigate } from "gatsby";
import { useSelector } from "react-redux"
import Countdown, { zeroPad } from 'react-countdown';

import { useAuction } from "../../providers/auction-context"
import { renderNumberFormat } from "../../utilities/number"
import PercentageBar from "./percentage-bar"
import { ROUTES } from "../../utilities/routes";
import { isBrowser } from "../../utilities/auth";

// Renderer callback with condition
const startRoundRender = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      isBrowser && window.location.reload();
      return <span>Started</span>;
    } else {
        // Render a countdown
        return (
            <span>
                {zeroPad(days)}: {zeroPad(hours)}: {zeroPad(minutes)}: <span style={{width: 15, display: 'inline-block'}}>{zeroPad(seconds)}</span>
            </span>
        );
    }
};
const endRoundRender = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      navigate(ROUTES.home);
      return <span>Finished</span>;
    } else {
        // Render a countdown
        return (
            <span>
                {zeroPad(days)}: {zeroPad(hours)}: {zeroPad(minutes)}: <span style={{width: 15, display: 'inline-block'}}>{zeroPad(seconds)}</span>
            </span>
        );
    }
};

export default function AuctionRoundDetails() {
    const currency = useSelector(state => state.favAssets.currency)
    const currencyRates = useSelector(state => state.currencyRates)
    const currencyRate = currencyRates[currency.value] ?? 1

    // Container
    const auction = useAuction()
    const { optCurrentRound, currentRoundBidList, isAuction } = auction

    const soldTokensPercentage = (optCurrentRound?.sold / (isAuction ? optCurrentRound?.totalToken : optCurrentRound?.tokenAmount)) * 100

    // Render
    if (!currentRoundBidList) return <></>
    return (
        <div className="auction-left__bottom">
            <PercentageBar
                percentage={soldTokensPercentage}
                sold={optCurrentRound?.sold}
                total={isAuction ? optCurrentRound?.totalToken : optCurrentRound?.tokenAmount}
            />
            <div className="d-flex justify-content-between mt-20px">
                <div>
                    <p className="caption text-[#959595]">
                        {isAuction ? "Reserved Price" : "Token Price"}{" "}
                    </p>
                    <p className="value">
                        {renderNumberFormat(Number((isAuction ? optCurrentRound?.minPrice : optCurrentRound?.tokenPrice) * currencyRate).toFixed(4), currency.label)}
                    </p>
                </div>
                <div>
                    {optCurrentRound?.status === 1 && (
                        <>
                            <p className="caption text-end text-[#959595]">
                                Time Remaining
                            </p>
                            <p className="value text-end">
                                <Countdown
                                    date={optCurrentRound?.startedAt}
                                    renderer={startRoundRender}
                                />
                            </p>
                        </>
                    )}
                    {optCurrentRound?.status === 2 && (
                        <>
                            <p className="caption text-end text-[#959595]">
                                {isAuction ? "Time Remaining" : "Tokens Remaining"}
                            </p>
                            <p className="value text-end">
                                {isAuction ? 
                                <Countdown
                                    date={optCurrentRound?.endedAt}
                                    renderer={endRoundRender}
                                /> : 
                                optCurrentRound?.tokenAmount - optCurrentRound?.sold}
                            </p>
                        </>
                    )}
                    {optCurrentRound?.status === 3 && <p className="value text-end">Finished</p>}
                </div>
            </div>
        </div>
    )
}
