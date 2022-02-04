import React from "react"
import Seo from "../components/seo"
import Header from "../components/header"
import { GreenCoin, NdbToken } from "../utilities/imgImport"

const Presale = () => {
    return (
        <div
            style={{
                // background:
                //     "radial-gradient(54.07% 44.7% at 47.35% 51.98%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
                background: "#000000",
            }}
        >
            <Seo title="Direct Purchase" />
            <main className="home-page">
                <Header />
                <div className="container col-lg-10 mx-auto gap-5">
                    <div
                        className="direct-purchase"
                        style={{
                            backgroundImage: `url(${GreenCoin})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "left center",
                        }}
                    >
                        <div className="d-flex align-items-center">
                            <div className="col-md-6 d-xl-flex flex-xl-column">
                                <div className="next-auction-label">
                                    7 days left
                                </div>
                                <div className="tokens-amount">
                                    604 800
                                    <div className="tokens-left">
                                        tokens left
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex flex-column align-items-center">
                                <div>
                                    <div className="exclusive-label">
                                        exlusive pre-sale of
                                    </div>
                                    <div className="ndb-tokens-label">
                                        ndb token
                                    </div>
                                    <div className="miss-label">
                                        Don't miss an opportunity to get ahold
                                        of NDB Tokens before anyone else at the
                                        fixed price before the auction starts.
                                    </div>
                                    <div className="text-center">
                                        <button className="btn btn-green btn-buy">
                                            buy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Presale
