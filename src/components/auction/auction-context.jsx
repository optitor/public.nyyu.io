import React, { useContext } from "react"

export const AuctionContext = React.createContext()
export const useAuction = () => useContext(AuctionContext)

const AuctionProvider = ({ children }) => {
    const providerValue = {}
    return (
        <AuctionContext.Provider value={providerValue}>
            {children}
        </AuctionContext.Provider>
    )
}

export default AuctionProvider
