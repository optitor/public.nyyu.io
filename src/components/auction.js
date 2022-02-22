import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Tabs } from "react-tabs"
import ReactTooltip from "react-tooltip"
import Header from "./header"
import Loading from "./common/Loading"
import Seo from "./seo"
import { Qmark } from "../utilities/imgImport"
import { AUCTION_TOOLTIP_CONTENT1 } from "../utilities/staticData"
import { useAuction } from "./auction/auction-context"
import AuctionRoundNavigator from "./auction/auction-round-navigator"
import AuctionRoundBidList from "./auction/auction-round-bid-list"
import AuctionRoundDetails from "./auction/auction-round-details"
import AuctionPlaceBid from "./auction/auction-place-bid"
import AuctionPlaceBidModal from "./auction/auction-place-bid-modal"

const Auction = () => {
    const auction = useAuction()
    const currencyId = useSelector((state) => state?.placeBid.currencyId)
    const [isBid, setIsBid] = useState(false)

    if (auction.loading) return <Loading />
    return (
        <>
            <Seo title="Sale" />
            <main className="auction-page">
                <Header />
                <section className="section-auction container">
                    <div className="current-round">
                        <div>
                            <h4>Round 1</h4>
                            <p>
                                <span className="text-secondary">
                                    Token Available
                                </span>{" "}
                                <span>100,000</span>
                            </p>
                        </div>
                    </div>
                    <div className="row h-100">
                        <div className="auction-left col-lg-4 col-md-5 position-relative d-block">
                            <div className="d-flex">
                                <div className="w-100">
                                    <Tabs
                                        className="round-tab"
                                        selectedIndex={0}
                                    >
                                        <AuctionRoundNavigator />
                                    </Tabs>
                                    <AuctionRoundBidList />
                                </div>
                                <div className="d-none d-md-block section-auction__tooltip">
                                    <ReactTooltip
                                        place="right"
                                        type="light"
                                        effect="solid"
                                        id="tooltip3"
                                    >
                                        <div
                                            style={{
                                                width: "300px",
                                                color: "#000000",
                                            }}
                                        >
                                            {AUCTION_TOOLTIP_CONTENT1}
                                        </div>
                                    </ReactTooltip>

                                    <img
                                        src={Qmark}
                                        alt="question"
                                        className="ms-3 d-none d-sm-block"
                                        data-for="tooltip3"
                                        data-tip="tooltip3"
                                        style={{
                                            cursor: "pointer",
                                        }}
                                    />
                                </div>
                            </div>
                            <AuctionRoundDetails />
                        </div>

                        <div className="auction-right col-lg-8 col-md-7">
                            <AuctionPlaceBid isBid={isBid} />
                        </div>
                    </div>
                </section>
                <AuctionPlaceBidModal isBid={isBid} />
            </main>
        </>
    )
}

export default Auction
