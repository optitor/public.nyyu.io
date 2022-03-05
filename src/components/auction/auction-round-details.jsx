import React, { useState, useEffect } from "react"

import { useAuction } from "../../providers/auction-context"
import { numberWithLength } from "../../utilities/number"
import PercentageBar from "./percentage-bar"

export default function AuctionRoundDetails() {
    // Container
    const auction = useAuction()
    const [minBidValue, setMinBidValue] = useState(Infinity)
    const { auctions, currentRoundNumber, currentRoundBidList } = auction
    const [restTime, setRestTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    const getRemainingRoundTime = (difference) => {
        const seconds = Math.floor((difference / 1000) % 60)
        const minutes = Math.floor((difference / (1000 * 60)) % 60)
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        setRestTime({
            hours: hours < 10 ? "0" + hours : hours,
            minutes: minutes < 10 ? "0" + minutes : minutes,
            seconds: seconds < 10 ? "0" + seconds : seconds,
        })
    }

    const current = auctions?.filter(
        (auction) => auction.round === currentRoundNumber
    )[0];
    const soldTokensPercentage = (current?.sold / current?.totalToken) * 100;

    // Methods
    const findMinBid = () => {
        if (!currentRoundBidList || currentRoundBidList?.length === 0)
            return setMinBidValue(0.0);

        let min = Infinity;
        currentRoundBidList.forEach((item) => {
            if (item.totalAmount < min) min = item.totalAmount;
        });

        return setMinBidValue(min);
    };

    useEffect(() => findMinBid(), [currentRoundBidList]);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentTimeMilliSeconds = new Date().getTime()
            const difference = Math.abs(current.endedAt - currentTimeMilliSeconds)
            getRemainingRoundTime(difference)
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [current])

    // Render
    if (!currentRoundBidList) return <></>;
    return (
        <div className="auction-left__bottom">
            <PercentageBar
                percentage={soldTokensPercentage}
                sold={current.sold}
                total={current.totalToken}
            />
            <div className="d-flex justify-content-between mt-4">
                {minBidValue !== 0 ? (
                    <div>
                        <p className="caption text-[#959595]">Reserved Price </p>
                        <p className="value">
                            {minBidValue + " "}
                            <span className="txt-green">
                                USD
                            </span>
                        </p>
                    </div>
                ) : (
                    ""
                )}
                <div>
                    {current.status !== 3 ? (
                        <>
                            <p className="caption text-end text-[#959595]">
                                Time Remaining
                            </p>
                            <p className="value text-end">
                                {numberWithLength(restTime.hours,2)}
                                :
                                {numberWithLength(restTime.minutes, 2)}
                                :
                                {numberWithLength(restTime.seconds, 2)}
                            </p>
                        </>
                    ) : (
                        <p className="value text-end">Finished</p>
                    )}
                </div>
            </div>
        </div>
    );
}
