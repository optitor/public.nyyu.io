import React from "react"
import Header from "../header"
import Footer from "../footer"

const AuthLayout = ({ children }) => {
    return (
        <main className="signup-page">
            <Header/>
            <div className="main-part">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-4">
                        <section className="position-relative">
                            <div className="d-flex position-relative h-100 align-items-center">
                                <div className="signup">{children}</div>
                            </div>
                        </section>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-8">
                        <div className="right-background"/>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}

export default AuthLayout
