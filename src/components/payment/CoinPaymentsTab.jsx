import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios"
import _ from 'lodash'
import { useQuery } from "@apollo/client"
import Select, { components } from "react-select"
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon, faQuestionCircle } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';
import NumberFormat from 'react-number-format';
import { useMutation } from '@apollo/client';
import { GET_DEPOSIT_ADDRESS } from '../../apollo/graghqls/mutations/Payment';
import { PAYMENT_FRACTION_TOOLTIP_CONTENT } from '../../utilities/staticData';
import icons from "base64-cryptocurrency-icons"
import { generateQR } from '../../utilities/string';
import { Input, CheckBox } from '../common/FormControl';
import { Copy } from '../../utilities/imgImport';
import { GET_EXCHANGE_RATE } from './../../apollo/graghqls/querys/Payment'
import CustomSpinner from "../common/custom-spinner"
import { numberWithCommas } from './../../utilities/number';

const { Option } = components

const SelectOption = (props) => {
    const { data } = props;
    return (<Option {...props}>
        <div className="d-flex justify-content-center justify-content-sm-start align-items-center ">
            <img
                src={icons[data.value]?.icon}
                style={{ width: "30px", height: "auto" }}
                alt={data.value}
            />
            <p className="coin-label ms-2">{data.value}</p>
        </div>
    </Option>)
}

const FOO_COINS = [
    { value: "BTC", label: "BTC" },
    { value: "ETH", label: "ETH" },
    { value: "BNB", label: "BNB" },
    { value: "LTC", label: "LTC" },
    { value: "DOGE", label: "DOGE" },
    { value: "USDC", label: "USDC" },
    { value: "USDT", label: "USDT" },
    { value: "DAI", label: "DAI" },
]

const QUOTE = "USDT"
const TICKER_24hr = "https://api.binance.com/api/v3/ticker/24hr"

const CoinPaymentsTab = ({ currentRound , bidAmount }) => {
    const [copied, setCopied] = useState(false);

    const [fooCoins, setFooCoins] = useState([])
    const [BTCPrice, setBTCPrice] = useState(null)

    const loadingData = _.isEmpty(fooCoins) || !BTCPrice;

    const [coin, setCoin] = useState({})
    const [pending, setPending] = useState(false);

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        cardholder: "",
        cardnumber: "",
        expire: "",
        code: "",
        bill: "",
        allow_fraction: false,
    })
    const { cardholder, cardnumber, expire, code, bill, allow_fraction } = state

    useQuery(GET_EXCHANGE_RATE, {
        onCompleted: (data) => {
            if (data.getExchangeRate) {
                const temp = JSON.parse(data.getExchangeRate)
                const coins = FOO_COINS.map((item) => {
                    return { ...item, detail: temp?.result[item.value] }
                })
                setFooCoins(coins)
                console.log(coins)
                setCoin(coins[0])
            }
        },
        onError: (err) => {
            console.log("get exchange rate: ", err)
        },
    })

    useEffect(() => {
        const get_BTCPrice = () => {
            axios.get(TICKER_24hr, { params: { symbol: "BTC" + QUOTE } }).then((res) => {
                setBTCPrice(res.data.lastPrice)
            })
        }
        get_BTCPrice()
    }, [])

    const coinQuantity = useMemo(() => {
        const coinPrice = BTCPrice * coin?.detail?.rate_btc;
        return parseFloat((bidAmount / coinPrice).toFixed(9));
    }, [bidAmount, coin, BTCPrice])

    const [coinQRCode, setCoinQRCode] = useState("");
    const [depositAddress, setDepositAddress] = useState('')

    useEffect(async () => {
        if (depositAddress) {
            const qrCode = await generateQR(depositAddress)
            setCoinQRCode(qrCode)
        }
        return ""
    }, [depositAddress])

    const [getDepositAddressMutation] = useMutation(GET_DEPOSIT_ADDRESS, {
        onCompleted: data => {
            if(data.getDepositAddress) {
                setDepositAddress(data.getDepositAddress);
                setPending(false);
            }
        },
        onError: err => {
            console.log('get deposit address: ', err);
            setPending(false);
        }
    })

    const get_Deposit_Address = () => {
        setPending(true);
        getDepositAddressMutation({
            variables: {
                currency: coin.value
            }
        });
    };

    const handleAllowFraction = useCallback(
        (e) => {
            e.preventDefault()
            setState({ allow_fraction: !allow_fraction })
        },
        [allow_fraction]
    )

    return loadingData?
    <div className='text-center'>
        <CustomSpinner />
    </div>:
    (
        <div className="cryptocoin-tab">
            <div className="payment-content">
                <div className="set-cryptocoin">
                    <div className="d-flex flex-column justify-content-between coin-address">
                        <div className="d-flex justify-content-between w-100">
                            <Select
                                className="cryptocoin-select"
                                options={fooCoins}
                                value={coin}
                                onChange={(v) => {
                                    setCoin(v)
                                    setDepositAddress('')
                                }}
                                components={{
                                    Option: SelectOption,
                                    SingleValue: SelectOption,
                                }}
                            />
                            <div className="w-75">
                                <NumberFormat
                                    className='black_input'
                                    value={coinQuantity}
                                    thousandSeparator={true}
                                    readOnly
                                />
                            </div>
                        </div>
                        {!depositAddress ? (
                            <button
                                className="btn btn-light rounded-0 text-uppercase fw-bold mt-2 py-10px w-100"
                                onClick={get_Deposit_Address}
                            >
                                {pending? <CircularProgress sx={{color: 'black'}} size={20}/>: 'get deposit Address'}
                            </button>
                        ) : (
                            <>
                                <CopyToClipboard
                                    onCopy={() => setCopied(true)}
                                    text={depositAddress}
                                    options={{ message: "copied" }}
                                >
                                    <p
                                        className="clipboard"
                                        onClick={() => setCopied(true)}
                                        onKeyDown={() => setCopied(true)}
                                        role="presentation"
                                    >
                                        <code>{depositAddress}</code>
                                        <img src={Copy} alt="copy" />
                                    </p>
                                </CopyToClipboard>
                            </>
                        )}
                    </div>
                    {depositAddress && (
                        <div className="qr-code">
                            {coinQRCode ? (
                                <img src={coinQRCode} alt="qrcode" />
                            ) : (
                                ""
                            )}
                        </div>
                    )}
                </div>
                <div className="mt-3 d-flex justify-content-between">
                    <div className="d-flex flex-row ">
                        <CheckBox
                            type="checkbox"
                            name="allow_fraction"
                            value={allow_fraction}
                            onChange={handleAllowFraction}
                            className="text-uppercase"
                        ></CheckBox>
                        <div className="allow-text text-light">
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
                            className="fa-2x ms-2 cursor-pointer text-light"
                        />
                    </div>
                    <p className="payment-expire my-auto">
                        payment expires in{" "}
                        <span className="txt-green">10 minutes</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CoinPaymentsTab;