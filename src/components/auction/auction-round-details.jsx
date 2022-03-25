import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { useAuction } from "../../providers/auction-context"
import { numberWithLength } from "../../utilities/number"
import PercentageBar from "./percentage-bar"

export default function AuctionRoundDetails() {
    const currency = useSelector(state => state.placeBid.currency)
    const currencyRates = useSelector(state => state.currencyRates)
    const currencyRate = currencyRates[currency.value] ?? 1

    // Container
    const auction = useAuction()
    const { optCurrentRound, currentRoundBidList, isAuction } = auction
    const [restTime, setRestTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    })
    const getRemainingRoundTime = (difference) => {
        const seconds = Math.floor((difference / 1000) % 60)
        const minutes = Math.floor((difference / (1000 * 60)) % 60)
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        setRestTime({
            hours: hours < 10 ? "0" + hours : hours,
            minutes: minutes < 10 ? "0" + minutes : minutes,
            seconds: seconds < 10 ? "0" + seconds : seconds
        })
    }

    const soldTokensPercentage = (optCurrentRound?.sold / (isAuction ? optCurrentRound?.totalToken : optCurrentRound?.tokenAmount)) * 100

    useEffect(() => {
        const timer = setInterval(() => {
            const currentTimeMilliSeconds = new Date().getTime()
            if (optCurrentRound.status === 2) {
                const difference = Math.abs(optCurrentRound.endedAt - currentTimeMilliSeconds)
                getRemainingRoundTime(difference)
            } else if (optCurrentRound.status === 1) {
                const difference = Math.abs(currentTimeMilliSeconds - optCurrentRound.startedAt)
                getRemainingRoundTime(difference)
            }
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [optCurrentRound])

    // Render
    if (!currentRoundBidList) return <></>
    return (
        <div className="auction-left__bottom">
            <PercentageBar
                percentage={soldTokensPercentage}
                sold={optCurrentRound.sold}
                total={isAuction ? optCurrentRound?.totalToken : optCurrentRound?.tokenAmount}
            />
            <div className="d-flex justify-content-between mt-20px">
                <div>
                    <p className="caption text-[#959595]">
                        {isAuction ? "Reserved Price" : "Token Price"}{" "}
                    </p>
                    <p className="value">
                        {Number((isAuction ? optCurrentRound.minPrice : optCurrentRound.tokenPrice) * currencyRate).toFixed(3)}
                        <span className="txt-green ms-1">
                            {currency.label}
                        </span>
                    </p>
                </div>
                <div>
                    {optCurrentRound.status !== 3 ? (
                        <>
                            <p className="caption text-end text-[#959595]">
                                {isAuction ? "Time Remaining" : "Tokens Remaining"}
                            </p>
                            <p className="value text-end">
                                {isAuction ? numberWithLength(restTime.hours, 2) + ":" + numberWithLength(restTime.minutes, 2) + ":" + numberWithLength(restTime.seconds, 2) : optCurrentRound.tokenAmount - optCurrentRound.sold}
                            </p>
                        </>
                    ) : (
                        <p className="value text-end">Finished</p>
                    )}
                </div>
            </div>
        </div>
    )
}
