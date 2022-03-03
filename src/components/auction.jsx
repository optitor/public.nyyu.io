import Seo from "./seo"
import Header from "./header"
import { Tabs } from "react-tabs"
import React, { useState, useEffect } from "react"
import Loading from "./common/Loading"
import ReactTooltip from "react-tooltip"
import { Qmark } from "../utilities/imgImport"
import { useAuction } from "./auction/auction-context"
import AuctionPlaceBid from "./auction/auction-place-bid"
import AuctionRoundBidList from "./auction/auction-round-bid-list"
import AuctionRoundDetails from "./auction/auction-round-details"
import { AUCTION_TOOLTIP_CONTENT1 } from "../utilities/staticData"
import AuctionPlaceBidModal from "./auction/auction-place-bid-modal"
import AuctionRoundNavigator from "./auction/auction-round-navigator"

const Auction = () => {
    const auction = useAuction();
    const { auctions, presales, currentRound, currentRoundNumber } = auction;
    const current = auctions?.filter(
        (auction) => auction.round === currentRoundNumber
    )[0]
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        if (auction.loading === false) {
            if (currentRound.auction && auctions) {
                auction.setIsAuction(true);
                auction.setCurrentRoundNumber(auctions.length);
            } else if (currentRound.presale && presales) {
                auction.setIsAuction(false);
                auction.setCurrentRoundNumber(presales.length);
            } else {
                auction.setIsAuction(true);
                auction.setCurrentRoundNumber(auctions.length);
            }
            setLoading(false);
        }
    }, [
        auction.loading,
        auctions,
        auction,
        currentRound?.auction,
        currentRound?.presale,
        auctions?.length,
        presales?.length,
    ]);

    if (loading) return <Loading />;
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
                            <AuctionPlaceBid />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Auction;
