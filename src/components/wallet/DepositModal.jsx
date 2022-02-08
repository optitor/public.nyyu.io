/* eslint-disable */

import { useQuery } from "@apollo/client"
import React, { useState, useEffect } from "react"
import Modal from "react-modal"
import _ from 'lodash';
import svgToDataURL from 'svg-to-dataurl'
import Select, { components } from 'react-select';
import { Icon } from '@iconify/react';
import { CopyToClipboard } from "react-copy-to-clipboard"
import { GET_BALANCES } from "../../apollo/graghqls/querys/Auth"
import CustomSpinner from "../common/custom-spinner"
import { generateQR } from "../../utilities/string";

const { Option, SingleValue } = components

const SelectOption = (props) => {
    if(_.isEmpty(props.data)) return "";
    return (<Option {...props}>
        <div className="d-flex justify-content-sm-start align-items-center ">
            <img
                src={props.data?.symbol}
                style={{ width: "30px", height: "auto" }}
                alt={props.data.tokenName}
            />
            <p className="coin-label ms-2">{props.data?.hold + props.data?.free} {props.data?.tokenSymbol?? ""} ({props.data?.tokenName?? ""})</p>
        </div>
    </Option>);
};

export default function DepositModal({ showModal, setShowModal, transactionType }) {
    // Webservice
    const { data: balances } = useQuery(GET_BALANCES, {
        fetchPolicy: "network-only",
        onCompleted: () => {
            if(balances.getBalances) {
                let assets = balances.getBalances?.map(item => {
                    return { ...item, symbol: svgToDataURL(item.symbol), label: item.tokenSymbol + item.tokenName, value: item.tokenSymbol + item.tokenName };
                });
                setMyAssets(assets);
                setSelectedAsset(assets[0]);
            }
        },
    })

    // Containers
    const [myAssets, setMyAssets] = useState(null)
    const [selectedAsset, setSelectedAsset] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [copied, setCopied] = useState(false);
    const [coinAddress, setCoinAddress] = useState('kjY602GgjsKP23mhs09oOp63bd3n34fsla');
    const [coinQRCode, setCoinQRCode] = useState("")
    const loadingSection = !myAssets

    const handleConfirm = () => {
        setCurrentStep(2);
    };

    useEffect(async () => {
        if (coinAddress) {
            const qrCode = await generateQR(coinAddress)
            setCoinQRCode(qrCode)
        }
        return ""
    }, [coinAddress]);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <Modal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            className="deposit-modal"
            overlayClassName="deposit-widthdraw-modal__overlay"
            ariaHideApp={false}
        >
            <div className="d-flex justify-content-between align-items-center">
                {currentStep === 2 && (<Icon className="icon" icon="carbon:arrow-left"
                    onClick={() => setCurrentStep(1)}
                />)}
                <div className="fw-bold h4 text-light"> </div>
                <Icon className="icon" icon="carbon:close"
                    onClick={() => setShowModal(false)}
                />
            </div>
            {loadingSection ? (
                <div className="text-center mt-5 mb-4">
                    <CustomSpinner />
                </div>
            ) : (
                <>
                    {currentStep === 1 && (
                        <div className="deposit step1">
                            <h4 className="text-center mb-4">
                                Deposit
                            </h4>
                            <div className="button-group">
                                <button className="btn selected">Cryptocurrency</button>
                                <button className="btn">Fiat</button>
                            </div>
                            <div className="select_div">
                                <p className="subtitle">Select coin</p>
                                <Select
                                    className="black_input"
                                    options={myAssets}
                                    value={selectedAsset}
                                    onChange={selected => setSelectedAsset(selected)}
                                    styles={customSelectStyles}
                                    components={{
                                        Option: SelectOption,
                                        SingleValue: SelectOption,
                                    }}
                                />
                            </div>
                            <button className="btn confirm"
                                onClick={handleConfirm}
                            >CONFIRM</button>
                        </div>
                    )}
                    {currentStep === 2 && (
                        <div className="deposit step2">
                            <h4 className="text-center mb-4">
                                Deposit
                            </h4>
                            <div className="address_div">
                                <p className="subtitle">Deposit Address</p>
                                <CopyToClipboard
                                    onCopy={handleCopy}
                                    text={coinAddress}
                                    options={{ message: "copied" }}
                                >
                                    <div
                                        className="clipboard"
                                        onClick={handleCopy}
                                        onKeyDown={handleCopy}
                                        role="presentation"
                                    >
                                        <div className="address">{coinAddress}</div>
                                        <div className="copy_icon">
                                            <Icon icon={copied? "clarity:copy-solid": "clarity:copy-line"} />
                                        </div>                                        
                                    </div>
                                </CopyToClipboard>
                                <div className="qr_code">
                                    {coinQRCode ? (
                                        <img src={coinQRCode} alt="qrcode" />
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div>
                                    <div className="stats">
                                        <p className="topic">Status</p>
                                        <p className="content">Waiting for your funds</p>
                                    </div>
                                    <div className="stats">
                                        <p className="topic">Received so far</p>
                                        <p className="content">0.0000001 BTC (unconfirmed)</p>
                                    </div>
                                    <div className="stats">
                                        <p className="topic">Deposit address</p>
                                        <p className="content">{coinAddress}</p>
                                    </div>
                                    <div className="stats">
                                        <p className="topic">Time left to confirm funds</p>
                                        <p className="content">7h 29m 25s</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </Modal>
    )
}

const customSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: 'white',
      backgroundColor: state.isSelected? '#0b7e39': '#1e1e1e',
      fontSize: 14
    }),
    control: provided => ({
      ...provided,
      backgroundColor: '#1e1e1e',
      border: 'none',
      borderRadius: 0
    }),
    menu: provided => ({
        ...provided,
        backgroundColor: '#1e1e1e',
        border: '1px solid white',
    }),
    singleValue: provided => ({
        ...provided,
        color: 'white',
    }),
    input: provided => ({
        ...provided,
        color: 'white'
    })
};