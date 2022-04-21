import React, { useState, useEffect, useMemo } from "react";
import jq from "jquery";
import parse from 'html-react-parser';
import Modal from "react-modal";
import _, { set } from "lodash";
import styled from "styled-components";
import Select, { components } from "react-select";
import NumberFormat from "react-number-format";
import Loading from "../common/Loading";
import { Icon } from "@iconify/react";
import { useMutation, useQuery } from "@apollo/client";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { generateQR } from "../../utilities/string";
import CustomSpinner from "../common/custom-spinner";
import StripeDepositSection from "./deposit/StripeDepositSection";
import { GET_ALL_FEES } from "../../apollo/graphqls/querys/Payment";
import { getStripePaymentFee, getPaypalPaymentFee, getBankTransferFee } from "../../utilities/utility-methods";
import { useSelector } from "react-redux";
import {
    Plaid,
    PaypalFiat,
    CreditCards,
    USDT
} from "../../utilities/imgImport";
import { SUPPORTED_COINS } from "../../utilities/staticData2";
import * as Mutation from "../../apollo/graphqls/mutations/Payment";
import * as Query from "../../apollo/graphqls/querys/Payment";
import { setCookie, NDB_Paypal_TrxType, NDB_Deposit } from '../../utilities/cookies';
import { roundNumber } from "../../utilities/number";
import CountDown from "../../components/common/countdown";

const IntervalTime = 5 * 1000;

const CURRENCIES = [
    { label: "USD", value: "USD", symbol: "$" },
    // { label: "GBP", value: "GBP", symbol: "£" },
    // { label: "EUR", value: "EUR", symbol: "€" },
];

const CURRENCIES_BANK = [
    { label: "USD", value: "USD", symbol: "$" },
    { label: "GBP", value: "GBP", symbol: "£" },
    { label: "EUR", value: "EUR", symbol: "€" },
];

const DEPOSIT_COINS = SUPPORTED_COINS.filter(item => item.value !== 'NDB');

const BankTransferData = {
    EUR: {
        "Account holder": "Voltamond",
        BIC: "TRWIBEB1XXX",
        IBAN: "BE36 9672 2651 6281",
        Address: "Avenue Louise 54, Room S52, Brussels, 1050, Belgium",
    },
    GBP: {
        "Account holder": "Voltamond",
        "Sort code": "23-14-70",
        "Account number": "22063784",
        IBAN: "GB29 TRWI 2314 7022 0637 84",
        Address: "56 Shoreditch High Street, London, E1 6JJ, United Kingdom",
    },
    USD: {
        "Account holder": "Voltamond",
        "Routing number": "084009519",
        "Account number": "9600001149793466",
        "Account type": "Checking",
        Address: "19 W 24th Street, New York NY 10010, United States",
    },
};

const BankTrxDescription = {
    first: 'Incoming payments can take 3 working days to be added to your wallet',
    second: `Please make sure you use the
        <span className="txt-green">reference number</span>
        indicated above when you are making the transfer, otherwise we may not be able to locate your transaction.`,
}

const { Option } = components;
const MIN_VALUE = 1;

const CRYPTOCURRENCY = 'CRYPTOCURRENCY';
const PAYPAL = 'PAYPAL';
const STRIP = 'STRIP';
const BANKTRANSER = 'BANKTRANSER';

const SelectOption = (props) => {
    return (
        <Option {...props}>
            <div className="d-flex justify-content-sm-start align-items-center ">
                <img
                    src={props.data?.icon}
                    style={{ width: "30px", height: "30px" }}
                    alt={props.data.value}
                />
                <p className="coin-label ms-3">{props.data?.label}</p>
            </div>
        </Option>
    );
};

export default function DepositModal({ showModal, setShowModal }) {
    const user = useSelector((state) => state.auth.user);
    const [selectedAsset, setSelectedAsset] = useState(SUPPORTED_COINS[0]);
    const [currentStep, setCurrentStep] = useState(1);
    const [tabIndex, setTabIndex] = useState(1);
    const [copied, setCopied] = useState(false);
    const [pending, setPending] = useState(false);

    const [coinQRCode, setCoinQRCode] = useState("");

    const [loading, setLoading] = useState(false);

    const networks = useMemo(() => selectedAsset.networks, [selectedAsset]);
    const [network, setNetwork] = useState(networks[0]);
    const [depositData, setDepositData] = useState(null);
    const [confirmById, setConfirmById] = useState(null);

    // Variables for bank transfer
    const [currency, setCurrency] = useState(CURRENCIES[0]);
    const [transferAmount, setTransferAmount] = useState("");
    const [referenceNumber, setReferenceNumber] = useState(null);

    const [copyText, setCopyText] = useState("");

    const [depositType, setDepositType] = useState('');
    const [allFees, setAllFees] = useState({});

    const loadingStripe = !allFees;

    useEffect(() => {
        (async function () {
            if (depositData?.depositAddress) {
                const qrCode = await generateQR(depositData?.depositAddress);
                setCoinQRCode(qrCode);
            }
            return "";
        })();
    }, [depositData]);

    useQuery(GET_ALL_FEES, {
        onCompleted: (data) => {
            setAllFees( _.mapKeys(data.getAllFees, "tierLevel"));
        },
        onError: (error) => console.log(error),
    });

    const [createChargeForDepositMutation] = useMutation(
        Mutation.CREATE_CHARGE_FOR_DEPOSIT,
        {
            onCompleted: (data) => {
                if (data?.createChargeForDeposit) {
                    const resData = data?.createChargeForDeposit;

                    setDepositData(resData);
                    setPending(false);
                    setCurrentStep(2);
                }
            },
            onError: (err) => {
                console.log("get deposit address: ", err);
                setPending(false);
            },
        }
    );

    const goBackToMain = () => {
        setDepositData(null);
        setConfirmById(null);
        setCurrency(CURRENCIES[0]);
        setTransferAmount("");
        setCurrentStep(1);
    };

    const create_Charge_For_Deposit = () => {
        setPending(true);
        setDepositType(CRYPTOCURRENCY);
        const createData = {
            coin: network.value,
            network: network.network,
            cryptoType: selectedAsset.value,
        };
        createChargeForDepositMutation({
            variables: { ...createData },
        });
    };

    //-------- Fetching the state of confirming coinpayment trx.
    const {startPolling, stopPolling} = useQuery(Query.GET_COINPAYMENT_DEPOSITTX_BYID, {
        variables: {
            id: depositData?.id
        },
        onCompleted: (data) => {
            if (data.getCoinpaymentDepositTxById) {
                setConfirmById(data.getCoinpaymentDepositTxById);
            }
        },
        onError: (err) => {
            console.log(err.message);
        },
        pollInterval: IntervalTime,
        notifyOnNetworkStatusChange: true
    });

    useEffect(() => {
        if(depositData?.id) return startPolling(IntervalTime);
        return stopPolling();
    }, [depositData?.id, startPolling, stopPolling]);
    //-----------------------------------------------------------------

    const closeModal = () => {
        setDepositData(null);
        setShowModal(false);
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const handleCopyToClipboard = (text) => {
        /* Copy the text inside the text field */
        navigator.clipboard.writeText(text);
        setCopyText(text);
    };

    const [paypalDeposit] = useMutation(Mutation.PAYPAL_FOR_DEPOSIT, {
        onCompleted: (data) => {
            let links = data.paypalForDeposit.links;
            for (let i = 0; i < links.length; i++) {
                if (links[i].rel === "approve") {
                    window.location.href = links[i].href;
                    break;
                }
            }
            setLoading(false);
        },
        onError: (err) => {
            console.log(err);
            alert("Error in PayPal checkout");
            setLoading(false);
        },
    });

    const initPaypalCheckout = () => {
        setCookie(NDB_Paypal_TrxType, NDB_Deposit);
        setLoading(true);
        paypalDeposit({
            variables: {
                amount: transferAmount,
                currencyCode: currency.value,
                cryptoType: "USDT",
            },
        });
    };

    const [bankForDeposit] = useMutation(Mutation.BANK_FOR_DEPOSIT, {
        onCompleted: (data) => {
            if (data.bankForDeposit) {
                setPending(false);
                setReferenceNumber(data.bankForDeposit);
                setCurrentStep(3);
            }
            setPending(false);
        },
        onError: (err) => {
            console.log(err.message);
            setPending(false);
        },
    });

    const handleBankForDeposit = () => {
        setPending(true);
        bankForDeposit();
    };

    if (loading) return <Loading />;

    return (
        <Modal
            isOpen={showModal}
            onRequestClose={closeModal}
            className="deposit-modal"
            overlayClassName="deposit-widthdraw-modal__overlay"
            ariaHideApp={false}
        >
            <div className="d-flex justify-content-between align-items-center">
                {currentStep === 2 && (
                    <Icon
                        className="icon"
                        icon="carbon:arrow-left"
                        onClick={goBackToMain}
                    />
                )}
                {currentStep === 3 && (
                    <Icon
                        className="icon"
                        icon="carbon:arrow-left"
                        onClick={goBackToMain}
                    />
                )}
                {currentStep === 4 && (
                    <Icon
                        className="icon"
                        icon="carbon:arrow-left"
                        onClick={() => {
                            setCurrentStep(3);
                            setCopyText("");
                        }}
                    />
                )}
                <div className="fw-bold h4 text-light"> </div>
                <Icon
                    className="icon"
                    icon="carbon:close"
                    onClick={closeModal}
                />
            </div>
            <>
                {currentStep === 1 && (
                    <div className="deposit min_height1">
                        <div className="width1">
                            <h4 className="text-center mb-4">Deposit</h4>
                            <div className="button-group">
                                <button
                                    className={`btn ${
                                        tabIndex === 1 ? "selected" : ""
                                    }`}
                                    onClick={() => setTabIndex(1)}
                                >
                                    Cryptocurrency
                                </button>
                                <button
                                    className={`btn ${
                                        tabIndex === 2 ? "selected" : ""
                                    }`}
                                    onClick={() => setTabIndex(2)}
                                >
                                    Fiat
                                </button>
                            </div>
                        </div>
                        {tabIndex === 1 && (
                            <div className="width1">
                                <div className="select_div">
                                    <p className="subtitle">Select coin</p>
                                    <Select
                                        className="black_input"
                                        options={DEPOSIT_COINS}
                                        value={selectedAsset}
                                        onChange={(selected) => {
                                            setSelectedAsset(selected);
                                            setNetwork(selected?.networks[0]);
                                        }}
                                        styles={customSelectStylesWithIcon}
                                        placeholder="Select Coin"
                                        components={{
                                            Option: SelectOption,
                                            SingleValue: SelectOption,
                                            IndicatorSeparator: null,
                                        }}
                                    />
                                </div>
                                <div className="select_div">
                                    <p className="subtitle">Select network</p>
                                    <Select
                                        className="black_input"
                                        options={networks}
                                        value={network}
                                        onChange={(selected) =>
                                            setNetwork(selected)
                                        }
                                        styles={customSelectStyles}
                                        placeholder="Select network"
                                        components={{
                                            IndicatorSeparator: null,
                                        }}
                                    />
                                </div>
                                <button
                                    className="btn btn-outline-light rounded-0 w-100 mt-40px fw-bold"
                                    onClick={create_Charge_For_Deposit}
                                    disabled={pending}
                                >
                                    {pending ? (
                                        <CustomSpinner />
                                    ) : (
                                        "GET DEPOSIT ADDRESS"
                                    )}
                                </button>
                            </div>
                        )}
                        {tabIndex === 2 && (
                            <div className="width2 mt-5">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FiatButton className="inactive"
                                            disabled={true}
                                        >
                                            <img src={Plaid} alt="plaid" />
                                        </FiatButton>
                                    </div>
                                    <div className="col-sm-6">
                                        <FiatButton
                                            className="active"
                                            onClick={() => {
                                                setDepositType(PAYPAL)
                                                setCurrentStep(3);
                                            }}
                                        >
                                            <img
                                                src={PaypalFiat}
                                                alt="paypal"
                                            />
                                        </FiatButton>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FiatButton
                                            className="active"
                                            onClick={() => {
                                                setDepositType(STRIP)
                                                setCurrentStep(3);
                                            }}
                                        >
                                            <img
                                                src={CreditCards}
                                                alt="Credit cards"
                                            />
                                        </FiatButton>
                                    </div>
                                    <div className="col-sm-6">
                                        <FiatButton
                                            className="active"
                                            onClick={() => {
                                                setDepositType(BANKTRANSER)
                                                handleBankForDeposit()
                                            }}
                                            disabled={pending}
                                        >
                                            {pending?
                                                <CustomSpinner />:
                                                <p>Standard bank transfer</p>
                                            }
                                        </FiatButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {currentStep === 2 &&
                    !_.isEmpty(depositData) &&
                    (depositType === CRYPTOCURRENCY) && (
                        <div className="deposit width3">
                            <div className="address_div">
                                <p className="subtitle">Deposit Address</p>
                                <div className="clip_div">
                                    <CopyToClipboard
                                        onCopy={handleCopy}
                                        text={depositData?.depositAddress}
                                        options={{ message: "copied" }}
                                    >
                                        <div
                                            className="clipboard"
                                            onClick={handleCopy}
                                            onKeyDown={handleCopy}
                                            role="presentation"
                                        >
                                            <div className="address">
                                                {depositData?.depositAddress}
                                            </div>
                                            <div className="copy_icon">
                                                <Icon
                                                    icon={
                                                        copied
                                                            ? "clarity:copy-solid"
                                                            : "clarity:copy-line"
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </CopyToClipboard>
                                    <div className="qr_code">
                                        {coinQRCode ? (
                                            <img
                                                src={coinQRCode}
                                                alt="qrcode"
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                <p className="desc mt-2">
                                    Send only <span>{selectedAsset.value}</span>{" "}
                                    to this deposit address. Ensure the network
                                    is <span>{network.label}</span>
                                </p>
                                <div className="stats_div">
                                    <div className="stats">
                                        <p className="topic">Status</p>
                                        <p className="content">
                                            {!confirmById?.status? 'Waiting for your funds': 'Received'}
                                        </p>
                                    </div>
                                    <div className="stats">
                                        <p className="topic">Received so far</p>
                                        <p className="content">
                                            {roundNumber(confirmById?.cryptoAmount, 8)} {selectedAsset.value}
                                        </p>
                                    </div>
                                    <hr />
                                    <div className="stats">
                                        <p className="topic">
                                            Time left to confirm funds
                                        </p>
                                        <div className="content">
                                            {!confirmById?.status?
                                                <CountDown deadline={confirmById?.createdAt + 8 * 3600 * 1000} />
                                                :
                                                <span className='txt-green'>Confirmed</span>
                                            }
                                        </div>
                                    </div>
                                    <div className="stats">
                                        <p className="topic">Payment ID</p>
                                        <p className="content">
                                            {depositData?.id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                {currentStep === 3 && (depositType === BANKTRANSER) && (
                    <div className="deposit width2 mb-5">
                        <h5 className="text-center">Bank transfer deposit</h5>
                        <div>
                            <p className="subtitle">Select currency</p>
                            <Select
                                className="black_input"
                                options={CURRENCIES_BANK}
                                value={currency}
                                onChange={(selected) => {
                                    setCurrency(selected);
                                }}
                                styles={customSelectStyles}
                                components={{
                                    IndicatorSeparator: null,
                                    IndicatorSeparator: null,
                                }}
                            />
                        </div>
                        <div className="mt-3">
                            <p className="subtitle">Amount</p>
                            <div
                                className="black_input transfer_input"
                                onClick={() =>
                                    jq("input#transferAmount").trigger("focus")
                                }
                            >
                                <NumberFormat
                                    id="transferAmount"
                                    className="ms-2"
                                    thousandSeparator={true}
                                    prefix={currency.symbol + " "}
                                    allowNegative={false}
                                    value={transferAmount}
                                    onValueChange={(values) =>
                                        setTransferAmount(values.value)
                                    }
                                    autoComplete="off"
                                />
                                <div>
                                    Bank transfer fee{" "}
                                    <NumberFormat
                                        thousandSeparator={true}
                                        suffix={" " + currency.symbol}
                                        displayType="text"
                                        allowNegative={false}
                                        value={
                                            Number(getBankTransferFee(user, allFees, transferAmount))
                                        }
                                        decimalScale={2}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <p className="desc">
                                The <span>{currency.label}</span> will be
                                converted to <span>USDT</span> and deposited to
                                the wallet
                            </p>
                            <div className="black_input usdt_div">
                                <img src={USDT} alt="usdt" className="ms-2" />
                                <p className="ms-2">USDT</p>
                            </div>
                        </div>
                        <button
                            className="btn btn-outline-light rounded-0 w-100 mt-50px fw-bold"
                            onClick={() => setCurrentStep(4)}
                            disabled={!transferAmount}
                        >
                            NEXT
                        </button>
                    </div>
                )}
                {currentStep === 4 && (depositType === BANKTRANSER) && (
                    <div className="deposit width2 mb-5">
                        <h4 className="text-center">
                            {currency.label} Deposits Only
                        </h4>
                        <p className="subtitle mb-4">
                            <Icon
                                icon="akar-icons:clock"
                                className="me-2"
                                style={{ fontSize: 18 }}
                            />
                            {BankTrxDescription.first}
                        </p>
                        {_.map(BankTransferData[currency.value], (val, key) => (
                            <div className="transfer_data_div" key={key}>
                                <p className="subtitle pe-2">{key}:</p>
                                <p className="value">
                                    {val}
                                    <Icon
                                        icon={
                                            copyText === val
                                                ? "fluent:copy-24-filled"
                                                : "fluent:copy-24-regular"
                                        }
                                        onClick={() =>
                                            handleCopyToClipboard(val)
                                        }
                                    />
                                </p>
                            </div>
                        ))}
                        <div className="transfer_data_div mt-3">
                            <p className="subtitle pe-2">Reference:</p>
                            <p className="value">
                                {referenceNumber}
                                <Icon
                                    icon={
                                        copyText === referenceNumber
                                            ? "fluent:copy-24-filled"
                                            : "fluent:copy-24-regular"
                                    }
                                    onClick={() =>
                                        handleCopyToClipboard(referenceNumber)
                                    }
                                />
                            </p>
                        </div>
                        <p className="subtitle mt-5">
                            {parse(BankTrxDescription.second)}
                        </p>                        
                        <button
                            className="btn btn-outline-light rounded-0 w-100 fw-bold mt-3"
                            onClick={closeModal}
                        >
                            CONFIRM
                        </button>
                    </div>
                )}

                {currentStep === 3 && (depositType === PAYPAL) && (
                    <div className="deposit width2">
                        <h5 className="text-center">Paypal deposit</h5>
                        <div>
                            <p className="subtitle">Currency</p>
                            <Select
                                className="black_input"
                                options={CURRENCIES}
                                value={currency}
                                onChange={(selected) => {
                                    setCurrency(selected);
                                }}
                                styles={customSelectStyles}
                                components={{
                                    IndicatorSeparator: null,
                                }}
                            />
                        </div>
                        <div className="mt-3">
                            <p className="subtitle">Amount</p>
                            <div
                                className="black_input transfer_input"
                                onClick={() =>
                                    jq("input#transferAmount").trigger("focus")
                                }
                            >
                                <NumberFormat
                                    id="transferAmount"
                                    className="ms-2"
                                    thousandSeparator={true}
                                    prefix={currency.symbol + " "}
                                    allowNegative={false}
                                    value={transferAmount}
                                    onValueChange={(values) =>
                                        setTransferAmount(values.value)
                                    }
                                    placeholder={'Min 1 ' + currency.symbol}
                                    autoComplete="off"
                                />
                                <div>
                                    Transaction fee{" "}
                                    <NumberFormat
                                        thousandSeparator={true}
                                        suffix={
                                            " " + currency.symbol
                                        }
                                        displayType="text"
                                        allowNegative={false}
                                        value={Number(
                                            getPaypalPaymentFee(
                                                user,
                                                allFees,
                                                transferAmount
                                            )
                                        )}
                                        decimalScale={2}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <p className="desc">
                                The <span>{currency.label}</span> will be
                                converted to <span>USDT</span> and deposited to
                                the wallet
                            </p>
                            <div className="black_input usdt_div">
                                <img src={USDT} alt="usdt" className="ms-2" />
                                <p className="ms-2">USDT</p>
                            </div>
                        </div>
                        <button
                            className="btn btn-outline-light rounded-0 w-100 mt-50px mb-5 fw-bold"
                            onClick={() => {
                                initPaypalCheckout();
                            }}
                            disabled={!transferAmount || Number(transferAmount) < MIN_VALUE}
                        >
                            CONTINUE
                        </button>
                    </div>
                )}
                {currentStep === 3 && (depositType === STRIP) && (
                    <div className="deposit width2">
                        <div>
                            {loadingStripe ? (
                                <div className="text-center mt-4">
                                    <CustomSpinner />
                                </div>
                            ) : (
                                <>
                                    <h5 className="text-center">
                                        Credit card deposit
                                    </h5>
                                    <div>
                                        <p className="subtitle">Currency</p>
                                        <Select
                                            className="black_input"
                                            options={CURRENCIES}
                                            value={currency}
                                            onChange={(selected) => {
                                                setCurrency(selected);
                                            }}
                                            styles={customSelectStyles}
                                            components={{
                                                IndicatorSeparator: null,
                                            }}
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <p className="subtitle">Amount</p>
                                        <div
                                            className="black_input transfer_input"
                                            onClick={() =>
                                                jq(
                                                    "input#transferAmount"
                                                ).trigger("focus")
                                            }
                                        >
                                            <NumberFormat
                                                id="transferAmount"
                                                className="ms-2"
                                                thousandSeparator={true}
                                                prefix={currency.symbol + " "}
                                                allowNegative={false}
                                                value={transferAmount}
                                                onValueChange={(values) =>
                                                    setTransferAmount(
                                                        values.value
                                                    )
                                                }
                                                autoComplete="off"
                                            />
                                            <div>
                                                Stripe fee{" "}
                                                <NumberFormat
                                                    thousandSeparator={true}
                                                    suffix={
                                                        " " + currency.symbol
                                                    }
                                                    displayType="text"
                                                    allowNegative={false}
                                                    value={Number(
                                                        getStripePaymentFee(
                                                            user,
                                                            allFees,
                                                            transferAmount
                                                        )
                                                    )}
                                                    decimalScale={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="desc">
                                            The <span>{currency.label}</span>{" "}
                                            will be converted to{" "}
                                            <span>USDT</span> and deposited to
                                            the wallet
                                        </p>
                                        <div className="black_input usdt_div">
                                            <img
                                                src={USDT}
                                                alt="usdt"
                                                className="ms-2"
                                            />
                                            <p className="ms-2">USDT</p>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-outline-light rounded-0 w-100 mt-50px mb-5 fw-bold"
                                        onClick={() => setCurrentStep(4)}
                                        disabled={!transferAmount}
                                    >
                                        CONTINUE
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {currentStep === 4 && (depositType === STRIP) && (
                    <StripeDepositSection
                        closeModal={closeModal}
                        amount={
                            Number(transferAmount)
                        }
                    />
                )}
            </>
        </Modal>
    );
}

const customSelectStylesWithIcon = {
    input: (provided) => ({
        ...provided,
        position: "absolute",
    }),
    option: (provided, state) => ({
        ...provided,
        color: "white",
        backgroundColor: state.isSelected ? "#000000" : undefined,
        fontSize: 14,
        borderBottom: "1px solid dimgrey",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "inherit",
        },
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "none",
        borderRadius: 0,
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "1px solid white",
    }),
    menuList: (provided) => ({
        ...provided,
        margin: 0,
        padding: 0,
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: 0,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white",
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "dimgrey",
    }),
};
const customSelectStyles = {
    option: (provided, state) => ({
        ...provided,
        color: "white",
        backgroundColor: state.isSelected ? "#000000" : undefined,
        fontSize: 14,
        borderBottom: "1px solid dimgrey",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "inherit",
        },
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "none",
        borderRadius: 0,
        height: 47,
        cursor: "pointer",
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "1px solid white",
    }),
    menuList: (provided) => ({
        ...provided,
        margin: 0,
        padding: 0,
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: 0,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white",
        marginLeft: 10,
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "dimgrey",
    }),
};

const FiatButton = styled.button`
    border: 1px solid white;
    background-color: inherit;
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    transition: 0.3s;
    p {
        font-size: 18px !important;
        font-weight: 600;
    }
    img {
        margin: 5px;
    }
    &.active:hover {
        border-color: #23c865;
    }
    &.inactive {
        opacity: 0.4;
    }
`;
