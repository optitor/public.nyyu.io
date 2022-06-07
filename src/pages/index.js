import React, { useState, useEffect } from "react"
import { Link, navigate } from "gatsby"
import Seo from "../components/seo"
import { Certik, Hero2 } from "../utilities/imgImport"
import CountDown from "../components/common/countdown"
import Header from "../components/header"
import PaypalRedirect from '../components/payment/PaypalRedirect'
import { numberWithCommas } from "../utilities/number"
import { useAuth } from "../hooks/useAuth"
import { ROUTES, isRedirectUrl } from "../utilities/routes"
import ReferToFriendsModal from "../components/home/refer-to-friends-modal"
import Loading from "../components/common/FadeLoading"
import { useQuery } from "@apollo/client"
import { GET_CURRENT_ROUND } from "../apollo/graphqls/querys/Auction"
import CountDownPending from "../components/common/countdown-pending"

const IndexPage = () => {
    // Containers
    const auth = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [currentRound, setCurrentRound] = useState(null)

    // For catching the redirect Url from Paypal.
    useEffect(() => {
        if (isRedirectUrl) setLoading(true);
    }, []);

    // Webservice
    useQuery(GET_CURRENT_ROUND, {
        onCompleted: (data) => {
            if (isRedirectUrl) return;
            setCurrentRound(data?.getCurrentRound)
            return setLoading(false)
        },
        onError: (error) => console.log(error),
        errorPolicy: "ignore",
        fetchPolicy: "network-only",
    })

    const auctionRound = currentRound?.auction?.round
    const auctionStatus = currentRound?.auction?.status
    const auctionTotalToken = currentRound?.auction?.totalToken
    const auctionSold = currentRound?.auction?.sold
    const auctionStart = currentRound?.auction?.startedAt
    const auctionEnd = currentRound?.auction?.endedAt

    const presaleRound = currentRound?.presale?.round
    const presaleStatus = currentRound?.presale?.status
    const presaleTotalToken = currentRound?.presale?.tokenAmount
    const presaleSold = currentRound?.presale?.sold
    const presaleStart = currentRound?.presale?.startedAt
    const presaleEnd = currentRound?.presale?.endedAt

    // Methods
    const placeABidButtonClick = () =>
        auth?.isLoggedIn() ? navigate(ROUTES.auction) : navigate(ROUTES.signIn)
    
    const handleActionAfterDeadline = (status = 1) => {
        if(status === 1) {
            navigate(ROUTES.auction);
        } else {
            setCurrentRound(null);
        }
    };

    const auctionStartedContent = (
        <div className="left-part col-md-6 px-0 pe-sm-auto">
            <h3 className="home-title d-sm-block d-none">
                <div>
                    <span className="txt-green">round {auctionRound}</span> ends in
                </div>
                <CountDown deadline={auctionStatus === 2 ? auctionEnd : auctionStart}
                    actionAfterDeadline={() => handleActionAfterDeadline(auctionStatus)}
                />
            </h3>
            <h3 className="home-title-mobile d-sm-none d-block mb-5 mb-sm-0">
                <div className="mb-3">
                    <span className="txt-green">round {auctionRound}</span> ends in
                </div>
                <CountDown deadline={auctionStatus === 2 ? auctionEnd : auctionStart}
                    actionAfterDeadline={() => handleActionAfterDeadline(auctionStatus)}
                />
            </h3>
            <div className="tokens-lower-part mt-5 mt-sm-0">
                <p className="token-left text-uppercase token-left-mobile d-sm-none d-block">
                    tokens left
                </p>
                <p className="token-value mt-2 mt-sm-0">
                    {numberWithCommas(auctionTotalToken - auctionSold, " ")}
                </p>
                <p className="token-left text-uppercase d-sm-block d-none">
                    tokens left in this round
                </p>
                <div className="cta mt-2 mt-sm-0 px-1 px-sm-0">
                    <button
                        className="btn btn-green white-space-nowrap"
                        onClick={placeABidButtonClick}
                    >
                        place a bid
                    </button>
                    <br />
                    <div
                        className="learn-more mt-3 mt-sm-0"
                        onClick={() => setIsModalOpen(true)}
                        onKeyDown={() => setIsModalOpen(true)}
                        role="presentation"
                    >
                        Refer to friends
                    </div>
                </div>
                <div className="mx-auto col-lg-8 mt-5 col-10">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="mt-9px">
                            <img src={Certik} alt="audited by certik" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const auctionPendingContent = (
        <div className="left-part col-md-6 px-0 pe-sm-auto">
            <h3 className="home-title d-sm-block d-none text-center pe-0">
                <div className="mb-4">
                    <div>
                        <span className="txt-green">
                            round {auctionRound - 1}
                        </span>{" "}
                        ended
                    </div>
                    <div>next round starts</div>
                </div>
                <CountDownPending deadline={auctionStart} actionAfterDeadline={() => handleActionAfterDeadline()} />
            </h3>
            <h3 className="home-title-mobile d-sm-none d-block mb-5 mb-sm-0">
                <div className="mb-3 fs-36px">
                    <div className="mb-3">
                        <span className="txt-green">
                            round {auctionRound - 1}
                        </span>{" "}
                        ended
                    </div>
                    <div>next round starts</div>
                </div>
                <CountDownPending deadline={auctionStart} actionAfterDeadline={() => handleActionAfterDeadline()} />
            </h3>
            <div className="tokens-lower-part mt-sm-0">
                <div className="cta mt-sm-0 px-1 px-sm-0">
                    <button className="btn btn-green white-space-nowrap">
                        get notify
                    </button>
                    <br />
                    <div
                        className="learn-more mt-3 mt-sm-0"
                        onClick={() => setIsModalOpen(true)}
                        onKeyDown={() => setIsModalOpen(true)}
                        role="presentation"
                    >
                        Refer to friends
                    </div>
                </div>
                <div className="mx-auto col-lg-8 mt-5 col-10">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="mt-9px">
                            <img src={Certik} alt="audited by certik" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const presaleStartedContent = (
        <div className="left-part col-md-6 px-0 pe-sm-auto">
            <h3 className="home-title d-sm-block d-none">
                <div>
                    <span className="txt-green">round {presaleRound}</span>{" "} ends in
                </div>
                <CountDown
                    deadline={presaleStatus === 2 ? presaleEnd : presaleStart}
                    actionAfterDeadline={() => handleActionAfterDeadline(presaleStatus)}
                />
            </h3>
            <h3 className="home-title-mobile d-sm-none d-block mb-5 mb-sm-0">
                <div className="mb-3">
                    <span className="txt-green">round {presaleRound}</span>{" "} ends in
                </div>
                <CountDown
                    deadline={presaleStatus === 2 ? presaleEnd : presaleStart}
                    actionAfterDeadline={() => handleActionAfterDeadline(presaleStatus)}
                />
            </h3>
            <div className="tokens-lower-part mt-5 mt-sm-0">
                <p className="token-left text-uppercase token-left-mobile d-sm-none d-block">
                    tokens left
                </p>
                <p className="token-value mt-2 mt-sm-0">
                    {numberWithCommas(presaleTotalToken - presaleSold, " ")}
                </p>
                <p className="token-left text-uppercase d-sm-block d-none">
                    tokens left in this round
                </p>
                <div className="cta mt-2 mt-sm-0 px-1 px-sm-0">
                    <button
                        className="btn btn-green white-space-nowrap"
                        onClick={placeABidButtonClick}
                    >
                        place a bid
                    </button>
                    <br />
                    <div
                        className="learn-more mt-3 mt-sm-0"
                        onClick={() => setIsModalOpen(true)}
                        onKeyDown={() => setIsModalOpen(true)}
                        role="presentation"
                    >
                        Refer to friends
                    </div>
                </div>
                <div className="mx-auto col-lg-8 mt-5 col-10">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="mt-9px">
                            <img src={Certik} alt="audited by certik" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const presalePendingContent = (
        <div className="left-part col-md-6 px-0 pe-sm-auto">
            <h3 className="home-title d-sm-block d-none text-center pe-0">
                <div className="mb-4">
                    <div>
                        <span className="txt-green">
                            round {presaleRound - 1}
                        </span>{" "}
                        ended
                    </div>
                    <div>next round starts</div>
                </div>
                <CountDownPending deadline={presaleStart} actionAfterDeadline={() => handleActionAfterDeadline()} />
            </h3>
            <h3 className="home-title-mobile d-sm-none d-block mb-5 mb-sm-0">
                <div className="mb-3 fs-36px">
                    <div className="mb-3">
                        <span className="txt-green">
                            round {presaleRound - 1}
                        </span>{" "}
                        ended
                    </div>
                    <div>next round starts</div>
                </div>
                <CountDownPending deadline={presaleStart} actionAfterDeadline={() => handleActionAfterDeadline()} />
            </h3>
            <div className="tokens-lower-part mt-sm-0">
                <div className="cta mt-sm-0 px-1 px-sm-0">
                    <button className="btn btn-green white-space-nowrap">
                        Be notified
                    </button>
                    <br />
                    <div
                        className="learn-more mt-3 mt-sm-0"
                        onClick={() => setIsModalOpen(true)}
                        onKeyDown={() => setIsModalOpen(true)}
                        role="presentation"
                    >
                        Refer to friends
                    </div>
                </div>
                <div className="mx-auto col-lg-8 mt-5 col-10">
                    <div className="d-flex align-items-center justify-content-center">
                        <div className="mt-9px">
                            <img src={Certik} alt="audited by certik" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const noContent = (
        <div className="left-part col-md-6 px-0 pe-sm-auto">
            <div className="text-light home-page-no-active-round d-flex flex-column justify-content-center h-100">
                <div className="title">Presale will start soon!</div>
                <div className="sub-title">
                    <Link to="https://share.hsforms.com/1uASSxWOlQsWUX3inkpWpTQ4jiis">subscribe</Link> to our waiting list.
                </div>
            </div>
        </div>
    )

    // Render
    if (loading) return (
        <>
            <Loading />
            <PaypalRedirect />
        </>
    );
    return (
        <div>
            <Seo title="Home" />
            <main className="home-page">
                <Header />
                <ReferToFriendsModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
                <section className="home-section mt-5 mt-sm-0">
                    <div className="container h-100 d-flex flex-column justify-content-xl-center justify-content-start mt-5 mt-md-0">
                        <div className="row m-0">
                            {currentRound?.auction
                                ? auctionStatus === 1
                                    ? auctionPendingContent
                                    : auctionStartedContent
                                : currentRound?.presale
                                    ? presaleStatus === 1
                                        ? presalePendingContent
                                        : presaleStartedContent
                                    : noContent}
                            <div className="col-md-1 d-none d-sm-block"></div>
                            <div className="right-part col-md-5 d-none d-sm-block d-md-flex">
                                <img
                                    src={Hero2}
                                    alt="home hero"
                                    className="hero-image img-fluid"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default IndexPage
