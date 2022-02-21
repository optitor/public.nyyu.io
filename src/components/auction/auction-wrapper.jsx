import React from "react"
import AuctionProvider from "./auction-context"
import Auction from "../auction"

const AuctionWrapper = () => {
    return (
        <AuctionProvider>
            <Auction />
        </AuctionProvider>
    )
}

export default AuctionWrapper
