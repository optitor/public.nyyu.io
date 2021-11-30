import React from "react"
import Header from "../components/common/header"

import Seo from "../components/seo"
import { Hero2 } from "../utilities/imgImport"

const IndexPage = () => (
    <>
        <Seo title="Home" />
        <main className="home-page">
            <Header />
            <section className="home3 home-section">
                <div className="container">
                    <div className="row home3">
                        <div className="col-sm-7 d-flex flex-column justify-content-center">
                            <h3 className="home3-title">Auction Starts On</h3>
                            <p className="home3-text ">Wednesday 23rd of February</p>
                        </div>
                        <div className="col-sm-5 d-flex justify-content-center align-items-center">
                            <img src={Hero2} alt="home hero" className="hero-image" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>
)

export default IndexPage
