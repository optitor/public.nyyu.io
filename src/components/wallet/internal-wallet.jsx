/* eslint-disable */

import React, { useEffect, useState, useMemo } from "react"
import _ from 'lodash';
import svgToDataURL from 'svg-to-dataurl'
import axios from "axios"
import DepositWithdrawModal from "../../components/wallet/deposit-withdraw-modal"
import CustomSpinner from "../common/custom-spinner"
import { TRANSACTION_TYPES } from "../../utilities/staticData"
import NumberFormat from "react-number-format"
import { useQuery } from "@apollo/client"
import { GET_BALANCES } from "../../apollo/graghqls/querys/Auth"
import { Icon } from '@iconify/react';

const QUOTE = "USDT"
const TICKER_24hr = "https://api.binance.com/api/v3/ticker/24hr"
const REFRESH_TIME = 30;

const Asset = ({item}) => {
    return (
        <tr>
            <td className="d-flex align-items-center ps-2">
                <img src={svgToDataURL(item.symbol)} alt="coin icon" className="me-2" />
                <div>
                    <p className="coin-abbr text-light">{item.tokenName}</p>
                </div>
            </td>
            <td>
                <p className="coin-price fw-bold">
                    {(item.free + item.hold)} {item.tokenSymbol}
                </p>
                <NumberFormat
                    value={(item.balance)?.toFixed(2)}
                    className="coin-percent"
                    displayType={'text'}
                    thousandSeparator={true}
                    renderText={(value, props) => <p {...props}>{value} USD</p>}
                />
            </td>
        </tr>
    );
}

export default function InternalWallet() {
    const [myAssets, setMyAssets] = useState({});
    const [BTCPrice, setBTCPrice] = useState(10000);

    const [hideValues, setHideValues] = useState(false)
    const [transactionType, setTransactionType] = useState(TRANSACTION_TYPES.deposit)
    const [showDepositAndWidthdrawModal, setShowDepositAndWidthdrawModal] = useState(false)
    const obscureValueString = "******"
    const [btcOrUsd, setBtcOrUsd] = useState("USD")
    
    // console.log(myAssets)
    const totalBalance = useMemo(() => {
        if(!Object.values(myAssets)) return 0;
        return _.sumBy(Object.values(myAssets), 'balance');
    }, [myAssets]);

    useEffect(() => {
        const get_BTCPrice = () => {
            axios.get(TICKER_24hr, { params: { symbol: 'BTC' + QUOTE } }).then(res => {
                setBTCPrice(res.data.lastPrice);
            });
        };
        get_BTCPrice();
        setInterval(() => {
            get_BTCPrice();
        }, 1000 * REFRESH_TIME);
    }, []);

    const { data: balances } = useQuery(GET_BALANCES, {
        fetchPolicy: "network-only",
        onCompleted: () => {
            if(balances.getBalances) {
                const assets = _.mapKeys(balances.getBalances, 'tokenSymbol');
                setMyAssets(assets);
            }
        },
    })

    useEffect(() => {
        (async function() {
            const get_balances = async () => {
                if(!Object.keys(myAssets).length) return;
                let assets = {};
                for(const item of Object.values(myAssets)) {
                    let price = 0;
                    if(!item.tokenSymbol || item.tokenSymbol === 'NDB' || item.tokenSymbol === 'VOLT') {
                        price = 0;
                    } else {
                        const res = await axios.get(TICKER_24hr, { params: { symbol: item.tokenSymbol + QUOTE } });
                        price = res.data.lastPrice;
                    }
                    let balance = (item.free + item.hold) * price;
                    assets[item.tokenSymbol] = { ...item, price, balance };
                }
                setMyAssets({ ...assets });
            };

            get_balances();
            setInterval(() => {
                get_balances();
            }, 1000 * REFRESH_TIME);
        })();
    }, [Object.keys(myAssets).length]);
    const loadingSection = !myAssets

    if (loadingSection)
        return (
            <div className="text-center my-5">
                <CustomSpinner />
            </div>
        )
    else
        return (
            <div>
                <div className="profile-value">
                    <div className="value-box">
                        <div className="value-label d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                Equity Value (BTC)
                                {!hideValues && (
                                    <Icon className="value-label-eye-icon" 
                                        icon="bi:eye-slash"
                                        onClick={() => setHideValues(true)}
                                    />
                                )}
                                {hideValues && (
                                    <Icon className="value-label-eye-icon" 
                                        icon="bi:eye"
                                        onClick={() => setHideValues(false)}
                                    />
                                )}
                            </div>

                            <div className="d-flex gap-2">
                                <div
                                    className={`cursor-pointer ${
                                        btcOrUsd === "BTC" && "fw-bold text-white"
                                    }`}
                                    onClick={() => setBtcOrUsd("BTC")}
                                    onKeyDown={() => setBtcOrUsd("BTC")}
                                    role="presentation"
                                >
                                    BTC
                                </div>
                                <div>|</div>
                                <div
                                    className={`cursor-pointer ${
                                        btcOrUsd === "USD" && "fw-bold text-white"
                                    }`}
                                    onClick={() => setBtcOrUsd("USD")}
                                    onKeyDown={() => setBtcOrUsd("USD")}
                                    role="presentation"
                                >
                                    USD
                                </div>
                            </div>
                        </div>
                        {hideValues?
                            <>
                                <p className="value">{obscureValueString}</p>
                                <p className="max-value mt-3">{obscureValueString}</p>
                            </>:
                            <>
                                <NumberFormat
                                    value={btcOrUsd === "USD"
                                        ? totalBalance?.toFixed(2)
                                        : (totalBalance / BTCPrice).toFixed(9)}
                                    className="value"
                                    displayType='text'
                                    thousandSeparator={true}
                                    renderText={(value, props) => <p {...props}>{value}</p>}
                                />
                                <NumberFormat
                                    value={btcOrUsd === "USD"
                                        ? (totalBalance / BTCPrice).toFixed(9)
                                        : totalBalance?.toFixed(2)}
                                    className="max-value mt-3"
                                    displayType='text'
                                    thousandSeparator={true}
                                    renderText={(value, props) => <p {...props}>~ {value} {btcOrUsd === 'USD'? 'BTC': 'USD'}</p>}
                                />
                            </>
                        }
                    </div>
                    <div className="btn-group d-flex justify-content-between mt-3 align-items-center">
                        <div className="col-sm-6 pe-2">
                            <button
                                // disabled
                                className="btn btn-outline-secondary rounded-0 col-12 text-uppercase fw-bold py-2 h4"
                                onClick={() => {
                                    setTransactionType(TRANSACTION_TYPES.deposit)
                                    setShowDepositAndWidthdrawModal(true)
                                }}
                            >
                                deposit
                            </button>
                        </div>
                        <div className="col-sm-6 ps-2">
                            <button
                                className="btn btn-outline-light rounded-0 col-12 text-uppercase fw-bold py-2 h4"
                                onClick={() => {
                                    setTransactionType(TRANSACTION_TYPES.withdraw)
                                    setShowDepositAndWidthdrawModal(true)
                                }}
                            >
                                withdraw
                            </button>
                        </div>
                        {showDepositAndWidthdrawModal && (
                            <DepositWithdrawModal
                                showModal={showDepositAndWidthdrawModal}
                                setShowModal={setShowDepositAndWidthdrawModal}
                                transactionType={transactionType}
                            />
                        )}
                    </div>
                </div>

                <div>
                    <table className="my-3">
                        <tbody>
                            {_.map((_.orderBy(myAssets, ['balance'], ['desc'])), (item, index) => <Asset item={item} key={index} />)}
                            {Object.values(myAssets).length === 0 && (
                                <p className="text-center fw-500 text-uppercase">no assets found</p>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>            
        )
}
