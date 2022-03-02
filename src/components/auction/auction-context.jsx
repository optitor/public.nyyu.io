import React, { useContext, useState } from "react"
import { useQuery } from "@apollo/client"

import {
    GET_AUCTION,
    GET_CURRENT_ROUND,
    GET_PRESALES,
} from "../../apollo/graghqls/querys/Auction"

export const AuctionContext = React.createContext()
export const useAuction = () => useContext(AuctionContext)

const AuctionProvider = ({ children }) => {
    // Containers
    const [auctions, setAuctions] = useState(null)
    const [currentRoundNumber, setCurrentRoundNumber] = useState(-1)
    const [currentRoundBidList, setCurrentRoundBidList] = useState(null)
    const [bidModal, setBidModal] = useState(false)
    const [getBid, setGetBid] = useState(null)
    const [isBid, setIsBid] = useState(null)
    const [isAuction, setIsAuction] = useState(true)
    const [currentRound, setCurrentRound] = useState(null)

    // PreSale
    const [presales, setPresales] = useState(null)

    const loading = !(auctions && presales && currentRound)

    // Webservices
    useQuery(GET_AUCTION, {
        onCompleted: (data) => {
            setAuctions(data.getAuctions)
        },
        onError: (error) => console.log(error),
        errorPolicy: "ignore",
        fetchPolicy: "network-only",
    })

    useQuery(GET_PRESALES, {
        onCompleted: (data) => {
            setPresales(data.getPreSales)
        },
        onError: (error) => console.log(error),
        errorPolicy: "ignore",
        fetchPolicy: "network-only",
    })
    useQuery(GET_CURRENT_ROUND, {
        onCompleted: (data) => setCurrentRound(data.getCurrentRound),
        onError: (error) => console.log(error),
        errorPolicy: "ignore",
        fetchPolicy: "network-only",
    })

    // Binding
    const providerValue = {
        loading,
        auctions,

        // current round number
        currentRoundNumber,
        setCurrentRoundNumber,

        // curren round bid list
        currentRoundBidList,
        setCurrentRoundBidList,

        // bid modal
        bidModal,
        setBidModal,

        // is bid
        isBid,
        setIsBid,

        // get bid
        getBid,
        setGetBid,

        // current round
        currentRound,
        setCurrentRound,

        // is auction or not
        isAuction,
        setIsAuction,
    }

    // Render
    return (
        <AuctionContext.Provider value={providerValue}>
            {children}
        </AuctionContext.Provider>
    )
}

export default AuctionProvider
