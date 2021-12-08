import React, { useCallback, useReducer, useState } from "react"
import Select, { components } from "react-select"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/fontawesome-free-regular"
import { EditIcon, ETH, BTC, DOGE, QRCode, Copy } from "../../utilities/imgImport"
import { Input, CheckBox } from "../../components/common/FormControl"
import Header from "../../components/common/header"
import { CopyToClipboard } from "react-copy-to-clipboard"

const { Option, SingleValue } = components;

const coins = [
    { value: "eth", label: "", icon: ETH },
    { value: "btc", label: "", icon: BTC },
    { value: "doge", label: "", icon: DOGE },
]
const balances = [
    { value: "3002565", label: "ETH", icon: ETH },
    { value: "225489", label: "BTC", icon: BTC },
    { value: "489809", label: "DOGE", icon: DOGE },
]
const payment_types = [
    { value: "cryptocoin", label: "Cryptocoin", index: 0 },
    { value: "creditcard", label: "Credit card", index: 1 },
    { value: "wallet", label: "Ndb wallet", index: 2 },
]

const IconOption = (props) => (
    <Option {...props}>
        <img src={props.data.icon} style={{ width: 39 }} alt={props.data.label} />
        {props.data.label}
    </Option>
)
const SelectedValue = (props) => {
    return (
        <SingleValue {...props}>
            <img src={props.data.icon} style={{ width: "100%" }} alt={props.data.label} />
            {props.data.label}
        </SingleValue>
    )
}
const CustomOption = (props) => (
    <Option {...props}>
        <div className="custom-option">
            <p>{props.data.value}</p>
            <p className="ms-4">{props.data.label}</p>
        </div>
    </Option>
)
const CustomSingleValue = (props) => {
    return <SingleValue {...props}>Your Balance</SingleValue>
}

const Payment = () => {
    const copyText = "kjY602GgjsKP23mhs09oOp63bd3n34fsla"
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        firstname: "",
        lastname: "",
        card: "",
        expire: "",
        code: "",
        bill: "",
        allow_fraction: false,
        save_card: false,
        amount: "",
    })
    const { firstname, lastname, card, expire, code, bill, allow_fraction, save_card, amount } =
        state

    const [coin, setCoin] = useState(coins[0])
    const [balance, setBalance] = useState(balances[0])
    const [copied, setCopied] = useState(false)
    const [tabIndex, setTabIndex] = useState(0)
    const [payment_type, setPaymentType] = useState(payment_types[0])
    const [getDepoAddress, setGetDepoAddress] = useState(false);

    const handleInput = useCallback((e) => {
        e.preventDefault()
        setState({ [e.target.name]: e.target.value })
    }, [])
    const handleAllowFraction = useCallback(
        (e) => {
            e.preventDefault()
            setState({ allow_fraction: !allow_fraction })
        },
        [allow_fraction]
    )
    // const handleSaveCard = useCallback(
    //     (e) => {
    //         e.preventDefault()
    //         setState({ save_card: !save_card })
    //     },
    //     [save_card]
    // )

    const handlePaymentType = (value) => {
        setPaymentType(value)
        setTabIndex(value.index)
    };

    const handleCopyText = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const handleGetDepoAddress = () => {
        setGetDepoAddress(true);
    };

    return (
        <main className="purchase_payment-page">
            <Header />
            <section className="container position-relative h-100">
                <div className="text-center mt-5">
                    <h3 className="title">Payment Page</h3>
                    <p className="sub-title">Here you can decide how to pay</p>
                </div>
                <div className="row mt-5">
                    <div className="col-md-8 payment-select">
                        <Tabs
                            className="payment-type__tab"
                            selectedIndex={tabIndex}
                            onSelect={(index) => setTabIndex(index)}
                        >
                            <TabList>
                                {payment_types.map((item, idx) => (
                                    <Tab className="payment-type__tab-list" key={idx}>
                                        {item.label}
                                    </Tab>
                                ))}
                            </TabList>
                            <Select
                                options={payment_types}
                                value={payment_type}
                                onChange={(v) => handlePaymentType(v)}
                                className="payment-type__select"
                            />
                            <TabPanel className="cryptocoin-tab">
                                <div className="row">
                                    <div className="d-flex flex-column justify-content-between col-lg-9">
                                        <div className="d-flex justify-content-between w-100">
                                            <Select
                                                className="cryptocoin-select"
                                                options={coins}
                                                value={coin}
                                                onChange={(v) => setCoin(v)}
                                                components={{
                                                    Option: IconOption,
                                                    SingleValue: SelectedValue,
                                                }}
                                            />
                                            <Input
                                                type="number"
                                                name="amount"
                                                value={amount}
                                                onChange={handleInput}
                                            />
                                        </div>
                                        {
                                            !getDepoAddress? 
                                            (
                                                <button className="btn-primary" onClick={handleGetDepoAddress}>Get Deposit Address</button>
                                            ): (
                                                <>
                                                    <CopyToClipboard
                                                        onCopy={handleCopyText}
                                                        text={copyText}
                                                        options={{ message: "copied" }}
                                                    >
                                                        <p
                                                            className="clipboard"
                                                            onClick={handleCopyText}
                                                            onKeyDown={handleCopyText}
                                                            role="presentation"
                                                        >
                                                            <code>{copyText}</code>
                                                            <img src={Copy} alt="copy" />
                                                        </p>
                                                    </CopyToClipboard>
                                                    {copied ? (
                                                        <span style={{ color: "white" }}>Copied.</span>
                                                    ) : null}
                                                </>
                                            )
                                        }                                       
                                    </div>
                                    <div className="qr-code col-lg-3">
                                        {!getDepoAddress? "": <img src={QRCode} alt="qr code" />}                                        
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel className="creditcard-tab">
                                <div className="row">
                                    <div className="form-group col-sm-6">
                                        <Input
                                            type="text"
                                            name="firstname"
                                            value={firstname}
                                            onChange={handleInput}
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div className="form-group col-sm-6">
                                        <Input
                                            type="text"
                                            name="lastname"
                                            value={lastname}
                                            onChange={handleInput}
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <Input
                                        type="number"
                                        name="card"
                                        value={card}
                                        onChange={handleInput}
                                        placeholder="Card number"
                                    />
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-4">
                                        <Input
                                            type="number"
                                            name="expire"
                                            value={expire}
                                            onChange={handleInput}
                                            placeholder="Expiration date"
                                        />
                                    </div>
                                    <div className="form-group col-sm-4">
                                        <Input
                                            type="number"
                                            name="code"
                                            value={code}
                                            onChange={handleInput}
                                            placeholder="CSS code"
                                        />
                                    </div>
                                    <div className="form-group col-sm-4">
                                        <Input
                                            type="number"
                                            name="bill"
                                            value={bill}
                                            onChange={handleInput}
                                            placeholder="Billing zip"
                                        />
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel className="wallet-tab">
                                <div className="row">
                                    <Select
                                        className="balance-select col-lg-4"
                                        options={balances}
                                        value={balance}
                                        onChange={(v) => setBalance(v)}
                                        components={{
                                            Option: CustomOption,
                                            SingleValue: CustomSingleValue,
                                        }}
                                    />
                                    <div className="col-lg-8 d-flex">
                                        <div className="choosed-icon">
                                            <img src={balance.icon} alt="coin" />
                                        </div>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name="amount"
                                            value={amount}
                                            onChange={handleInput}
                                        />
                                    </div>
                                </div>
                            </TabPanel>
                            <div className="mt-3 d-flex align-items-center justify-content-between">
                                <CheckBox
                                    type="checkbox"
                                    name="allow_fraction"
                                    value={allow_fraction}
                                    onChange={handleAllowFraction}
                                    className="text-uppercase"
                                >
                                    Do you allow fraction of order compleation?
                                    <FontAwesomeIcon
                                        icon={faQuestionCircle}
                                        className="fa-2x ms-2"
                                    />
                                </CheckBox>
                                <p className="payment-expire">
                                    payment expires in&nbsp;
                                    <span className="txt-green">10 minutes</span>
                                </p>
                            </div>
                        </Tabs>
                    </div>
                    <div className="col-md-4 order-summary">
                        <h3>
                            {tabIndex === 0? "Wallet": "Order Summary"}
                        </h3>
                        <div className="total-amount">
                            <div className="d-flex align-items-center">
                                <p className="amount-label">total amount</p>
                                <img src={EditIcon} alt="edit" className="ms-3" />
                            </div>
                            <p className="amount">50.234 ETH</p>
                        </div>
                        <p className="payment-expire">
                            payment expires in&nbsp;
                            <span className="txt-green">10 minutes</span>
                        </p>
                        <button className="btn-primary text-uppercase">Confirm Payment</button>
                    </div>
                </div>
                <div className="remain-token__value">
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
    )
}

export default Payment
