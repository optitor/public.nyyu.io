import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import { useQuery } from "@apollo/client"

import { GET_BID } from "../../apollo/graghqls/querys/Auction"
import { GET_BIDLIST_BY_ROUND } from "../../apollo/graghqls/querys/Bid"

import { useAuction } from "./auction-context"
import CustomSpinner from "../common/custom-spinner"

import { GreenCup } from "../../utilities/imgImport"

export default function AuctionRoundBidList() {
    const currentUser = useSelector((state) => state.auth.user)
    const auction = useAuction()
    const { auctions, currentRoundNumber } = auction
    const [currentRoundBidList, setCurrentRoundBidList] = useState(null)
    const [displayedBitList, setDisplayedBidList] = useState(null)
    const [currentAuctionUserExist, setCurrentAuctionUserExist] = useState(false)
    const [currentUserBidData, setCurrentUserBidData] = useState(null);
    const current = auctions?.filter(
        (auction) => auction.round === currentRoundNumber
    )[0]
    const pollIntervalValue = 10000

    const loadingData = !(
        currentRoundBidList &&
        auction.currentRoundBidList &&
        auction.getBid
    )

    // Webservices
    const { startPolling, stopPolling } = useQuery(GET_BIDLIST_BY_ROUND, {
        variables: {
            round: currentRoundNumber,
        },
        onCompleted: (data) => {
            let list = _.orderBy(
                data.getBidListByRound,
                ["ranking", "tokenPrice"],
                ["asc", "desc"]
            )
            list = list.map((item) => ({
                ...item,
                totalAmount: item.tokenPrice * item.tokenAmount,
            }))
            setCurrentRoundBidList(list)
            auction.setCurrentRoundBidList(list)
        },
        onError: (error) => console.log(error),
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
        pollInterval: pollIntervalValue,
        notifyOnNetworkStatusChange: true,
    })

    useQuery(GET_BID, {
        variables: {
            roundId: current?.id,
        },
        onCompleted: (data) => {
            if (data?.getBid === null) {
                auction.setGetBid({})
                return auction.setIsBid(true)
            }
            if (data?.getBid.status === 0) {
                auction.setGetBid({})
                return auction.setIsBid(true)
            }
            auction.setGetBid(data?.getBid)
            return auction.setIsBid(false)
        },
    })

    useEffect(() => {
        if (currentRoundBidList && currentRoundBidList.length) {
            if (currentRoundBidList.length > 5 ) {
                const currentUserBidInfo = currentRoundBidList?.filter(
                    (auction) => auction.userId === 405
                )[0]
                if (currentUserBidInfo && currentUserBidInfo.ranking !== currentRoundBidList.length - 2) {
                    setCurrentUserBidData(currentUserBidInfo)
                    setCurrentAuctionUserExist(true)
                    setDisplayedBidList(currentRoundBidList.slice(0, currentUserBidInfo.ranking - 2))
                } else {
                    setDisplayedBidList(currentRoundBidList.slice(0, 4))
                }
            } else {
                setDisplayedBidList(currentRoundBidList)
            }
        }

    }, [currentRoundBidList]);

    useEffect(() => {
        if (current.status === 2) return startPolling(pollIntervalValue)
        return stopPolling()
    }, [current, startPolling, stopPolling])

    // Render
    if (loadingData)
        return (
            <div className="text-center mt-4">
                <CustomSpinner />
            </div>
        )

    return (
        <div className="d-flex flex-column align-items-center pt-5">
            <div className="w-100 d-flex justify-content-between align-items-center border-bottom-scorpion p-2">
                <div className="d-flex align-items-center justify-content-start">
                    <img src={GreenCup} alt="Green Cup" />
                    <div className="text-white pl-1 fw-bold">{" "}/ {currentRoundBidList.length}</div>
                </div>
                <div className="d-flex align-items-center justify-content-start">
                    <div className="text-white fw-bold">Bidder</div>
                </div>
                <div className="d-flex align-items-center justify-content-end fw-bold">
                    <div className="text-white">Bid
                        <span className="text-success"> (USD)</span>
                    </div>
                </div>
            </div>
            <div className="auction-bid-list-content-group">
                {displayedBitList.map((item, index) =>
                    <div className="w-100 d-flex justify-content-between align-items-center border-bottom-scorpion p-2" key={index}>
                        <div className="d-flex align-items-center justify-content-start">
                            <div className={item.userId === 405 ? "txt-cinnabar fw-bold" : "text-white fw-500"}>{item.ranking}</div>
                        </div>
                        <div className="d-flex align-items-center justify-content-start">
                            <div className={item.userId === 405 ? "txt-cinnabar fw-bold" : "text-white"}>{item.prefix + "." + item.name}</div>
                        </div>
                        <div className="d-flex align-items-center justify-content-end">
                            <div className="d-flex flex-column">
                                <div className="text-white align-self-end fw-500">{item.tokenPrice}</div>
                                <div className="txt-scorpion align-self-end fs-12px">{item.tokenAmount}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {currentAuctionUserExist && <div className="w-100 d-flex justify-content-between align-items-center border-bottom-scorpion p-2">
                <div className="d-flex align-items-center justify-content-start">
                    <div className="txt-cinnabar fw-bold">{currentUserBidData.ranking}</div>
                </div>
                <div className="d-flex align-items-center justify-content-start">
                    <div className="txt-cinnabar fw-bold">{currentUserBidData.prefix + "." + currentUserBidData.name}</div>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                    <div className="d-flex flex-column">
                        <div className="text-white align-self-end fw-500">{currentUserBidData.tokenPrice}</div>
                        <div className="txt-scorpion align-self-end fs-12px">{currentUserBidData.tokenAmount}</div>
                    </div>
                </div>
            </div>}
        </div>
    )
}
