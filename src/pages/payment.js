/* eslint-disable */

import React, { useCallback, useReducer, useState } from "react"
import { useSelector } from "react-redux"
import ReactTooltip from "react-tooltip"
import Select, { components } from "react-select"
import Header from "../components/header"
import { CheckBox } from "../components/common/FormControl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/fontawesome-free-regular"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import {
    CryptoCoin,
    Paypal,
    Credit,
    NdbWallet,
    ExternalWallet,
    ETH,
    BTC,
    DOGE,
    PaypalBrand,
} from "../utilities/imgImport"
import ConnectWalletTab from "../components/profile/connect-wallet-tab"
import { PAYMENT_FRACTION_TOOLTIP_CONTENT } from "../utilities/staticData"
import Seo from './../components/seo';
import CreditCardTab from "../components/payment/credit-card-tab"
import CoinPaymentsTab from "../components/payment/CoinPaymentsTab"
// import { numberWithCommas } from "../utilities/number"
import OrderSummary from "../components/payment/order-summary"
import OrderSummaryOfCoinPayments from './../components/payment/OrderSummaryOfCoinPayments'

const { Option, SingleValue } = components


const balances = [
    { value: "3,002,565", label: "ETH", icon: ETH },
    { value: "225,489", label: "BTC", icon: BTC },
    { value: "489,809", label: "DOGE", icon: DOGE },
]
const payment_types = [
    { icon: CryptoCoin, value: "cryptocoin", label: "Cryptocoin" },
    { icon: Credit, value: "creditcard", label: "Credit / Debit card" },
    { icon: Paypal, value: "paypal", label: "PayPal" },
    { icon: NdbWallet, value: "ndb_wallet", label: "Ndb wallet" },
    { icon: ExternalWallet, value: "externalwallets", label: "External Wallets" },
]

const CustomOption = (props) => (
    <Option {...props}>
        <div className="custom-option">
            <p>{props.data.value}</p>
            <p className="ms-4">{props.data.label}</p>
        </div>
    </Option>
)
const CustomSingleValue = (props) => {
    return (
        <SingleValue {...props}>
            <p className="wallet-select__value">{props.data.value + " - " + props.data.label}</p>
        </SingleValue>
    )
}

const Payment = () => {
    const currentRound = useSelector((state) => state?.placeBid.round_id)
    const bidAmount = useSelector((state) => state?.placeBid.bid_amount)

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        allow_fraction: false,
        getAddress: false,
    })
    const { allow_fraction, getAddress } = state

    const [balance, setBalance] = useState(null)
    const [tabIndex, setTabIndex] = useState(0)

    const handleAllowFraction = useCallback(
        (e) => {
            e.preventDefault()
            setState({ allow_fraction: !allow_fraction })
        },
        [allow_fraction]
    )

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
                                            onClick={() => setTabIndex(idx + 1)}
                                            style={{
                                                width: idx === 0 ? "100%" : "calc(50% - 6px)",
                                                marginRight: idx % 2 === 0 ? "0" : "12px",
                                            }}
                                        >
                                            <img
                                                className="payment-type__icon"
                                                src={item.icon}
                                                alt="payment type"
                                            />
                                            <p className="payment-type__name">{item.label}</p>
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
                                <CreditCardTab amount={bidAmount} round={currentRound} />
                            )}
                            {tabIndex === 3 && (
                                <div className="paypal-tab">
                                    <div className="payment-content">
                                        <button className="paypal-checkout btn-second">
                                            Check out with &nbsp;
                                            <img src={PaypalBrand} alt="paypal" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {tabIndex === 4 && (
                                <div className="wallet-tab">
                                    <div className="payment-content">
                                        <div className="row">
                                            <Select
                                                className="balance-select col-lg-4 pe-0"
                                                options={balances}
                                                value={balance}
                                                placeholder="YOUR BALANCE"
                                                onChange={(v) => setBalance(v)}
                                                components={{
                                                    Option: CustomOption,
                                                    SingleValue: CustomSingleValue,
                                                }}
                                            />
                                            <div className="col-lg-8 d-flex pl-8px">
                                                <div className="choosed-icon">
                                                    {balance?.icon && (
                                                        <img src={balance?.icon} alt="coin" />
                                                    )}
                                                </div>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={bidAmount}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3 d-flex justify-content-between">
                                            <p className="d-flex flex-row">
                                                <CheckBox
                                                    type="checkbox"
                                                    name="allow_fraction"
                                                    value={allow_fraction}
                                                    onChange={handleAllowFraction}
                                                    className="text-uppercase"
                                                ></CheckBox>
                                                <div className="allow-text">
                                                    Do you allow fraction of order compleation?
                                                </div>
                                                <ReactTooltip
                                                    place="right"
                                                    type="light"
                                                    effect="solid"
                                                >
                                                    <div
                                                        className="text-justify"
                                                        style={{
                                                            width: "300px",
                                                        }}
                                                    >
                                                        {PAYMENT_FRACTION_TOOLTIP_CONTENT}
                                                    </div>
                                                </ReactTooltip>
                                                <FontAwesomeIcon
                                                    data-tip="React-tooltip"
                                                    icon={faQuestionCircle}
                                                    className="fa-xl ms-2 cursor-pointer"
                                                />
                                            </p>
                                            <p className="payment-expire my-auto">
                                                payment expires in{" "}
                                                <span className="txt-green">10 minutes</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {tabIndex === 5 && (
                                <div className="externalwallets-tab">
                                    <div className="payment-content" style={{ display: "block" }}>
                                        <ConnectWalletTab />

                                        <div className="mt-1 d-flex justify-content-between">
                                            <p className="d-flex flex-row">
                                                <CheckBox
                                                    type="checkbox"
                                                    name="allow_fraction"
                                                    value={allow_fraction}
                                                    onChange={handleAllowFraction}
                                                    className="text-uppercase"
                                                ></CheckBox>
                                                <div className="allow-text">
                                                    Do you allow fraction of order compleation?
                                                </div>
                                                <ReactTooltip
                                                    place="right"
                                                    type="light"
                                                    effect="solid"
                                                >
                                                    <div
                                                        className="text-justify"
                                                        style={{
                                                            width: "300px",
                                                        }}
                                                    >
                                                        {PAYMENT_FRACTION_TOOLTIP_CONTENT}
                                                    </div>
                                                </ReactTooltip>
                                                <FontAwesomeIcon
                                                    data-tip="React-tooltip"
                                                    icon={faQuestionCircle}
                                                    className="fa-xl ms-2 cursor-pointer"
                                                />
                                            </p>
                                            <p className="payment-expire my-auto">
                                                payment expires in{" "}
                                                <span className="txt-green">10 minutes</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {tabIndex === 1 && <OrderSummaryOfCoinPayments bidAmount={bidAmount} />}
                    {tabIndex !== 1 && <OrderSummary bidAmount={bidAmount} />}
                </div>
                <div className="remain-token__value col-md-12 mx-auto">
                    <div className="d-flex justify-content-between">
                        <p className="current-value">
                            current token value&nbsp;
                            <span className="txt-green">123.421</span>
                        </p>
                        <p className="end-value">
                            end token value&nbsp;
                            <span className="txt-green">1 Trillion</span>
                        </p>
                    </div>
                    <div className="timeframe-bar">
                        <div
                            className="timeleft"
                            style={{
                                width: "25%",
                                background:
                                    "linear-gradient(270deg, #FFFFFF 0%, #77DDA0 31.34%, #23C865 64.81%)",
                            }}
                        >
                            <div className="timeleft__value">
                                Round &nbsp;
                                <span className="txt-green">1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>
    )
}

export default Payment
