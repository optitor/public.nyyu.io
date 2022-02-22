import { useQuery } from "@apollo/client"
import React, { useContext } from "react"
import { useState } from "react"
import { GET_AUCTION } from "../../apollo/graghqls/querys/Auction"

export const AuctionContext = React.createContext()
export const useAuction = () => useContext(AuctionContext)

const AuctionProvider = ({ children }) => {
    // Containers
    const [auctions, setAuctions] = useState(null)
    const [currentRoundNumber, setCurrentRoundNumber] = useState(-1)
    const [currentRoundBidList, setCurrentRoundBidList] = useState(null)
    const [bidModal, setBidModal] = useState(false)
    const loading = !auctions

    // Webservices
    useQuery(GET_AUCTION, {
        onCompleted: (data) => {
            setAuctions(data.getAuctions)
            setCurrentRoundNumber(data.getAuctions.length)
        },
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
    }

    // Render
    return (
        <AuctionContext.Provider value={providerValue}>
            {children}
        </AuctionContext.Provider>
    )
}

export default AuctionProvider
