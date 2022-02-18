import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Select, { components } from "react-select"
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon, faQuestionCircle } from '@fortawesome/react-fontawesome';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation } from '@apollo/client';
import { GET_DEPOSIT_ADDRESS } from '../../apollo/graghqls/mutations/Payment';
import { PAYMENT_FRACTION_TOOLTIP_CONTENT } from '../../utilities/staticData';
import icons from "base64-cryptocurrency-icons"
import { generateQR } from '../../utilities/string';
import { Input, CheckBox } from '../common/FormControl';
import { Copy } from '../../utilities/imgImport';
import { numberWithCommas } from './../../utilities/number';

const { Option, SingleValue } = components

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

const CoinPaymentsTab = ({ currentRound , bidAmount, fooCoins = [], BTCPrice = 10000 }) => {
    const [copied, setCopied] = useState(false);
    const [coinQRCode, setCoinQRCode] = useState("");
    const [coin, setCoin] = useState(fooCoins[0])
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

    const coinQuantity = useMemo(() => {
        const coinPrice = BTCPrice * coin.data?.rate_btc;
        return (bidAmount / coinPrice).toFixed(9).toString();
    }, [bidAmount, coin, BTCPrice])


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
            console.log(data)
            if(data.getDepositAddress) {
                setDepositAddress(data.getDepositAddress);
                setPending(false);
            }
        },
        onError: err => {
            console.log('get deposit address: ', err);
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

    return (
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
                                <Input
                                    type="number"
                                    value={coinQuantity}
                                    disabled
                                />
                            </div>
                        </div>
                        {!depositAddress ? (
                            <button
                                className="btn btn-light rounded-0 text-uppercase fw-bold mt-2 py-10px w-100"
                                onClick={get_Deposit_Address}
                            >
                                {pending? <CircularProgress color="success" size={20}/>: 'get deposit Address'}
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