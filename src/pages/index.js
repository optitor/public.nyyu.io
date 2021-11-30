import React from "react"
import { Link } from "gatsby"

import Seo from "../components/seo"
import { Hero1 } from "../utilities/imgImport"
import CountDown from "../components/common/countdown"
import Header from "../components/common/header"

const IndexPage = () => {
    return (
        <>
            <Seo title="Home" />
            <main className="home-page">
                <Header />
                <section className="home2 home-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-7">
                                <h2 className="home2-header">Round 20 Ends in</h2>
                                <CountDown />
                                <button className="btn btn-green">Place a bid</button>
                                <br />
                                <Link to="/" className="learn-more">
                                    Learn more
                                </Link>
                            </div>
                            <div className="col-sm-5 d-flex justify-content-center align-items-center">
                                <img src={Hero1} alt="home hero" className="hero-image" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default IndexPage
