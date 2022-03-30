/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navigate } from 'gatsby';

import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Header from "../header";
import Loading from "../common/Loading";
import { numberWithCommas } from "../../utilities/number";
import {
    CryptoCoin,
    Paypal,
    Credit,
    NdbWallet,
    ExternalWallet,
    PaypalBrand,
} from "../../utilities/imgImport";
import Seo from "./../seo";
import CreditCardTab from "./credit-card-tab";
import CoinPaymentsTab from "./CoinPaymentsTab";
import OrderSummary from "./order-summary";
import OrderSummaryOfCoinPayments from "./OrderSummaryOfCoinPayments";
import OrderSummaryOfCreditCard from "./order-summary-of-credit-card";
import { set_All_Fees } from "../../redux/actions/allFeesAction";
import OrderSummaryNDBWallet from "./OrderSummaryNDBWallet";
import NDBWalletTab from "./NDBWalletTab";
import PaymentExternalWalletTab from "./payment-external-wallet-tab";
import { GET_ALL_FEES } from "../../apollo/graphqls/querys/Payment";
import { GET_AUCTION } from "../../apollo/graphqls/querys/Auction";
import { PAYPAL_FOR_AUCTION, PAYPAL_FOR_PRESALE } from "../../apollo/graphqls/mutations/Payment";
import { getCookie, NDB_Paypal_TrxType, NDB_Auction, NDB_Presale } from '../../utilities/cookies';
import { ROUTES } from "../../utilities/routes"


const payment_types = [
    { icon: CryptoCoin, value: "cryptocoin", label: "Cryptocoin" },
    { icon: Credit, value: "creditcard", label: "Credit / Debit card" },
    { icon: Paypal, value: "paypal", label: "PayPal" },
    { icon: NdbWallet, value: "ndb_wallet", label: "Ndb wallet" },
    {
        icon: ExternalWallet,
        value: "externalwallets",
        label: "External Wallets",
    },
];

const Payment = () => {
    const { round_id: currentRound, bid_amount: bidAmount, order_id: orderId } = useSelector(state => state?.placeBid);
    const [totalRounds, setTotalRounds] = useState(null);
    const [barProgress, setBarProgress] = useState(null);
    const [currentCap, setCurrentCap] = useState(120000000000); // Hardcoded value
    const [allFees, setAllFees] = useState(null);
    const [payPalLoading, setPayPalLoading] = useState(false);

    const dispatch = useDispatch();
    const loading = !(totalRounds && barProgress && allFees && !payPalLoading);
    console.log(totalRounds, barProgress, allFees, payPalLoading)
    const targetCap = 1000000000000;
    const isSSR = typeof window === "undefined";
    if (!isSSR && !currentRound) navigate(ROUTES.auction);
    // TODO: uncomment the above line later on.

    const [tabIndex, setTabIndex] = useState(0);

    useQuery(GET_AUCTION, {
        onCompleted: (data) => {
            setTotalRounds(data.getAuctions?.length);
            setBarProgress((currentCap * 100) / targetCap);
        },
        onError: (error) => console.log(error),
        errorPolicy: "ignore",
        fetchPolicy: "network-only",
    });
    useQuery(GET_ALL_FEES, {
        onCompleted: (data) => {
            setAllFees(data.getAllFees);
            const allFees = _.mapKeys(data.getAllFees, "tierLevel");

            if (allFees) {
                dispatch(set_All_Fees(allFees));
            }
        },
        onError: (error) => console.log(error),
    });

    useEffect(() => {
        if (barProgress < 1) setBarProgress(1);
    }, [barProgress]);

    const [paypalForAuctionMutation] = useMutation(PAYPAL_FOR_AUCTION, {
        onCompleted: (data) => {
            let links = data.paypalForAuction.links;
            for (let i = 0; i < links.length; i++) {
                if (links[i].rel === "approve") {
                    setPayPalLoading(false);
                    window.location.href = links[i].href;
                    break;
                }
            }
        },
        onError: (err) => {
            console.log(err);
            alert("Error in PayPal checkout");
            setPayPalLoading(false);
        },
    });

    const [paypalForPresaleMutation] = useMutation(PAYPAL_FOR_PRESALE, {
        onCompleted: (data) => {
            let links = data.paypalForPresale.links;
            for (let i = 0; i < links.length; i++) {
                if (links[i].rel === "approve") {
                    setPayPalLoading(false);
                    window.location.href = links[i].href;
                    break;
                }
            }
        },
        onError: (err) => {
            console.log(err);
            alert("Error in PayPal checkout");
            setPayPalLoading(false);
        },
    });

    const initPaypal = () => {
        setPayPalLoading(true);
        const paypalTrxType = getCookie(NDB_Paypal_TrxType);
        if(paypalTrxType === NDB_Auction) {
            paypalForAuctionMutation({
                variables: { roundId: currentRound, currencyCode: "USD" },
            });
        } else if( paypalTrxType === NDB_Presale) {
            paypalForPresaleMutation({
                variables: { roundId: currentRound, orderId, currencyCode: "USD" },
            });
        }
    };

    if (loading) return <Loading />;
    return (
        <>
            <Seo title="Payment" />
            <main className="payment-page">
                <Header />
                <section className="container position-relative">
                    <div className="row payment-wrapper">
                        <div className="col-lg-8 payment-select">
                            <div className="payment-type__tab">
                                <div className="payment-type__tab-name">
                                    {tabIndex !== 0 && (
                                        <FontAwesomeIcon
                                            icon={faArrowLeft}
                                            className="left-arrow cursor-pointer text-light"
                                            size="lg"
                                            onClick={() => setTabIndex(0)}
                                        />
                                    )}
                                    <h4>
                                        {tabIndex === 0
                                            ? "How do you want to pay?"
                                            : payment_types[tabIndex - 1].label}
                                    </h4>
                                </div>
                                {tabIndex === 0 && (
                                    <div className="payment-type__tab-list">
                                        {payment_types.map((item, idx) => (
                                            <div
                                                className="payment-type"
                                                key={idx}
                                                onClick={() =>
                                                    setTabIndex(idx + 1)
                                                }
                                                style={{
                                                    width:
                                                        idx === 0
                                                            ? "100%"
                                                            : "calc(50% - 6px)",
                                                    marginRight:
                                                        idx % 2 === 0
                                                            ? "0"
                                                            : "12px",
                                                }}
                                            >
                                                <img
                                                    className="payment-type__icon"
                                                    src={item.icon}
                                                    alt="payment type"
                                                />
                                                <p className="payment-type__name">
                                                    {item.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}{" "}
                                {tabIndex === 1 && (
                                    <CoinPaymentsTab
                                        currentRound={currentRound}
                                        bidAmount={bidAmount}
                                    />
                                )}
                                {tabIndex === 2 && (
                                    <CreditCardTab
                                        amount={Number(bidAmount).toFixed(2)}
                                        round={currentRound}
                                    />
                                )}
                                {tabIndex === 3 && (
                                    <div className="paypal-tab">
                                        <div
                                            className="payment-content"
                                            onClick={() => initPaypal()}
                                        >
                                            <button className="paypal-checkout btn-second">
                                                Check out with &nbsp;
                                                <img
                                                    src={PaypalBrand}
                                                    alt="paypal"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {tabIndex === 4 && (
                                    <NDBWalletTab
                                        bidAmount={bidAmount}
                                        currentRound={currentRound}
                                    />
                                )}
                                {tabIndex === 5 && (
                                    <div className="externalwallets-tab">
                                        <div
                                            className="payment-content"
                                            style={{ display: "block" }}
                                        >
                                            <PaymentExternalWalletTab
                                                currentRound={currentRound}
                                                bidAmount={bidAmount}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {tabIndex === 1 && (
                            <OrderSummaryOfCoinPayments bidAmount={bidAmount} />
                        )}
                        {tabIndex === 2 && (
                            <OrderSummaryOfCreditCard bidAmount={bidAmount} />
                        )}
                        {tabIndex === 4 && (
                            <OrderSummaryNDBWallet bidAmount={bidAmount} />
                        )}
                        {tabIndex !== 1 && tabIndex !== 2 && tabIndex !== 4 && (
                            <OrderSummary bidAmount={bidAmount} />
                        )}
                    </div>
                    <div className="remain-token__value col-md-12 mx-auto">
                        <div className="d-flex justify-content-between">
                            <p className="current-value">
                                current cap&nbsp;
                                <span className="txt-green">
                                    {numberWithCommas(currentCap)}
                                </span>
                            </p>
                            <p className="end-value">
                                target cap&nbsp;
                                <span className="txt-green">1 Trillion</span>
                            </p>
                        </div>
                        <div className="timeframe-bar">
                            <div
                                className="timeleft"
                                style={{
                                    width: `${barProgress}%`,
                                    background:
                                        "linear-gradient(270deg, #FFFFFF 0%, #77DDA0 31.34%, #23C865 64.81%)",
                                }}
                            >
                                <div className="timeleft__value">
                                    Round &nbsp;
                                    <span className="txt-green">
                                        {totalRounds}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Payment;
