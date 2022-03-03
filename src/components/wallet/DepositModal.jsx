/* eslint-disable */
import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import { navigate } from 'gatsby';
import _ from "lodash";
import styled from 'styled-components';
import Select, { components } from "react-select";
import { Icon } from "@iconify/react";
import { useMutation } from '@apollo/client';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { generateQR } from "../../utilities/string";
import CustomSpinner from "../common/custom-spinner";
import { Plaid, PaypalFiat, Visa, Amex, MasterCard } from '../../utilities/imgImport';
import { SUPPORED_COINS } from "../../utilities/staticData2";
import { CREATE_CHARGE_FOR_DEPOSIT } from "../../apollo/graghqls/mutations/Payment";
import { ROUTES } from "../../utilities/routes";

const { Option } = components;

const SelectOption = (props) => {
    return (
        <Option {...props}>
            <div className="d-flex justify-content-sm-start align-items-center ">
                <img
                    src={props.data?.icon}
                    style={{ width: "30px", height: "30px" }}
                    alt={props.data.value}
                />
                <p className="coin-label ms-3">
                    {props.data?.label}
                </p>
            </div>
        </Option>
    );
};

export default function DepositModal({ showModal, setShowModal }) {
    const [selectedAsset, setSelectedAsset] = useState(SUPPORED_COINS[0]);
    const [currentStep, setCurrentStep] = useState(1);
    const [tabIndex, setTabIndex] = useState(1);
    const [copied, setCopied] = useState(false);
    const [pending, setPending] =useState(false);
    const [coinQRCode, setCoinQRCode] = useState("");

    const networks = useMemo(() => (selectedAsset.networks), [selectedAsset]);    
    const [network, setNetwork] = useState(networks[0]);
    const [depositData, setDepositData] = useState({});

    // console.log(network)


    useEffect(() => {
        (async function() {
            if (depositData.depositAddress) {
                const qrCode = await generateQR(depositData.depositAddress);
                setCoinQRCode(qrCode);
            }
            return "";
        })();
    }, [depositData]);

    const [createChargeForDepositMutation] = useMutation(
        CREATE_CHARGE_FOR_DEPOSIT,
        {
            onCompleted: (data) => {
                if (data.createChargeForDeposit) {
                    const resData = data.createChargeForDeposit;

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

    const create_Charge_For_Deposit = () => {
        setPending(true);
        const createData = {
            coin: network.value,
            network: network.network,
            cryptoType: selectedAsset.value,
        };

        createChargeForDepositMutation({
            variables: { ...createData }
        })
    };

    const handleCreditDeposit = () => {
        navigate(ROUTES.creditDeposit);
    };

    const closeModal = () => {
        setDepositData({});
        setShowModal(false);
    };

    const handleCopy = () => {
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

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
                        onClick={() => setCurrentStep(1)}
                    />
                )}
                <div className="fw-bold h4 text-light"> </div>
                <Icon className="icon" icon="carbon:close" onClick={closeModal} />
            </div>
            <>
                {currentStep === 1 && (
                    <div className="deposit">
                        <div className="step1">
                            <h4 className="text-center mb-4">Deposit</h4>
                            <div className="button-group">
                                <button className={`btn ${tabIndex === 1? 'selected': ''}`}
                                    onClick={() => setTabIndex(1)}
                                >Cryptocurrency</button>
                                <button className={`btn ${tabIndex === 2? 'selected': ''}`}
                                    onClick={() => setTabIndex(2)}
                                >Fiat</button>
                            </div>
                        </div>
                        {tabIndex === 1 && (
                            <div className="step1">
                                <div className="select_div">
                                    <p className="subtitle">Select coin</p>
                                    <Select
                                        className="black_input"
                                        options={SUPPORED_COINS}
                                        value={selectedAsset}
                                        onChange={(selected) => {
                                            setSelectedAsset(selected)
                                            setNetwork(selected?.networks[0])
                                        }}
                                        styles={customSelectStylesWithIcon}
                                        placeholder="Select Coin"
                                        components={{
                                            Option: SelectOption,
                                            SingleValue: SelectOption,
                                            IndicatorSeparator: null                                            
                                        }}
                                    />
                                </div>
                                <div className="select_div">
                                    <p className="subtitle">Select network</p>
                                    <Select
                                        className="black_input"
                                        options={networks}
                                        value={network}
                                        onChange={(selected) => setNetwork(selected)}
                                        styles={customSelectStyles}
                                        placeholder="Select network"
                                        components={{
                                            IndicatorSeparator: null                                            
                                        }}
                                    />
                                </div>
                                <button
                                    className="btn btn-outline-light rounded-0 w-100 mt-40px fw-bold"
                                    onClick={create_Charge_For_Deposit}
                                    disabled={pending}
                                >
                                    {pending? <CustomSpinner />: 'GET DEPOSIT ADDRESS'}
                                </button>
                            </div>
                        )}
                        {tabIndex === 2 && (
                            <div className="step2 mt-5">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FiatButton className="inactive">
                                            <img src={Plaid} alt="plaid" />
                                        </FiatButton>
                                    </div>
                                    <div className="col-sm-6">
                                        <FiatButton className="active">
                                            <img src={PaypalFiat} alt="paypal" />
                                        </FiatButton>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <FiatButton className="active" onClick={handleCreditDeposit}>
                                            <img src={Visa} alt="visa" />
                                            <img src={MasterCard} alt="masterCard" />
                                            <img src={Amex} alt="amex" />
                                        </FiatButton>
                                    </div>
                                    <div className="col-sm-6">
                                        <FiatButton className="inactive">
                                            <p>Standard bank transfer</p>
                                        </FiatButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {currentStep === 2 && !_.isEmpty(depositData) && (
                    <div className="deposit step3">
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
                                        <div className="address">{depositData?.depositAddress}</div>
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
                                    {coinQRCode ? <img src={coinQRCode} alt="qrcode" /> : ""}
                                </div>
                            </div>
                            <p className="desc">
                                Send only <span>{selectedAsset.value}</span> to this deposit address. Ensure the network is <span>{network.label}</span>
                            </p>                      
                            <div className="stats_div">
                                <div className="stats">
                                    <p className="topic">Status</p>
                                    <p className="content">Waiting for your funds</p>
                                </div>
                                <div className="stats">
                                    <p className="topic">Received so far</p>
                                    <p className="content">0.000000000 BTC</p>
                                </div>
                                <hr />
                                <div className="stats">
                                    <p className="topic">Time left to confirm funds</p>
                                    <p className="content">8h 0m 0s</p>
                                </div>
                                <div className="stats">
                                    <p className="topic">Payment ID</p>
                                    <p className="content">{depositData?.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        </Modal>
    )
}

const customSelectStylesWithIcon = {
    input: provided => ({
        ...provided,
        position: 'absolute'
    }),
    option: (provided, state) => ({
        ...provided,
        color: "white",
        backgroundColor: state.isSelected? '#000000': undefined,
        fontSize: 14,
        borderBottom: '1px solid dimgrey',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: 'inherit'
        }
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
    menuList: provided => ({
        ...provided,
        margin: 0,
        padding: 0
    }),
    valueContainer: provided => ({
        ...provided,
        padding: 0
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white",
    }),
    placeholder: provided => ({
        ...provided,
        color: 'dimgrey'
    })
};
const customSelectStyles = {
    option: (provided, state) => ({
        ...provided,
        color: "white",
        backgroundColor: state.isSelected? '#000000': undefined,
        fontSize: 14,
        borderBottom: '1px solid dimgrey',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: 'inherit'
        }
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "none",
        borderRadius: 0,
        height: 47,
        cursor: 'pointer'
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "1px solid white",
    }),
    menuList: provided => ({
        ...provided,
        margin: 0,
        padding: 0
    }),
    valueContainer: provided => ({
        ...provided,
        padding: 0
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white",
        marginLeft: 10
    }),
    placeholder: provided => ({
        ...provided,
        color: 'dimgrey'
    })
};

const FiatButton = styled.div`
    border: 1px solid white;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    transition: 0.3s;
    cursor: pointer;
    p {
        font-size: 18px!important;
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