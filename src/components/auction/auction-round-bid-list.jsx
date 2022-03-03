import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import { useQuery } from "@apollo/client"

import { GET_BID } from "../../apollo/graghqls/querys/Auction"
import { GET_BIDLIST_BY_ROUND } from "../../apollo/graghqls/querys/Bid"

import { useAuction } from "./auction-context"
import CustomSpinner from "../common/custom-spinner"

import AuctionListHeader from "../common/AuctionListHeader"
import AuctionList from "../common/AuctionList"

export default function AuctionRoundBidList() {
    const currentUser = useSelector((state) => state.auth.user)
    const auction = useAuction()
    const { auctions, currentRoundNumber } = auction
    const [currentRoundBidList, setCurrentRoundBidList] = useState(null)
    const [displayedBitList, setDisplayedBidList] = useState(null)
    const [currentAuctionUserExist, setCurrentAuctionUserExist] = useState(false)
    const [currentUserBidData, setCurrentUserBidData] = useState(null)
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
            <AuctionListHeader totalCount={currentRoundBidList.length} auctionType="Bidder" auctionTitle="Bid" />
            <div className="auction-bid-list-content-group">
                {displayedBitList && displayedBitList.map((item, index) =>
                    <AuctionList
                        key={index}
                        ranking={item.ranking}
                        fullName={item.prefix + "." + item.name}
                        tokenPrice={item.tokenPrice}
                        tokenAmount={item.tokenAmount}
                        isCurrentUser={item.userId === 405}
                    />
                )}
            </div>
            {currentAuctionUserExist &&
                <AuctionList
                    ranking={currentUserBidData.ranking}
                    fullName={currentUserBidData.prefix + "." + currentUserBidData.name}
                    tokenPrice={currentUserBidData.tokenPrice}
                    tokenAmount={currentUserBidData.tokenAmount}
                    isCurrentUser={true}/>
            }
        </div>
    )
}
