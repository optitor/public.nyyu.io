import React, { useEffect, useState } from "react"
import { Tab, TabList } from "react-tabs";

import { useAuction } from "../../providers/auction-context";

import { numberWithCommas } from "../../utilities/number";

export default function AuctionRoundNavigator() {
    // Containers
    const auction = useAuction();
    const { optCurrentRound, entireRounds, currentRoundNumber, setCurrentRoundNumber, isAuction } = auction;
    const [canGoNext, setCanGoNext] = useState(true)
    const [canGoBack, setCanGoBack] = useState(true)

    useEffect(() => {
        setCanGoNext(entireRounds?.length !== currentRoundNumber)
    }, [entireRounds, currentRoundNumber])

    useEffect(() => {
        setCanGoBack(currentRoundNumber !== 1)
    }, [])

    // Methods
    const reset = () => {
        auction.setCurrentRoundBidList(null);
    };
    const goBack = () => {
        if (canGoBack) {
            setCurrentRoundNumber(auction.currentRoundNumber - 1);
            reset();
        }
    };
    const goNext = () => {
        if (canGoNext) {
            setCurrentRoundNumber(auction.currentRoundNumber + 1);
            reset();
        }
    };

    // Render
    return (
        <TabList>
            <Tab className="w-100">
                <div className="d-flex justify-content-center flex-column align-items-center">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <button
                            className="btn text-light cursor-pointer"
                            onClick={goBack}
                        >
                            {/* Previous */}
                            <svg
                                className={`icon-25px ${
                                    !canGoBack && "text-secondary"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <div className="fw-bold text-uppercase fs-30px border-bottom border-3 border-success px-2">
                            <div>
                                Round
                                {" " + optCurrentRound?.round}
                            </div>
                        </div>
                        <button
                            className="btn text-light cursor-pointer"
                            onClick={goNext}
                        >
                            {/* Next */}
                            <svg
                                className={`icon-25px ${
                                    !canGoNext && "text-secondary"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-3">
                        <span className="text-[#959595]">Token Available </span>
                        <span className="fw-500">
                            {numberWithCommas(isAuction ? optCurrentRound?.totalToken : optCurrentRound?.tokenAmount)}
                        </span>
                    </div>
                </div>
            </Tab>
        </TabList>
    );
}
