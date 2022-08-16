import React, { useState, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import { useQuery } from "@apollo/client"

import { useAuction } from "../../providers/auction-context"
import CustomSpinner from "../common/custom-spinner"
import AuctionListHeader from "../common/AuctionListHeader"
import AuctionList from "../common/AuctionList"

import { GET_BID, GET_CURRENT_ROUND} from "../../apollo/graphqls/querys/Auction"
import { GET_BIDLIST_BY_ROUND } from "../../apollo/graphqls/querys/Bid"
import { GET_PRESALE_LIST_BY_ROUND, GET_NEW_PRESALE_ORDERS } from "../../apollo/graphqls/querys/Presale"
import { setCookie, NDB_Paypal_TrxType, NDB_Auction, NDB_Presale } from '../../utilities/cookies';

export default function AuctionRoundBidList() {
    const currentUser = useSelector((state) => state.auth.user)
    const auction = useAuction()
    const { optCurrentRound, currentRoundNumber, isAuction, setCurrentRound } = auction
    
    const [currentRoundBidList, setCurrentRoundBidList] = useState(null)
    const [displayedBidList, setDisplayedBidList] = useState(null)
    const [currentAuctionUserExist, setCurrentAuctionUserExist] = useState(false)
    const [currentUserBidData, setCurrentUserBidData] = useState(null)
    const pollIntervalValue = 10000

    const loadingData = !(
        currentRoundBidList &&
        auction.currentRoundBidList &&
        auction.getBid
    )

    const lastOrderId = useMemo(() => {
        if(!currentRoundBidList) return null;
        const sortListById = _.orderBy(Object.values(currentRoundBidList), ['id'], ['desc']);
        return sortListById[0]?.id;
    }, [currentRoundBidList]);

    // Webservices
    useQuery(isAuction ? GET_BIDLIST_BY_ROUND : GET_PRESALE_LIST_BY_ROUND, {
        variables: isAuction ? {
            round: currentRoundNumber
        } : {
            presaleId: optCurrentRound?.id
        },
        onCompleted: (data) => {
            let list;
            if(isAuction) {
                list = _.orderBy(data?.getBidListByRound, ["ranking", "tokenPrice"], ["asc", "desc"]);
                list = list.map((item) => ({
                    ...item,
                    totalAmount: item.tokenPrice * item.tokenAmount,
                    ranking: (item.ranking ? item.ranking : list.indexOf(item) + 1)
                }))
            } else {
                let ordersObj = {};
                for(let order of data?.getPresaleOrders) {
                    if(ordersObj[order?.userId]) {
                        const id = ordersObj[order?.userId]?.id >= order?.id ? ordersObj[order?.userId]?.id: order?.id;
                        const ndbAmount = ordersObj[order?.userId]?.ndbAmount + order?.ndbAmount;
                        const paidAmount = ordersObj[order?.userId]?.paidAmount + order?.paidAmount;
                        ordersObj[order?.userId] = { ...ordersObj[order?.userId], ndbAmount, paidAmount, id };
                    } else {
                        ordersObj[order?.userId] = order;
                    }
                }

                list = ordersObj;
            }

            setDisplayedBidList([])
            setCurrentAuctionUserExist(false)
            setCurrentUserBidData([])

            setCurrentRoundBidList(list)
            auction.setCurrentRoundBidList(list)
        },
        onError: (error) => console.log(error),
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
    })

    useQuery(GET_CURRENT_ROUND, {
        onCompleted: (data) => {
            if(data.getCurrentRound) {
                if(data.getCurrentRound.auction) {
                    setCurrentRound(data.getCurrentRound.auction);
                    setCookie(NDB_Paypal_TrxType, NDB_Auction);
                } else if (data.getCurrentRound.presale) {
                    setCurrentRound(data.getCurrentRound.presale);
                    setCookie(NDB_Paypal_TrxType, NDB_Presale);
                } else {
                    setCookie(NDB_Paypal_TrxType, '');
                }
            }
        },
        onError: (error) => console.log(error),
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
    })

    const pollingBidList = useQuery(GET_NEW_PRESALE_ORDERS, {
        variables: {
            presaleId: optCurrentRound?.id,
            lastOrderId
        },
        onCompleted: data => {
            if (data?.getNewPresaleOrders) {
                if(_.isEmpty(data?.getNewPresaleOrders) || !currentRoundBidList) return;

                let orderObj = currentRoundBidList;
                for(let order of data?.getNewPresaleOrders) {
                    if(orderObj[order?.userId]) {
                        if(orderObj[order?.userId]?.id >= order?.id) continue;
                        const id = orderObj[order?.userId]?.id >= order?.id ? orderObj[order?.userId]?.id: order?.id;
                        const ndbAmount = orderObj[order?.userId]?.ndbAmount + order?.ndbAmount;
                        const paidAmount = orderObj[order?.userId]?.paidAmount + order?.paidAmount;
                        orderObj[order?.userId] = { ...orderObj[order?.userId], ndbAmount, paidAmount, id };
                    } else {
                        orderObj[order?.userId] = order;
                    }
                }
                setCurrentRoundBidList({ ...orderObj });
            }
        },
        onError: (error) => console.log(error),
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
        pollInterval: pollIntervalValue,
        notifyOnNetworkStatusChange: true
    });

    useQuery(GET_BID, {
        variables: {
            roundId: optCurrentRound?.id
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
        }
    })

    useEffect(() => {
        if (!_.isEmpty(currentRoundBidList)) {            
            if(isAuction) {
                const currentUserBidInfo = currentRoundBidList?.filter(
                    (auction) => auction.userId === currentUser.id
                )[0]
                if (currentUserBidInfo) {
                    setCurrentUserBidData(currentUserBidInfo)
                    setCurrentAuctionUserExist(true)
                }
                const restList = currentRoundBidList?.filter(
                    (auction) => auction.userId !== currentUser.id
                )
                setDisplayedBidList(restList)
            } else {
                let sortList = _.orderBy(Object.values(currentRoundBidList), ['ndbAmount'], ['desc']);
                const tempList = sortList.map(({ranking, ...item}, key) => ({
                    ...item,
                    ranking: key + 1
                }))
                setDisplayedBidList(tempList);
            }
        }
    }, [currentRoundBidList, currentUser.id, isAuction])

    useEffect(() => {
        if (optCurrentRound && optCurrentRound.status === 2 && currentRoundBidList) return pollingBidList.startPolling(pollIntervalValue)
        return pollingBidList.stopPolling()
    }, [optCurrentRound, pollingBidList, currentRoundBidList]);

    // Render
    if (loadingData)
        return (
            <div className="text-center mt-4">
                <CustomSpinner/>
            </div>
        )

    return (
        <div className="d-flex flex-column align-items-center pt-5 list-part">
            <AuctionListHeader totalCount={displayedBidList.length} auctionType={isAuction ? "Bidder" : "Buyer"}
                               auctionTitle={isAuction ? "Bid" : "Order"}/>
            {currentAuctionUserExist && isAuction ?
            <div className="list-part auction-bid-list-content-final">
                <AuctionList
                    ranking={currentUserBidData.ranking}
                    fullName={currentUserBidData.prefix + "." + currentUserBidData.name}
                    tokenPrice={isAuction ? currentUserBidData.tokenPrice : currentUserBidData.ndbPrice}
                    mainAmount={isAuction ? currentUserBidData.tokenAmount * currentUserBidData.tokenPrice : currentUserBidData.ndbAmount * currentUserBidData.ndbPrice}
                    ndbAmount={isAuction ? currentUserBidData.tokenAmount: currentUserBidData.ndbAmount}
                    winningResult={currentUserBidData.status !== 0 && currentUserBidData.status === 1}
                    isCurrentUser={true}
                />
            </div> : ""}
            <div className="list-part auction-bid-list-content-group">
                {displayedBidList && displayedBidList.map((item, index) =>
                    <AuctionList
                        key={index}
                        ranking={item.ranking}
                        fullName={item.prefix + "." + item.name}
                        tokenPrice={isAuction ? item.tokenPrice : item.ndbPrice}
                        mainAmount={isAuction ? item.tokenAmount * item.tokenPrice : item.ndbAmount * item.ndbPrice}
                        ndbAmount={isAuction ? item.tokenAmount: item.ndbAmount}
                        paidAmount={item.paidAmount}
                        winningResult={item.status !== 0 && item.status === 1}
                        isCurrentUser={item.userId === currentUser.id}
                    />
                )}
            </div>
        </div>
    )
}
