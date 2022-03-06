/* eslint-disable */

import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import _ from "lodash";
import svgToDataURL from "svg-to-dataurl";
import axios from "axios";
import DepositWithdrawModal from "./deposit-withdraw-modal";
import DepositModal from "./DepositModal";
import CustomSpinner from "../common/custom-spinner";
import { TRANSACTION_TYPES } from "../../utilities/staticData";
import NumberFormat from "react-number-format";
import { useQuery } from "@apollo/client";
import { GET_BALANCES } from "../../apollo/graghqls/querys/Auth";
import { Icon } from "@iconify/react";

const QUOTE = "USDT";
const TICKER_price = "https://api.binance.com/api/v3/ticker/price";
const REFRESH_TIME = 30;

const Asset = ({ item }) => {
    const currency = useSelector(state => state.placeBid.currency);
    const currencyRates = useSelector(state => state.currencyRates);

    return (
        <tr>
            <td className="d-flex align-items-center ps-2">
                <img src={item.symbol} alt="coin icon" className="me-2" />
                <div>
                    <p className="coin-abbr text-light">{item.tokenName}</p>
                </div>
            </td>
            <td>
                <NumberFormat
                    value={Math.round((item.free + item.hold) * 10**8) / 10**8}
                    className="coin-price fw-bold"
                    displayType={"text"}
                    thousandSeparator={true}
                    renderText={(value, props) => <p {...props}>{value} {item.tokenSymbol}</p>}
                />
                <NumberFormat
                    value={Number(item.balance  * currencyRates[currency.value]).toFixed(2)}
                    className="coin-percent"
                    displayType={"text"}
                    thousandSeparator={true}
                    renderText={(value, props) => <p {...props}>{value} {currency.value}</p>}
                />
            </td>
        </tr>
    )
};

export default function InternalWallet() {
    const currency = useSelector(state => state.placeBid.currency);
    const currencyRates = useSelector(state => state.currencyRates);

    const InitialAssets = {};
    const [myAssets, setMyAssets] = useState(InitialAssets);
    const [BTCPrice, setBTCPrice] = useState(10000);

    const [hideValues, setHideValues] = useState(false);
    const [transactionType, setTransactionType] = useState(TRANSACTION_TYPES.deposit);
    const [showDepositAndWidthdrawModal, setShowDepositAndWidthdrawModal] = useState(false);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const obscureValueString = "******";
    const [isShowBTC, setIsShowBTC] = useState(true);

    const totalBalance = useMemo(() => {
        if (!Object.values(myAssets)) return 0
        return _.sumBy(Object.values(myAssets), "balance") ?? 0
    }, [myAssets]);

    const depositAssets = useMemo(() => {
        const temp = {...myAssets};
        if(temp['NDB']) delete temp['NDB'];
        if(temp['VOLT']) delete temp['VOLT'];
        return { ...temp };
    }, [myAssets]);

    useEffect(() => {
        const get_BTCPrice = () => {
            axios.get(TICKER_price, { params: { symbol: "BTC" + QUOTE } }).then((res) => {
                setBTCPrice(res.data.price)
            })
        }
        get_BTCPrice();
        const interval = setInterval(() => {
            get_BTCPrice()
        }, 1000 * REFRESH_TIME);
        return () => clearInterval(interval);
    }, []);

    const { loading: loadingOfAssets } = useQuery(GET_BALANCES, {
        fetchPolicy: "network-only",
        onCompleted: data => {
            if (data.getBalances) {
                let assets = data.getBalances?.map((item) => {
                    return { ...item, symbol: svgToDataURL(item.symbol) };
                })
                assets = _.mapKeys(assets, "tokenSymbol");
                setMyAssets({ ...myAssets, ...assets });
            }
        },
    });

    useEffect(() => {
        (async function () {
            const get_Balances_Price = async () => {
                let assets = { ...myAssets };
                if (_.isEqual(myAssets, InitialAssets)) return;
                
                for (const item of Object.values(myAssets)) {
                    let price = 0;
                    if (
                        !item.tokenSymbol ||
                        item.tokenSymbol === "NDB" ||
                        item.tokenSymbol === "VOLT"
                    ) {
                        price = 0;
                    } else {
                        const res = await axios.get(TICKER_price, {
                            params: { symbol: item.tokenSymbol + QUOTE },
                        });
                        price = res.data.price;
                    }
                    const balance = (item.hold + item.free) * price;
                    assets[item.tokenSymbol] = { ...item, price, balance: balance, value: item.tokenSymbol };
                }
                setMyAssets({ ...assets });
            }

            get_Balances_Price();
            const interval1 = setInterval(() => {
                get_Balances_Price();
            }, 1000 * REFRESH_TIME);

            return () => clearInterval(interval1);
        })()
    }, [Object.keys(myAssets).length]);

    const loadingSection = !myAssets;

    if (loadingSection)
        return (
            <div className="text-center my-5">
                <CustomSpinner />
            </div>
        );
    else
        return (
            <div>
                <div className="profile-value">
                    <div className="value-box">
                        <div className="value-label d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                Equity Value ({isShowBTC? 'BTC': currency.value})
                                {!hideValues && (
                                    <Icon
                                        className="value-label-eye-icon"
                                        icon="bi:eye-slash"
                                        onClick={() => setHideValues(true)}
                                    />
                                )}
                                {hideValues && (
                                    <Icon
                                        className="value-label-eye-icon"
                                        icon="bi:eye"
                                        onClick={() => setHideValues(false)}
                                    />
                                )}
                            </div>

                            <div className="d-flex gap-2">
                                <div
                                    className={`cursor-pointer ${
                                        isShowBTC === true? "fw-bold text-white": ''
                                    }`}
                                    onClick={() => setIsShowBTC(true)}
                                    onKeyDown={() => setIsShowBTC(true)}
                                    role="presentation"
                                >
                                    BTC
                                </div>
                                <div>|</div>
                                <div
                                    className={`cursor-pointer ${
                                        isShowBTC === false? "fw-bold text-white": ''
                                    }`}
                                    onClick={() => setIsShowBTC(false)}
                                    onKeyDown={() => setIsShowBTC(false)}
                                    role="presentation"
                                >
                                    {currency.value}
                                </div>
                            </div>
                        </div>
                        {hideValues ? (
                            <>
                                <p className="value">{obscureValueString}</p>
                                <p className="max-value mt-3">{obscureValueString}</p>
                            </>
                        ) : (
                            <>
                                <NumberFormat
                                    value={
                                        isShowBTC === false
                                            ? totalBalance === 0
                                                ? 0
                                                : Number(totalBalance * currencyRates[currency.value]).toFixed(2)
                                            : totalBalance === 0
                                            ? 0
                                            : (totalBalance / BTCPrice).toFixed(9)
                                    }
                                    className="value"
                                    displayType="text"
                                    thousandSeparator={true}
                                    renderText={(value, props) => (
                                        <p {...props}>
                                            {value} {isShowBTC === false ? currency.value : "BTC"}
                                        </p>
                                    )}
                                />
                                <NumberFormat
                                    value={
                                        isShowBTC === false
                                            ? totalBalance === 0
                                                ? 0
                                                : (totalBalance / BTCPrice).toFixed(9)
                                            : totalBalance === 0
                                            ? 0
                                            : Number(totalBalance * currencyRates[currency.value]).toFixed(2)
                                    }
                                    className="max-value mt-3"
                                    displayType="text"
                                    thousandSeparator={true}
                                    renderText={(value, props) => (
                                        <p {...props}>
                                            ~ {value} {isShowBTC === false ? "BTC" : currency.value}
                                        </p>
                                    )}
                                />
                            </>
                        )}
                    </div>
                    <div className="btn-group d-flex justify-content-between mt-3 align-items-center">
                        <div className="col-6 pe-2">
                            <button
                                className={`btn btn-outline-light rounded-0 col-12 text-uppercase fw-bold py-2 h4 ${loadingOfAssets? 'disabled': ''}`}
                                onClick={() => {
                                    setIsDepositOpen(true)
                                }}
                                disabled={loadingOfAssets}
                            >
                                deposit
                            </button>
                        </div>
                        <div className="col-6 ps-2">
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
                        {isDepositOpen && (
                            <DepositModal
                                showModal={isDepositOpen}
                                setShowModal={setIsDepositOpen}
                                myAssets={Object.values(depositAssets)}
                            />
                        )}
                    </div>
                </div>

                <div>
                    <table className="my-3">
                        <tbody>
                            {loadingOfAssets && (
                                <div className="text-center">
                                    <CustomSpinner />
                                </div>
                            )}
                            {!loadingOfAssets && _.map(_.orderBy(myAssets, ["balance"], ["desc"]), (item) => (
                                <Asset item={item} key={item.tokenName} />
                            ))}
                            {!loadingOfAssets && Object.values(myAssets).length === 0 && (
                                <div className="text-center fw-500 text-uppercase text-light">
                                    No assets found
                                </div>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
};
