import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from 'react-redux';
import jq from 'jquery';
import ReactCodeInput from 'react-code-input';
import Modal from "react-modal";
import validator from "validator";
import _ from "lodash";
import styled from 'styled-components';
import Select, { components } from "react-select";
import NumberFormat from "react-number-format";
import { Icon } from "@iconify/react";
import { useQuery, useMutation } from '@apollo/client';
import CustomSpinner from "../common/custom-spinner";
import { GET_ALL_FEES } from "../../apollo/graphqls/querys/Payment";
import { getPaypalPaymentFee, getBankTransferFee } from "../../utilities/utility-methods";
import { PaypalFiat } from '../../utilities/imgImport';
import { renderNumberFormat, roundNumber } from '../../utilities/number';
import { SUPPORTED_COINS } from "../../utilities/staticData2";
import * as Mutation from "../../apollo/graphqls/mutations/Payment";
import { censorEmail } from "../../utilities/string";
import { countryList } from "../../utilities/countryAlpha2";
import LocationSearchInput from "./LocationSearchInput";

const DOMESTIC_BANK_PER_COUNTRY = {
    'GB': {
        meta: ['Sort code']
    },
    'US': {
        meta: ['ACH  routing number', 'Account type']
    },
    'FJ': {
        meta: ['Branch code']
    },
    'AR': {
        meta: ['Tax ID: CUIL / CUIT']
    },
    'JP': {
        meta: ['Branch Name', 'Account type'],
        info: 'Enter the recipient name exactly as it appears in their Japanese bank account (It is usually written in Katakana).'
    },
    'MX': {
        meta: ['CLABE']
    },
    'HK': {
        info: 'We can only pay out to HKD accounts in Hong Kong.'
    },
    'CA': {
        meta: ['Transit Number']
    },
    'AU': {
        meta: ['BSB Code (Bank State Branch)']
    },
    'CN': {
        meta: ['Card number']
    },
    'IN': {
        meta: ['IFSC code']
    }
};

const CURRENCIES = [
    {label: 'USD', value: 'USD', symbol: '$'},
    {label: 'GBP', value: 'GBP', symbol: '£'},
    {label: 'EUR', value: 'EUR', symbol: '€'},
];

const CRYPTOCURRENCY = 'CRYPTOCURRENCY';
const PAYPAL = 'PAYPAL';
const BANKTRANSFER = 'BANKTRANSFER';

const MIN_VALUE = 1;

const SupportedCoins = _.mapKeys(SUPPORTED_COINS, 'value');

const Countries = countryList.map((item) => {
    return { label: item.name, value: item["alpha-2"] }
});

const { Option } = components;
const SelectOption = (props) => {
    const value = roundNumber(props.data?.amount, 8);
    return (
        <Option {...props}>
            <div className="d-flex justify-content-sm-start align-items-center ">
                <img
                    src={props.data?.icon}
                    style={{ width: "30px", height: "30px" }}
                    alt={props.data.value}
                />
                <p className="coin-label ms-3">
                    <NumberFormat
                        value={value}
                        displayType={'text'}
                        thousandSeparator={true}
                        renderText={(value, props) => <span {...props}>{value} </span>}
                    />
                    {props.data?.label}
                </p>
            </div>
        </Option>
    );
};

export default function WithdrawModal({ showModal, setShowModal, assets }) {
    const user = useSelector((state) => state.auth.user);
    const { currencyRates } = useSelector((state) => state);
    const myAssets = _.orderBy(Object.values(assets).filter(item => {
        return item.tokenSymbol !== 'WATT';
    }).map(item => {
        return {
            value: item.tokenSymbol,
            label: item.tokenSymbol,
            amount: item.free,
            icon: item.symbol,
            balance: item.balance,
            networks: SupportedCoins[item.tokenSymbol]?.networks
        };
    }), ['balance'], ['desc']);

    const myAssetsFiat = myAssets.filter(item => (item.value !== 'NDB' && Number(item.value) !== 0)
    ).map(item => {
        return {
            value: item.value,
            label: item.label,
            icon: item.icon
        };
    });
    
    const [selectedAsset, setSelectedAsset] = useState(myAssets[0]);
    const [selectedAssetFiat, setSelectedAssetFiat] = useState(myAssetsFiat[0]);
    const [currentStep, setCurrentStep] = useState(1);
    const [withdrawType, setWithdrawType] = useState(null);
    const [tabIndex, setTabIndex] = useState(1);
    const [pending, setPending] =useState(false);

    const networks = useMemo(() => (selectedAsset?.networks?? []), [selectedAsset]);    
    const [network, setNetwork] = useState(networks[0]);
    const [withdrawData, setWithdrawData] = useState({destAddress: '', amount: ''});
    const [confirmCode, setConfirmCode] = useState('');
    // const [returnValue, setReturnValue] = useState({});
    const invalidForWithdraw= !withdrawData.destAddress || !withdrawData.amount || Number(withdrawData.amount) === 0 || Number(withdrawData.amount) > Number(selectedAsset.amount);
    
    // Variables for bank transfer
    const [currency, setCurrency] = useState(CURRENCIES[0]);
    const [transferAmount, setTransferAmount] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [allFees, setAllFees] = useState({});

    // Variables for bank withdraw
    const [bankWithdrawData, setBankWithdrawData] = useState({
        country: Countries[0],
        mode: 1,
        holderName: '',
        bankName: '',
        accNumber: '',
        postCode: '',
        swiftBicCode: '',
        ibanCode: ''
    });
    const [recipientAddress, setRecipientAddress] = useState('');
    const [bankSpecificData, setBankSpecificData] = useState({});
    // Initialize bank Specific data when changing the country.
    useEffect(() => {
        setBankSpecificData({});
    }, [bankWithdrawData.country.value]);

    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [returnValue, setReturnValue] = useState({});

    const transferAmountToFiat = transferAmount * assets[selectedAssetFiat?.value]?.price * currencyRates[currency.value];

    // Bank withdraw validation
    const bankWithDrawError = useMemo(() => {
        if(!bankWithdrawData.holderName) return {holderName: 'Full name of the account holder is required'};
        if(!bankWithdrawData.bankName) return {bankName: 'Bank name is required'};
        if(bankWithdrawData.mode === 2 && !bankWithdrawData.swiftBicCode) return {swiftBicCode: 'SWIFT / BIC code is required'};
        if(DOMESTIC_BANK_PER_COUNTRY[bankWithdrawData.country?.value]?.meta) {
            for(const item of DOMESTIC_BANK_PER_COUNTRY[bankWithdrawData.country?.value]?.meta) {
                if(!bankSpecificData[item]) return {[item]: `${item} is required`};
            }
        }
        if(!bankWithdrawData.accNumber) return {accNumber: 'Account number is required'};
        if(!recipientAddress) return {recipientAddress: 'Address is required'};
        if(!bankWithdrawData.postCode) return {postCode: 'Post Code is required'};

        return {};
    }, [bankWithdrawData, recipientAddress, bankSpecificData]);

    // Paypal email validation
    const paypalEmailError = useMemo(() => {
        if(!paypalEmail) return 'Please Enter Your PayPal Email.';
        if(!validator.isEmail(paypalEmail)) return 'Invalid Email';
    }, [paypalEmail]);

    useQuery(GET_ALL_FEES, {
        onCompleted: (data) => {
            setAllFees( _.mapKeys(data.getAllFees, "tierLevel"));
        },
        onError: (error) => console.log(error),
    });

    const goBackToFiat = () => {
        setCurrentStep(1);
        setCurrency(CURRENCIES[0]);
        setSelectedAssetFiat(myAssetsFiat[0]);
        setTransferAmount('');
    };

    const closeModal = () => {
        setWithdrawData({});
        setShowModal(false);
    };
    
    const [generateWithdrawMutation] = useMutation(Mutation.GENERATE_WITHDRAW, {
        onCompleted: data => {
            if(data.generateWithdraw) {
                setCurrentStep(4);
            }
            setPending(false);
        },
        onError: err => {
            console.log(err.message);
            setPending(false);
        }
    });

    const generate_Withdraw_Code = () => {
        if((withdrawType === PAYPAL && paypalEmailError) || (withdrawType === BANKTRANSFER && !_.isEmpty(bankWithDrawError))) {
            setShowError(true);
            return;
        }
        setError('');
        setConfirmCode('');
        setPending(true);
        generateWithdrawMutation();
    };

    //----------------- Paypal ------------------------
    const [paypalWithdrawRequestMutation] = useMutation(Mutation.PAYPAL_WITHDRAW_REQUEST, {
        onCompleted: data => {
            if(data.paypalWithdrawRequest) {
                setCurrentStep(5);
            }
            setPending(false);
        },
        onError: err => {
            setPending(false);
            if(err.message === 'Insufficient funds') {
                setError("Sorry! Your wallet don't have sufficient funds.");
            } else {
                setError(err.message);
            }
        }
    });

    const paypal_Withdraw_Request = () => {
        setError('');
        setPending(true);
        const requestData = {
            email: paypalEmail,
            target: currency.value,
            amount: Number(transferAmount),
            sourceToken: selectedAssetFiat?.value,
            code: confirmCode
        };
        paypalWithdrawRequestMutation({
            variables: { ...requestData }
        });
    };

    //-------------------Crypto Withdraw------------------------
    const [cryptoWithdrawRequestMutation] = useMutation(Mutation.CRYPTO_WITHDRAW_REQUEST, {
        onCompleted: data => {
            if(data.cryptoWithdrawRequest) {
                setCurrentStep(5);
            }
            setPending(false);
        },
        onError: err => {
            setPending(false);
            if(err.message === '2FA failed') {
                setError("Sorry! Two-factor authentication failed. Try again.");
            } else {
                setError(err.message);
            }
        }
    });

    const crypto_Withdraw_Request = () => {
        setError('');
        setPending(true);
        const requestData = {
            amount: Number(withdrawData.amount),
            sourceToken: selectedAsset.label,
            network: network?.network,
            des: withdrawData.destAddress,
            code: confirmCode
        };
        cryptoWithdrawRequestMutation({
            variables: { ...requestData }
        });
    };

    //-------------------------Bank Withdraw---------------------------------
    const [bankWithdrawRequestMutation] = useMutation(Mutation.BANK_WITHDRAW_REQUEST, {
        onCompleted: data => {
            if(data.bankWithdrawRequest) {
                setReturnValue(data.bankWithdrawRequest);
                setCurrentStep(5);
            }
            setPending(false);
        },
        onError: err => {
            setPending(false);
            setError(err.message);
        }
    });

    const bank_Withdraw_Request = () => {
        setError('');
        setPending(true);
        const metaData = bankWithdrawData.mode === 1? { ...bankSpecificData }: {
            'SWIFT / BIC code': bankWithdrawData.swiftBicCode,
            'IBAN code': bankWithdrawData.ibanCode
        };
        const requestData = {
            targetCurrency: currency.value,
            amount: Number(transferAmount),
            sourceToken: selectedAssetFiat?.value,
            mode: bankWithdrawData.mode,
            country: bankWithdrawData.country?.value,
            holderName: bankWithdrawData.holderName,
            bankName: bankWithdrawData.bankName,
            accNumber: bankWithdrawData.accNumber,
            metadata: JSON.stringify(metaData),
            address: recipientAddress,
            postCode: bankWithdrawData.postCode,
            code: confirmCode
        };
        bankWithdrawRequestMutation({
            variables: { ...requestData }
        });
    };

    const handleWithdrawRequest = () => {
        if(withdrawType === CRYPTOCURRENCY) {
            crypto_Withdraw_Request();
        } else if(withdrawType === PAYPAL) {
            paypal_Withdraw_Request();
        } else if(withdrawType === BANKTRANSFER) {
            bank_Withdraw_Request();
        }
    };

    const confirmDataForPaypal = [
        {topic: 'User Email', content: censorEmail(user.email)},
        {topic: 'Destination paypal address', content: paypalEmail},
        {topic: 'Currency', content: currency.value},
        {topic: 'Source Token', content: selectedAssetFiat?.label},
        {topic: 'Withdraw Amount', content: transferAmount},
    ];

    //-------------- Result of bank wihdraw -------
    const metaDataForBankTransfer = useMemo(() => {
        if(!returnValue?.metadata) return [];
        const metadata = JSON.parse(returnValue?.metadata);
        if(_.isEmpty(metadata)) return [];
        return Object.keys(metadata).map(key => ({ topic: key, content: metadata[key] }));
    }, [returnValue]);

    const confirmDataForBankTransfer = [
        {topic: 'Account Holder Name', content: returnValue.holderName},
        {topic: 'Bank Name', content: returnValue.bankName},
        ...metaDataForBankTransfer,
        {topic: 'Account Number', content: returnValue.accountNumber},
        {topic: 'Recipient Address', content: returnValue.address},
        {topic: 'Post Code', content: returnValue.postCode},
        {topic: 'token Amount', content: renderNumberFormat(Number(returnValue.tokenAmount).toFixed(8), returnValue.sourceToken)},
        {topic: 'Withdraw Amount', content: renderNumberFormat(Number(returnValue.withdrawAmount).toFixed(2), returnValue.targetCurrency)},
    ];
    // -----------------------------------------------
    
    const confirmDataForCrypto = [
        {topic: 'User Email', content: censorEmail(user.email)},
        {topic: 'Destination wallet address', content: withdrawData?.destAddress},
        {topic: 'Source Token', content: selectedAsset?.value},
        {topic: 'Withdraw Amount', content: withdrawData?.amount},
    ];

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
                        onClick={goBackToFiat}
                    />
                )}
                {currentStep === 3 && (
                    <Icon
                        className="icon"
                        icon="carbon:arrow-left"
                        onClick={() => {
                            setCurrentStep(2);
                            setShowError(false);
                        }}
                    />
                )}
                {currentStep === 4 && (
                    <Icon
                        className="icon"
                        icon="carbon:arrow-left"
                        onClick={() => {
                            if(withdrawType === CRYPTOCURRENCY) {
                                setCurrentStep(1);
                                setTabIndex(1);
                            } else {
                                setCurrentStep(3);
                            }
                            setConfirmCode('');
                        }}
                    />
                )}
                <div className="fw-bold h4 text-light"> </div>
                <Icon className="icon" icon="carbon:close" onClick={closeModal} />
            </div>
            <>
                {currentStep === 1 && (
                    <div className="deposit min_height2">
                        <div className="width1">
                            <h4 className="text-center mb-4">Withdraw</h4>
                            <div className="button-group pt-2">
                                <button className={`btn ${tabIndex === 1? 'selected': ''}`}
                                    onClick={() => setTabIndex(1)}
                                >Cryptocurrency</button>
                                <button className={`btn ${tabIndex === 2? 'selected': ''}`}
                                    onClick={() => setTabIndex(2)}
                                >Fiat</button>
                            </div>
                        </div>
                        {tabIndex === 1 &&
                        (_.isEmpty(myAssets)?
                            <h5 className='text-center mt-5'>
                                No Assets to withdraw
                            </h5>:
                            (<div className="width1">
                                <div className="select_div">
                                    <p className="subtitle">Select coin</p>
                                    <Select
                                        className="black_input"
                                        options={myAssets}
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
                                <div className="select_div">
                                    <p className="subtitle">Destination wallet address</p>
                                    <input
                                        className="black_input"
                                        value={withdrawData.destAddress}
                                        onChange = {e => setWithdrawData({ ...withdrawData, destAddress: e.target.value }) }
                                    />
                                </div>
                                <div className="select_div">
                                    <p className="subtitle">Amount</p>
                                    <div className='black_input withdraw_amount ps-2'>
                                        <NumberFormat
                                            value={withdrawData.amount}
                                            thousandSeparator={true}
                                            onValueChange={(values) => {
                                                setWithdrawData({ ...withdrawData, amount: values.value });
                                            }}
                                            allowNegative={false}
                                            decimalScale={8}
                                        />
                                        <p className="btn" aria-hidden="true"
                                            onClick={() => {
                                                setWithdrawData({ ...withdrawData, amount: roundNumber(selectedAsset.amount, 8) })
                                            }}
                                        ><span>MAX</span></p>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-outline-light rounded-0 w-100 mt-40px fw-bold mb-3"
                                    onClick={() => { setWithdrawType(CRYPTOCURRENCY); generate_Withdraw_Code(); }}
                                    disabled={pending || invalidForWithdraw}
                                >
                                    {pending? <CustomSpinner />: 'NEXT'}
                                </button>
                            </div>)
                        )}
                        {tabIndex === 2 && (
                            <div className="width2 mt-5 pt-5">
                                <div className="row mt-5">
                                    <div className="col-sm-6">
                                        <FiatButton className="active"
                                            onClick={() => {
                                                setWithdrawType(PAYPAL); setCurrentStep(2);
                                            }}
                                        >
                                            <img src={PaypalFiat} alt="paypal" />
                                        </FiatButton>
                                    </div>
                                    <div className="col-sm-6">
                                        <FiatButton className="active" 
                                            onClick={() => {
                                                setWithdrawType(BANKTRANSFER); setCurrentStep(2);
                                            }}
                                        >
                                            <p>Standard bank transfer</p>
                                        </FiatButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {currentStep === 2 &&
                <>
                    {_.isEmpty(selectedAssetFiat) && (
                        <h5 className="text-center mt-5">
                            No Assets to withdraw
                        </h5>
                    )}
                    {!_.isEmpty(selectedAssetFiat) && withdrawType === PAYPAL &&
                        <div className="deposit width2 mb-5">
                            <h5 className="text-center">PayPal withdraw</h5>
                            <div className="mt-3">
                                <p className="subtitle">Source of fund</p>
                                <Select
                                    className="black_input"
                                    options={myAssetsFiat}
                                    value={selectedAssetFiat}
                                    onChange={(selected) => {
                                        setSelectedAssetFiat(selected)
                                    }}
                                    styles={customSelectStylesWithIcon}
                                    placeholder="Select Coin"
                                    components={{
                                        Option: SelectOption,
                                        SingleValue: SelectOption,
                                        IndicatorSeparator: null                                            
                                    }}
                                />
                                <p className="mt-1">
                                    The <span className='txt-green'>{selectedAssetFiat?.value}</span> will be converted to <span className='txt-green'>{currency.label}</span> and deposited to your paypal account
                                </p>
                            </div>
                            <div>
                                <p className="subtitle">Currency</p>
                                <Select
                                    className="black_input"
                                    options={CURRENCIES}
                                    value={currency}
                                    onChange={(selected) => {
                                        setCurrency(selected)
                                    }}
                                    styles={customSelectStyles}
                                    components={{
                                        IndicatorSeparator: null                                            
                                    }}
                                />
                            </div>
                            <div className="mt-3">
                                <p className="subtitle">Amount (<span className='txt-green'>{selectedAssetFiat?.value}</span>)</p>
                                <div className="black_input transfer_input" onClick={() => jq('input#transferAmount').trigger('focus')} aria-hidden="true" >
                                    <NumberFormat id="transferAmount" className="ms-2"
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        value={transferAmount}
                                        onValueChange={values => setTransferAmount(values.value)}
                                        placeholder={'Min 1 ' + currency.symbol}
                                        decimalScale={8}
                                        autoComplete='off'
                                    />
                                    <div>
                                        Transaction fee{' '}
                                        <NumberFormat
                                            thousandSeparator={true}
                                            suffix={' ' + currency.symbol}
                                            displayType='text'
                                            allowNegative={false}
                                            value={Number(
                                                getPaypalPaymentFee(
                                                    user,
                                                    allFees,
                                                    transferAmountToFiat
                                                )
                                            )}
                                            decimalScale={2}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                className="btn btn-outline-light rounded-0 w-100 mt-50px fw-bold"
                                onClick={() => setCurrentStep(3)}
                                disabled={!transferAmount || Number(transferAmountToFiat) < MIN_VALUE}
                            >
                                NEXT
                            </button>
                        </div>
                    }
                    {!_.isEmpty(selectedAssetFiat) && withdrawType === BANKTRANSFER &&
                        <div className="deposit width2 mb-5">
                            <h5 className="text-center">Bank transfer withdraw</h5>
                            <div className="mt-3">
                                <p className="subtitle">Source of fund</p>
                                <Select
                                    className="black_input"
                                    options={myAssetsFiat}
                                    value={selectedAssetFiat}
                                    onChange={(selected) => {
                                        setSelectedAssetFiat(selected)
                                    }}
                                    styles={customSelectStylesWithIcon}
                                    placeholder="Select Coin"
                                    components={{
                                        Option: SelectOption,
                                        SingleValue: SelectOption,
                                        IndicatorSeparator: null
                                    }}
                                />
                                <p className="mt-1">
                                    The <span className='txt-green'>{selectedAssetFiat?.value}</span> will be converted to <span className='txt-green'>{currency.label}</span> and deposited to your bank account
                                </p>
                            </div>
                            <div>
                                <p className="subtitle">Select currency</p>
                                <Select
                                    className="black_input"
                                    options={CURRENCIES}
                                    value={currency}
                                    onChange={(selected) => {
                                        setCurrency(selected)
                                    }}
                                    styles={customSelectStyles}
                                    components={{
                                        IndicatorSeparator: null
                                    }}
                                />
                            </div>
                            <div className="mt-3">
                                <p className="subtitle">Amount (<span className='txt-green'>{selectedAssetFiat?.value}</span>)</p>
                                <div className="black_input transfer_input" onClick={() => jq('input#transferAmount').trigger('focus')} aria-hidden="true" >
                                    <NumberFormat id="transferAmount" className="ms-2"
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        value={transferAmount}
                                        onValueChange={values => setTransferAmount(values.value)}
                                        placeholder={'Min 1 ' + currency.symbol}
                                        decimalScale={8}
                                        autoComplete='off'
                                    />
                                    <div>
                                        Bank transfer fee{' '}
                                        <NumberFormat
                                            thousandSeparator={true}
                                            suffix={' ' + currency.symbol}
                                            displayType='text'
                                            allowNegative={false}
                                            value={Number(getBankTransferFee(
                                                user,
                                                allFees,
                                                transferAmountToFiat
                                            ))}
                                            decimalScale={2}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                className="btn btn-outline-light rounded-0 w-100 mt-50px fw-bold d-flex align-items-center justify-content-center"
                                onClick={() => setCurrentStep(3)}
                                disabled={!transferAmount || Number(transferAmountToFiat) < MIN_VALUE}
                            >
                                <div className={`${pending ? "opacity-100" : "opacity-0"} d-flex`}>
                                    <CustomSpinner />
                                </div>
                                <div className={`${pending ? "ms-3" : "pe-4"} text-uppercase`}>Next</div>
                            </button>
                        </div>
                    }
                </>
                }
                {currentStep === 3 &&
                <>
                    {withdrawType === PAYPAL &&
                        <div className='deposit width2'>
                            <div className="d-flex flex-column justify-content-center" style={{minHeight: 420}}>
                                <h5>PayPal Email</h5>
                                <input className="black_input"
                                    value={paypalEmail}
                                    onChange={e => setPaypalEmail(e.target.value)}
                                />
                                <p style={{height: 25, color: '#e16565'}}>
                                    {showError && paypalEmailError}
                                </p>
                                <button
                                    className="btn btn-outline-light rounded-0 w-100 mt-50px fw-bold d-flex align-items-center justify-content-center"
                                    onClick={generate_Withdraw_Code}
                                    disabled={pending}
                                >
                                    <div className={`${pending ? "opacity-100" : "opacity-0"} d-flex`}>
                                        <CustomSpinner />
                                    </div>
                                    <div className={`${pending ? "ms-3" : "pe-4"} text-uppercase`}>Next</div>
                                </button>
                            </div>
                        </div>
                    }
                    {withdrawType === BANKTRANSFER &&
                        <div className="deposit width2 bankDetail">
                            <div className="mb-2">
                                <p className="subtitle">Select Country</p>
                                <Select
                                    className="black_input"
                                    options={Countries}
                                    value={bankWithdrawData.country}
                                    onChange={(selected) => setBankWithdrawData({...bankWithdrawData, country: selected})}
                                    styles={customSelectStyles}
                                    components={{
                                        IndicatorSeparator: null                                            
                                    }}
                                />
                            </div>
                            <div className="button-group pb-3">
                                <button className={`btn ${bankWithdrawData.mode === 1? 'selected': ''}`}
                                    onClick={() => setBankWithdrawData({ ...bankWithdrawData, mode: 1 })}
                                    style={{height: 47}}
                                >Domestic transfer</button>
                                <button className={`btn ${bankWithdrawData.mode === 2? 'selected': ''}`}
                                    onClick={() => setBankWithdrawData({ ...bankWithdrawData, mode: 2 })}
                                    style={{height: 47}}
                                >Foreign transfer</button>
                            </div>
                            {bankWithdrawData.mode === 1 && DOMESTIC_BANK_PER_COUNTRY[bankWithdrawData.country?.value]?.info && (
                                <div className="d-flex align-items-center">
                                    <p className="font-30px pe-2">
                                        <Icon icon='ant-design:warning-filled' />
                                    </p>
                                    <p>
                                        {DOMESTIC_BANK_PER_COUNTRY[bankWithdrawData.country?.value]?.info}
                                    </p>
                                </div>
                            )}
                            <div className="mt-2">
                                <p className="subtitle">Full name of the account holder</p>
                                <input className={`black_input ${showError && bankWithDrawError.holderName? 'error': ''}`}
                                    value={bankWithdrawData.holderName}
                                    onChange={e => setBankWithdrawData({ ...bankWithdrawData, holderName: e.target.value })}
                                />
                            </div>
                            <div className="mt-2">
                                <p className="subtitle">Bank name</p>
                                <input  className={`black_input ${showError && bankWithDrawError.bankName? 'error': ''}`}
                                    value={bankWithdrawData.bankName}
                                    onChange={e => setBankWithdrawData({ ...bankWithdrawData, bankName: e.target.value })}
                                />
                            </div>
                            {bankWithdrawData.mode === 1 && DOMESTIC_BANK_PER_COUNTRY[bankWithdrawData.country?.value]?.meta && (
                                <>
                                    {DOMESTIC_BANK_PER_COUNTRY[bankWithdrawData.country?.value]?.meta.map(item => (
                                        <div className="mt-2" key={item}>
                                            <p className="subtitle">{item}</p>
                                            <input  className={`black_input ${showError && bankWithDrawError[item]? 'error': ''}`}
                                                value={bankSpecificData[item] || ''}
                                                onChange={e => setBankSpecificData({ ...bankSpecificData, [item]: e.target.value })}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                            {bankWithdrawData.mode === 2 && (
                                <>
                                    <div className="mt-2">
                                        <p className="subtitle">SWIFT / BIC code</p>
                                        <input  className={`black_input ${showError && bankWithDrawError.swiftBicCode? 'error': ''}`}
                                            value={bankWithdrawData.swiftBicCode}
                                            onChange={e => setBankWithdrawData({ ...bankWithdrawData, swiftBicCode: e.target.value })}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <p className="subtitle">IBAN code (if applicable)</p>
                                        <input  className='black_input'
                                            value={bankWithdrawData.ibanCode}
                                            onChange={e => setBankWithdrawData({ ...bankWithdrawData, ibanCode: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="mt-2">
                                <p className="subtitle">Account number</p>
                                <input  className={`black_input ${showError && bankWithDrawError.accNumber? 'error': ''}`}
                                    value={bankWithdrawData.accNumber}
                                    onChange={e => setBankWithdrawData({ ...bankWithdrawData, accNumber: e.target.value })}
                                />
                            </div>
                            <h4 className="mt-2">Recipient address</h4>
                            <div className="mt-2">
                                <p className="subtitle">Address</p>
                                <LocationSearchInput
                                    className={`black_input ${showError && bankWithDrawError.recipientAddress? 'error': ''}`}
                                    address={recipientAddress} setAddress={setRecipientAddress}
                                />
                            </div>
                            <div className="mt-2">
                                <p className="subtitle">Post code</p>
                                <input  className={`black_input ${showError && bankWithDrawError.postCode? 'error': ''}`}
                                    value={bankWithdrawData.postCode}
                                    onChange={e => setBankWithdrawData({ ...bankWithdrawData, postCode: e.target.value })}
                                />
                            </div>
                            <div className="mt-2">
                                <p style={{height: 25, color: '#e16565'}}>
                                    {showError && Object.values(bankWithDrawError)[0]}
                                </p>
                                <button
                                    className="btn btn-outline-light rounded-0 w-100 mt-3 fw-bold d-flex align-items-center justify-content-center"
                                    onClick={generate_Withdraw_Code}
                                    disabled={pending}
                                >
                                    <div className={`${pending ? "opacity-100" : "opacity-0"} d-flex`}>
                                        <CustomSpinner />
                                    </div>
                                    <div className={`${pending ? "ms-3" : "pe-4"} text-uppercase`}>Next</div>
                                </button>
                            </div>
                        </div>
                    }
                </>
                }
                {currentStep === 4 &&
                    (
                        <div className='deposit width2'>
                            <div className="confirm_div">
                                <h3 className="mt-3"><strong>Confirm Withdraw</strong></h3>
                                <p className="mt-5 mb-3">Enter Email Code</p>
                                <ReactCodeInput type='number' fields={6}
                                    value={confirmCode}
                                    onChange={value => setConfirmCode(value)}
                                />
                                <div className="mt-3 d-flex align-items-center">
                                    <p className="text-center">The code has been sent to {censorEmail(user.email)}</p>
                                    <span className='txt-green cursor-pointer ms-1' aria-hidden="true"
                                        style={{opacity: pending? 0.5: 1}}
                                        onClick={generate_Withdraw_Code}
                                        disabled={pending}
                                    ><strong>Resend</strong></span>
                                </div>
                                <p className="mt-2" style={{color: '#e16565'}}>
                                    {error}
                                </p>
                            </div>
                            <div className="d-flex justify-content-center mt-2">
                                <button className="btn btn-outline-light fw-bold rounded-0 w-50 mx-1"
                                    onClick={closeModal}
                                >CANCEL</button>
                                <button className="btn btn-outline-light fw-bold rounded-0 w-50 mx-1 d-flex align-items-center justify-content-center"
                                    onClick={handleWithdrawRequest}
                                    disabled={pending || confirmCode.length < 6}
                                >
                                    <div className={`${pending ? "opacity-100" : "opacity-0"} d-flex`}>
                                        <CustomSpinner />
                                    </div>
                                    <div className={`${pending ? "ms-3" : "pe-4"}`}>CONFIRM</div>
                                </button>
                            </div>
                        </div>
                    )
                }
                {currentStep === 5 &&
                    <div className='deposit width2'>
                        <div className="confirm_div">
                            <h4 className="mt-3">
                                <strong>
                                    {withdrawType === PAYPAL && 'Paypal '}
                                    {withdrawType === BANKTRANSFER && 'Bank Transfer '}
                                    {withdrawType === CRYPTOCURRENCY && 'Cryptocurrency '}
                                    Withdraw Details
                                </strong>
                            </h4>
                            <h5 className="mt-2 txt-green">
                                Request sent successfully
                            </h5>
                            <div className="stats_div w-100 mt-2">
                                {withdrawType === PAYPAL && confirmDataForPaypal.map(item => (
                                    <div className="stats" key={item.topic}>
                                        <p className="topic">{item.topic}</p>
                                        <p className="content">
                                            {item.content}
                                        </p>
                                    </div>
                                ))}
                                {withdrawType === BANKTRANSFER && confirmDataForBankTransfer.map(item => (
                                    <div className="stats" key={item.topic}>
                                        <p className="topic">{item.topic}</p>
                                        <p className="content">
                                            {item.content}
                                        </p>
                                    </div>
                                ))}
                                {withdrawType === CRYPTOCURRENCY && confirmDataForCrypto.map(item => (
                                    <div className="stats" key={item.topic}>
                                        <p className="topic">{item.topic}</p>
                                        <p className="content">
                                            {item.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                            <button className="btn btn-outline-light fw-bold rounded-0 w-50 mx-1"
                                onClick={closeModal}
                            >CLOSE</button>
                        </div>
                    </div>
                }
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
    input: provided => ({
        ...provided,
        color: 'white',
        paddingLeft: 7
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