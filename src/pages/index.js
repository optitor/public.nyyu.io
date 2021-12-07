import React from "react"
import { Link } from "gatsby"

import Seo from "../components/seo"
import { Hero2 } from "../utilities/imgImport"
import CountDown from "../components/common/countdown"
import Header from "../components/common/header"
import { numberWithCommas } from "../utilities/number"

const IndexPage = () => {
    return (
        <>
            <Seo title="Home" />
            <main className="home-page">
                <Header />
                <section className="home-section">
                    <div className="container h-100">
                        <div className="row mt-5 pt-5">
                            <div className="left-part col-md-6">
                                <h3 className="home-title text-start">
                                    <span className="txt-green">Round 20</span>&nbsp; Ends in
                                </h3>
                                <div className="d-flex justify-content-end">
                                    <CountDown />
                                </div>
                                <p className="token-left mt-4">Token Left</p>
                                <p className="token-value">{numberWithCommas(604800, " ")}</p>
                                <button className="btn btn-green">Place a bid</button>
                                <br />
                                <Link to="/" className="learn-more">
                                    Learn more
                                </Link>
                            </div>
                            <div className="right-part col-md-6">
                                <img src={Hero2} alt="home hero" className="hero-image" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default IndexPage
