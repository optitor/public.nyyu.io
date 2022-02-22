import { useQuery } from "@apollo/client"
import React, { useContext } from "react"
import { useState } from "react"
import {
    GET_AUCTION,
    GET_CURRENT_ROUND,
} from "../../apollo/graghqls/querys/Auction"

export const AuctionContext = React.createContext()
export const useAuction = () => useContext(AuctionContext)

const AuctionProvider = ({ children }) => {
    // Containers
    const [auctions, setAuctions] = useState(null)
    const [currentRound, setCurrentRound] = useState(null)
    const [currentRoundNumber, setCurrentRoundNumber] = useState(-1)
    const [currentRoundBidList, setCurrentRoundBidList] = useState(null)
    const loading = !(auctions && currentRound)

    // Webservices
    useQuery(GET_AUCTION, {
        onCompleted: (data) => setAuctions(data.getAuctions),
        onError: (error) => console.log(error),
        errorPolicy: "ignore",
        fetchPolicy: "network-only",
    })
    useQuery(GET_CURRENT_ROUND, {
        onCompleted: (data) => {
            setCurrentRound(data.getCurrentRound)
            setCurrentRoundNumber(data.getCurrentRound.auction.round)
        },
        onError: (error) => console.log(error),
        errorPolicy: "ignore",
        fetchPolicy: "network-only",
    })

    // Binding
    const providerValue = {
        loading,
        auctions,
        currentRound,

        // current round number
        currentRoundNumber,
        setCurrentRoundNumber,

        // curren round bid list
        currentRoundBidList,
        setCurrentRoundBidList,
    }

    // Render
    return (
        <AuctionContext.Provider value={providerValue}>
            {children}
        </AuctionContext.Provider>
    )
}

export default AuctionProvider
