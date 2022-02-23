import PercentageBar from "./percentage-bar"
import { useAuction } from "./auction-context"
import React, { useState, useEffect } from "react"
import { Currencies } from "../../utilities/staticData"
import { numberWithLength } from "../../utilities/number"

export default function AuctionRoundDetails() {
    // Container
    const auction = useAuction()
    const [minBidValue, setMinBidValue] = useState(Infinity)
    const { auctions, currentRoundNumber, currentRoundBidList } = auction
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
            if (item.totalPrice < min) min = item.totalPrice
        })

        return setMinBidValue(min)
    }

    useEffect(() => findMinBid(), [currentRoundBidList])

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
                        <p className="caption text-[#959595]">Minimum Bid </p>
                        <p className="value">
                            <span className="txt-green">
                                {Currencies[0].symbol + " "}
                            </span>
                            {minBidValue}
                        </p>
                    </div>
                ) : (
                    <div></div>
                )}
                <div>
                    {current.status !== 3 ? (
                        <>
                            <p className="caption text-end text-[#959595]">
                                Available Until
                            </p>
                            <p className="value text-end">
                                {numberWithLength(
                                    parseInt(
                                        new Date(current.endedAt).getHours()
                                    )
                                )}
                                :
                                {numberWithLength(
                                    parseInt(
                                        new Date(current.endedAt).getMinutes()
                                    )
                                )}
                                :
                                {numberWithLength(
                                    parseInt(
                                        new Date(current.endedAt).getSeconds()
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
