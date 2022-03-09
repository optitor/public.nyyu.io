import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import { useQuery } from "@apollo/client"

import { useAuction } from "../../providers/auction-context"
import CustomSpinner from "../common/custom-spinner"

import AuctionListHeader from "../common/AuctionListHeader"
import AuctionList from "../common/AuctionList"

import { GET_BID } from "../../apollo/graghqls/querys/Auction"
import { GET_BIDLIST_BY_ROUND } from "../../apollo/graghqls/querys/Bid"
import { GET_PRESALE_LIST_BY_ROUND } from "../../apollo/graghqls/querys/Presale"

export default function AuctionRoundBidList() {
    const currentUser = useSelector((state) => state.auth.user)
    const auction = useAuction()
    const { optCurrentRound, currentRoundNumber, isAuction } = auction
    const [currentRoundBidList, setCurrentRoundBidList] = useState(null)
    const [displayedBidList, setDisplayedBidList] = useState(null)
    const [currentAuctionUserExist, setCurrentAuctionUserExist] = useState(false)
    const [currentUserBidData, setCurrentUserBidData] = useState(null)
    const pollIntervalValue = 10000
    const limitDisplayBidCount = 5

    const loadingData = !(
        currentRoundBidList &&
        auction.currentRoundBidList &&
        auction.getBid
    )

    // Webservices
    const { startPolling, stopPolling } = useQuery(isAuction ? GET_BIDLIST_BY_ROUND : GET_PRESALE_LIST_BY_ROUND, {
        variables: isAuction ? {
            round: currentRoundNumber,
        } : {
            presaleId: optCurrentRound.id
        },
        onCompleted: (data) => {
            let list = _.orderBy(
                isAuction ? data?.getBidListByRound : data?.getPresaleOrders,
                isAuction ? ["ranking", "tokenPrice"] : ["ndbAmount"],
                ["asc", "desc"]
            )
            list = list.map((item) => ({
                ...item,
                totalAmount: isAuction ? item.tokenPrice * item.tokenAmount : item.ndbAmount * item.ndbPrice,
                ranking: isAuction ? (item.ranking ? item.ranking : list.indexOf(item) + 1) : list.indexOf(item) + 1,
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
            roundId: optCurrentRound?.id,
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
            if (isAuction) {
                if (currentRoundBidList.length > limitDisplayBidCount ) {
                    const currentUserBidInfo = currentRoundBidList?.filter(
                        (auction) => auction.userId === currentUser.id
                    )[0]
                    if (currentUserBidInfo && currentUserBidInfo.ranking > limitDisplayBidCount) {
                        setCurrentUserBidData(currentUserBidInfo)
                        setCurrentAuctionUserExist(true)
                        setDisplayedBidList(currentRoundBidList.slice(0, currentUserBidInfo.ranking - 1))
                    } else {
                        setDisplayedBidList(currentRoundBidList.slice(0, limitDisplayBidCount))
                    }
                } else {
                    setDisplayedBidList(currentRoundBidList)
                }
            } else {
                if (currentRoundBidList > limitDisplayBidCount) {
                    const currentUserPresaleInfo = currentRoundBidList?.filter(
                        (auction) => auction.userId === currentUser.id
                    )[0]
                }
                setDisplayedBidList(currentRoundBidList)
            }

        }

    }, [currentRoundBidList, currentUser.id])

    useEffect(() => {
        if (optCurrentRound && optCurrentRound.status === 2) return startPolling(pollIntervalValue)
        return stopPolling()
    }, [optCurrentRound, startPolling, stopPolling])

    // Render
    if (loadingData)
        return (
            <div className="text-center mt-4">
                <CustomSpinner />
            </div>
        )

    return (
        <div className="d-flex flex-column align-items-center pt-5 list-part">
            <AuctionListHeader totalCount={currentRoundBidList.length} auctionType={isAuction ? "Bidder" : "Buyer"} auctionTitle={isAuction ? "Bid" : "Order"} />
            <div className="auction-bid-list-content-group">
                {displayedBidList && displayedBidList.map((item, index) =>
                    <AuctionList
                        key={index}
                        ranking={item.ranking}
                        fullName={item.prefix + "." + item.name}
                        tokenPrice={isAuction ? item.tokenPrice : item.ndbPrice}
                        mainAmount={isAuction ? item.tokenAmount * item.tokenPrice : item.ndbAmount}
                        winningResult={item.status !== 0 && item.status === 1 }
                        isCurrentUser={item.userId === currentUser.id}
                    />
                )}
            </div>
            <div className="auction-bid-list-content-final">
                {currentAuctionUserExist &&
                <AuctionList
                    ranking={currentUserBidData.ranking}
                    fullName={currentUserBidData.prefix + "." + currentUserBidData.name}
                    tokenPrice={currentUserBidData.tokenPrice}
                    mainAmount={currentUserBidData.tokenAmount * currentUserBidData.tokenPrice}
                    winningResult={currentUserBidData.status !== 0 && currentUserBidData.status === 1 }
                    isCurrentUser={true}/>
                }
            </div>
        </div>
    )
}
