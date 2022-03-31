/* eslint-disable */
import React, { useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import jq from 'jquery';
import ReactCodeInput from 'react-code-input';
import Modal from "react-modal";
import { navigate } from 'gatsby';
import validator from "validator";
import _ from "lodash";
import styled from 'styled-components';
import Select, { components } from "react-select";
import NumberFormat from "react-number-format";
import { Icon } from "@iconify/react";
import { useQuery, useMutation } from '@apollo/client';
import CustomSpinner from "../common/custom-spinner";
import { GET_ALL_FEES } from "../../apollo/graphqls/querys/Payment";
import { getPaypalPaymentFee } from "../../utilities/utility-methods";
import {
    PaypalFiat,
    USDT } from '../../utilities/imgImport';
import { SUPPORTED_COINS } from "../../utilities/staticData2";
import * as Mutation from "../../apollo/graphqls/mutations/Payment";
import { censorEmail } from "../../utilities/string";
import { ROUTES } from "../../utilities/routes";

const CURRENCIES = [
    {label: 'USD', value: 'USD', symbol: '$'},
    // {label: 'GBP', value: 'GBP', symbol: '£'},
    // {label: 'EUR', value: 'EUR', symbol: '€'},
];

const TransferData = {
    EUR: {
        'Account holder': 'Voltamond',
        'BIC': 'TRWIBEB1XXX',
        'IBAN': 'BE36 9672 2651 6281',
        'Address': 'Avenue Louise 54, Room S52, Brussels, 1050, Belgium',
        'Reference': '123456789'
    },
    GBP: {
        'Account holder': 'Voltamond',
        'Sort code': '23-14-70',
        'Account number': '22063784',
        'IBAN': 'GB29 TRWI 2314 7022 0637 84',
        'Address': '56 Shoreditch High Street, London, E1 6JJ, United Kingdom',
    },
    USD: {
        'Account holder': 'Voltamond',
        'Routing number': '084009519',
        'Account number': '9600001149793466',
        'Account type': 'Checking',
        'Address': '19 W 24th Street, New York NY 10010, United States',
    }
};

const TransferFee = 0.03; 

const { Option } = components;

const SupportedCoins = _.mapKeys(SUPPORTED_COINS, 'value');

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
                    <NumberFormat
                        value={props.data?.amount}
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

export default function DepositModal({ showModal, setShowModal, assets }) {
    const user = useSelector((state) => state.auth.user);
    const myAssets = _.orderBy(assets.filter(item => {
        return item.tokenSymbol !== 'VOLT';
    }).map(item => {
        return {
            value: item.tokenSymbol,
            label: item.tokenSymbol,
            amount: item.free + item.hold,
            icon: item.symbol,
            balance: item.balance,
            networks: SupportedCoins[item.tokenSymbol]?.networks
        };
    }), ['balance'], ['desc']);
    
    const [selectedAsset, setSelectedAsset] = useState(myAssets[0]);
    const [currentStep, setCurrentStep] = useState(1);
    const [isPaypalWithdraw, setIsPaypalWithdraw] = useState(false);
    const [tabIndex, setTabIndex] = useState(1);
    const [pending, setPending] =useState(false);

    const networks = useMemo(() => (selectedAsset?.networks?? []), [selectedAsset]);    
    const [network, setNetwork] = useState(networks[0]);
    const [withdrawData, setWithdrawData] = useState({destAddress: '', amount: ''});
    const [confirmCode, setConfirmCode] = useState('');
    const [returnValue, setReturnValue] = useState({});
    const invalidForWithdraw= !withdrawData.destAddress || !withdrawData.amount || Number(withdrawData.amount) > selectedAsset.amount;
    
    // Variables for bank transfer
    const [currency, setCurrency] = useState(CURRENCIES[0]);
    const [transferAmount, setTransferAmount] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [allFees, setAllFees] = useState({});

    const [showError, setShowError] = useState(false);

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
        setTransferAmount('');
    };

    const closeModal = () => {
        setWithdrawData({});
        setShowModal(false);
    };

    //----------------- Paypal ------------------------
    const [generateWithdrawMutation] = useMutation(Mutation.GENERATE_WITHDRAW, {
        onCompleted: data => {
            if(data.generateWithdraw) {
                console.log(data.generateWithdraw)
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
        if(paypalEmailError) {
            setShowError(true);
            return;
        }
        setPending(true);
        generateWithdrawMutation();
    };

    const [paypalWithdrawRequestMutation] = useMutation(Mutation.PAYPAL_WITHDRAW_REQUEST, {
        onCompleted: data => {
            if(data.paypalWithdrawRequest) {
                setCurrentStep(5);
            }
            setPending(false);
        },
        onError: err => {
            console.log(err.message);
            setPending(false);
            setCurrentStep(5)
        }
    });

    const paypal_Withdraw_Request = e => {
        e.preventDefault();
        setPending(true);
        const requestData = {
            email: paypalEmail,
            target: currency.value,
            withdrawAmount: Number(transferAmount),
            sourceToken: 'USDT',
            code: confirmCode
        };
        paypalWithdrawRequestMutation({
            variables: { ...requestData }
        });
    };
    

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
                        }}
                    />
                )}
                {currentStep === 4 && (
                    <Icon
                        className="icon"
                        icon="carbon:arrow-left"
                        onClick={() => {
                            setCurrentStep(3);
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
                            <div className="button-group">
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
                            <p className='text-center mt-3'>
                                No Assets to withdraw
                            </p>:
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
                                        />
                                        <p className="btn"
                                            onClick={() => {
                                                setWithdrawData({ ...withdrawData, amount: selectedAsset.amount })
                                            }}
                                        ><span>MAX</span></p>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-outline-light rounded-0 w-100 mt-40px fw-bold mb-3"
                                    // onClick={create_Charge_For_Deposit}
                                    disabled={pending || invalidForWithdraw}
                                >
                                    {pending? <CustomSpinner />: 'WITHDRAW'}
                                </button>
                            </div>)
                        )}
                        {tabIndex === 2 && (
                            <div className="width2 mt-5 pt-5">
                                <div className="row mt-5">
                                    <div className="col-sm-6">
                                        <FiatButton className="active" onClick={() => {
                                            setIsPaypalWithdraw(true); setCurrentStep(2);
                                        }}>
                                            <img src={PaypalFiat} alt="paypal" />
                                        </FiatButton>
                                    </div>
                                    <div className="col-sm-6">
                                        <FiatButton className="inactive" 
                                            // onClick={() => {
                                            //     setIsPaypalWithdraw(false); setCurrentStep(2);
                                            // }}
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
                    (isPaypalWithdraw? (
                        <div className="deposit width2 mb-5">
                            <h5 className="text-center">PayPal withdraw</h5>
                            <div className="mt-3">
                                <p className="subtitle">Source of fund</p>
                                <div className="black_input usdt_div">
                                    <img src={USDT} alt='usdt' className="ms-2" />
                                    <p className="ms-2">USDT</p>
                                </div>
                                <p className="desc">
                                    The <span>USDT</span> will be converted to <span>{currency.label}</span> and deposited to your paypal account
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
                                <p className="subtitle">Amount</p>
                                <div className="black_input transfer_input" onClick={() => jq('input#transferAmount').trigger('focus')} >
                                    <NumberFormat id="transferAmount" className="ms-2"
                                        thousandSeparator={true}
                                        prefix={currency.symbol + ' '}
                                        allowNegative={false}
                                        value={transferAmount}
                                        onValueChange={values => setTransferAmount(values.value)}
                                        placeholder={'Min 1 ' + currency.symbol}
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
                                                    transferAmount
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
                                disabled={!transferAmount || Number(transferAmount) < 1}
                            >
                                NEXT
                            </button>
                        </div>
                    ): (
                        <div className="deposit width2 mb-5">
                            <h5 className="text-center">Bank transfer withdraw</h5>
                            <div className="mt-3">
                                <p className="subtitle">Source of fund</p>
                                <div className="black_input usdt_div">
                                    <img src={USDT} alt='usdt' className="ms-2" />
                                    <p className="ms-2">USDT</p>
                                </div>
                                <p className="desc">
                                    The <span>USDT</span> will be converted to <span>{currency.label}</span> and deposited to your bank
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
                                <p className="subtitle">Amount</p>
                                <div className="black_input transfer_input" onClick={() => jq('input#transferAmount').trigger('focus')} >
                                    <NumberFormat id="transferAmount" className="ms-2"
                                        thousandSeparator={true}
                                        prefix={currency.symbol + ' '}
                                        allowNegative={false}
                                        value={transferAmount}
                                        onValueChange={values => setTransferAmount(values.value)}
                                        autoComplete='off'
                                    />
                                    <div>
                                        Bank transfer fee{' '}
                                        <NumberFormat
                                            thousandSeparator={true}
                                            suffix={' ' + currency.symbol}
                                            displayType='text'
                                            allowNegative={false}
                                            value={Number(transferAmount) * TransferFee}
                                            decimalScale={2}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                className="btn btn-outline-light rounded-0 w-100 mt-50px fw-bold"
                                onClick={() => setCurrentStep(3)}
                                disabled={!transferAmount}
                            >
                                NEXT
                            </button>
                        </div>
                    ))
                }
                {currentStep === 3 &&
                    (isPaypalWithdraw? (
                        <div className='deposit width2'>
                            <div className="paypal_email">
                                <h5>PayPal Email</h5>
                                <input className="black_input"
                                    value={paypalEmail}
                                    onChange={e => setPaypalEmail(e.target.value)}
                                />
                                <p style={{height: 25}}>
                                    {showError && paypalEmailError}
                                </p>
                                <button
                                    className="btn btn-outline-light rounded-0 w-100 mt-50px fw-bold d-flex align-items-center justify-content-center"
                                    onClick={generate_Withdraw_Code}
                                    disabled={pending}
                                >
                                    <div className={`${pending ? "opacity-1" : "opacity-0"} d-flex`}>
                                        <CustomSpinner />
                                    </div>
                                    <div className={`${pending ? "ms-3" : "pe-4"} text-uppercase`}>Request withdraw</div>
                                </button>
                            </div>
                        </div>
                    ): (
                        <></>
                    ))
                }
                {currentStep === 4 &&
                    (isPaypalWithdraw? (
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
                                    <span className='text-green cursor-pointer ms-1'
                                        style={{opacity: pending? 0.5: 1}}
                                        onClick={generate_Withdraw_Code}
                                        disabled={pending}
                                    ><strong>Resend</strong></span>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mt-2">
                                <button className="btn btn-outline-light fw-bold rounded-0 w-50 mx-1"
                                    onClick={closeModal}
                                >CANCEL</button>
                                <button className="btn btn-outline-light fw-bold rounded-0 w-50 mx-1 d-flex align-items-center justify-content-center"
                                    onClick={paypal_Withdraw_Request}
                                    disabled={pending || confirmCode.length < 6}
                                >
                                    <div className={`${pending ? "opacity-1" : "opacity-0"} d-flex`}>
                                        <CustomSpinner />
                                    </div>
                                    <div className={`${pending ? "ms-3" : "pe-4"}`}>CONFIRM</div>
                                </button>
                            </div>
                        </div>
                    ): (
                        <></>
                    ))
                }
                {currentStep === 5 &&
                    (isPaypalWithdraw? (
                        <div className='deposit width2'>
                            <div className="confirm_div">
                                <h3 className="mt-3"><strong>Withdraw Details</strong></h3>
                                <div className="stats_div w-100">
                                    <div className="stats">
                                        <p className="topic">User Email</p>
                                        <p className="content">
                                            {censorEmail(user.email)}
                                        </p>
                                    </div>
                                    <div className="stats">
                                        <p className="topic">PayPal Email</p>
                                        <p className="content">
                                            {paypalEmail}
                                        </p>
                                    </div>
                                    <div className="stats">
                                        <p className="topic">Currency</p>
                                        <p className="content">
                                            {currency.value}
                                        </p>
                                    </div>
                                    <div className="stats">
                                        <p className="topic">Source Token</p>
                                        <p className="content">
                                            USDT
                                        </p>
                                    </div>
                                    <div className="stats">
                                        <p className="topic">Withdraw Amount</p>
                                        <p className="content">
                                            {transferAmount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mt-2">
                                <button className="btn btn-outline-light fw-bold rounded-0 w-50 mx-1"
                                    onClick={closeModal}
                                >CLOSE</button>
                            </div>
                        </div>
                    ): (
                        <></>
                    ))
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