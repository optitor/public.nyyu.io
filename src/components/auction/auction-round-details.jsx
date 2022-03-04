import React, { useState, useEffect } from "react"

import PercentageBar from "./percentage-bar"
import { useAuction } from "./auction-context"
import { numberWithLength } from "../../utilities/number"

export default function AuctionRoundDetails() {
    // Container
    const auction = useAuction()
    const [minBidValue, setMinBidValue] = useState(Infinity)
    const { auctions, currentRoundNumber, currentRoundBidList } = auction

    const [currentDate, setCurrentDate] = useState(new Date())
    const [restInterval, setRestInterval] = useState(0)

    const current = auctions?.filter(
        (auction) => auction.round === currentRoundNumber
    )[0]
    const soldTokensPercentage = (current?.sold / current?.totalToken) * 100

    // Methods
    const findMinBid = () => {
        if (!currentRoundBidList || currentRoundBidList?.length === 0)
            return setMinBidValue(0.0)

        let min = Infinity
        currentRoundBidList.forEach((item) => {
            if (item.totalAmount < min) min = item.totalAmount
        })

        return setMinBidValue(min)
    }


    useEffect(() => findMinBid(), [currentRoundBidList])

    useEffect(() => {
        const timer = setInterval(()=> setCurrentDate(new Date()), 1000 )
        if (current) {
            setRestInterval(current.endedAt - currentDate)
        }
        return function() {
            clearInterval(timer)
        }
    }, [current, currentDate])

    // Render
    if (!currentRoundBidList) return <></>
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
                                {numberWithLength(
                                    parseInt(
                                        new Date(restInterval).getHours()
                                    )
                                )}
                                :
                                {numberWithLength(
                                    parseInt(
                                        new Date(restInterval).getMinutes()
                                    )
                                )}
                                :
                                {numberWithLength(
                                    parseInt(
                                        new Date(restInterval).getSeconds()
                                    )
                                )}
                            </p>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    )
}
