import React from "react"
import { useAuction } from "./auction-context"
import { Tab, TabList } from "react-tabs"
import { numberWithCommas } from "../../utilities/number"

export default function AuctionRoundNavigator() {
    const auction = useAuction()
    const { auctions, currentRoundNumber } = auction
    const current = auctions?.filter(
        (auction) => auction.round === currentRoundNumber
    )[0]
    return (
        <TabList>
            <Tab className="w-100">
                <div className="d-flex justify-content-center flex-column align-items-center">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div>
                            <svg
                                className="icon-25px"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 19l-7-7 7-7"
                                ></path>
                            </svg>
                        </div>
                        <div className="fw-bold text-uppercase fs-30px border-bottom border-3 border-success px-2">
                            <div>
                                Round
                                {" " + current?.round}
                            </div>
                        </div>
                        <div>
                            <svg
                                className="icon-25px"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5l7 7-7 7"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="text-[#959595]">Token Available </span>
                        <span className="fw-500">
                            {numberWithCommas(current?.totalToken)}
                        </span>
                    </div>
                </div>
            </Tab>
        </TabList>
    )
}
