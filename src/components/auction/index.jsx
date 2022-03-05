import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Tabs } from "react-tabs"

import Seo from "../seo"
import Loading from "../common/Loading"
import Header from "../header"

import { useAuction } from "../../providers/auction-context"
import AuctionRoundNavigator from "./auction-round-navigator"
import AuctionRoundBidList from "./auction-round-bid-list"
import AuctionRoundDetails from "./auction-round-details"
import AuctionPlaceBid from "./auction-place-bid"
import AuctionPlaceBidModal from "./auction-place-bid-modal"

const Auction = () => {
    const auction = useAuction()
    const currencyId = useSelector((state) => state?.placeBid.currencyId)
    const { auctions, presales, currentRound, currentRoundNumber } = auction
    const current = auctions?.filter(
        (auction) => auction.round === currentRoundNumber
    )[0]
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (auction.loading === false) {
            if (currentRound.auction) {
                auction.setIsAuction(true)
                auction.setCurrentRoundNumber(auctions.length)
            } else if (currentRound.presale) {
                auction.setIsAuction(false)
                auction.setCurrentRoundNumber(presales.length)
            } else {
                auction.setIsAuction(true)
                auction.setCurrentRoundNumber(auctions.length)
            }
            setLoading(false)
        }
    }, [auction.loading, presales])

    if (loading) return <Loading/>
    return (
        <>
            <Seo title="Sale" />
            <main className="auction-page">
                <Header />
                <section className="section-auction container">
                    <div className="row h-100">
                        <div className="auction-left col-lg-4 col-md-5 position-relative d-block">
                            <div className="d-flex">
                                <div className="w-100">
                                    <Tabs
                                        className="round-tab"
                                        defaultIndex={0}
                                    >
                                        <AuctionRoundNavigator/>
                                    </Tabs>
                                    <AuctionRoundBidList/>
                                </div>
                            </div>
                            <AuctionRoundDetails/>
                            {current?.status !== 3 && (
                                <>
                                    <div className="d-block d-sm-none">
                                        <div
                                            className="btn fw-bold text-uppercase btn-outline-light rounded-0 w-100 mt-3"
                                            onClick={() =>
                                                auction.setBidModal(true)
                                            }
                                        >
                                            place bid
                                        </div>
                                    </div>
                                    <AuctionPlaceBidModal />
                                </>
                            )}
                        </div>

                        <div className="auction-right col-lg-8 col-md-7">
                            <AuctionPlaceBid/>
                        </div>
                    </div>
                </section>
                {current?.status !== 3 && <AuctionPlaceBidModal/>}
            </main>
        </>
    )
}

export default Auction
