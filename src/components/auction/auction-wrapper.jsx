import React from "react"
import AuctionProvider from "./auction-context"
import Auction from "./index"

const AuctionWrapper = () => {
    return (
        <AuctionProvider>
            <Auction />
        </AuctionProvider>
    )
}

export default AuctionWrapper
