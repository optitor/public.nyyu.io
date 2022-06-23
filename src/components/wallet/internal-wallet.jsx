import React, { useEffect, useState, useMemo, useRef } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import { useSelector } from 'react-redux';
import _ from "lodash";
import svgToDataURL from "svg-to-dataurl";
import axios from "axios";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import CustomSpinner from "../common/custom-spinner";
import NumberFormat from "react-number-format";
import { useQuery } from "@apollo/client";
import { GET_BALANCES } from "../../apollo/graphqls/querys/Auth";
import { Icon } from "@iconify/react";
import { roundNumber } from "../../utilities/number"; 

const QUOTE = "USDT";
const TICKER_price = "https://api.binance.com/api/v3/ticker/price";
const REFRESH_TIME = 30 * 1000;
const obscureValueString = "******";

const Asset = ({ item, isHideAsset }) => {
    const currency = useSelector(state => state.favAssets.currency);
    const currencyRates = useSelector(state => state.currencyRates);
    const currencyRate = currencyRates[currency.value]?? 1;
    const precision = 8;

    return (
        <tr>
            <td className="d-flex align-items-center ps-2">
                <img className=" me-2 balance_img" src={item.symbol} alt="coin icon" />
                <div>
                    <p className="coin-abbr text-light">{item.tokenName}</p>
                </div>
            </td>
            <td>
                <NumberFormat
                    value={roundNumber(item.free + item.hold, precision)}
                    className="coin-price fw-bold"
                    displayType={"text"}
                    thousandSeparator={true}
                    renderText={(value, props) => <p {...props}>{isHideAsset? obscureValueString: value + ' ' + item.tokenSymbol}</p>}
                />
                <NumberFormat
                    value={Number(item.balance  * currencyRate).toFixed(2)}
                    className="coin-percent"
                    displayType={"text"}
                    thousandSeparator={true}
                    renderText={(value, props) => <p {...props}>{isHideAsset? obscureValueString: value + ' ' + currency.value}</p>}
                />
            </td>
        </tr>
    )
};

export default function InternalWallet() {
    const currency = useSelector(state => state.favAssets.currency);
    const currencyRates = useSelector(state => state.currencyRates);
    const currencyRate = currencyRates[currency.value]?? 1;

    const InitialAssets = {};
    const [myAssets, setMyAssets] = useState(InitialAssets);
    const [myAssetsWithBalance, setMyAssetsWithBalance] = useState({});
    const [BTCPrice, setBTCPrice] = useState(10000);

    const initLoaded = useRef(false);

    const [hideValues, setHideValues] = useState(false);
    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [isShowBTC, setIsShowBTC] = useState(true);

    const totalBalance = useMemo(() => {
        if (!Object.values(myAssetsWithBalance)) return 0
        return _.sumBy(Object.values(myAssetsWithBalance), "balance") ?? 0
    }, [myAssetsWithBalance]);

    useEffect(() => {
        const get_BTCPrice = () => {
            axios.get(TICKER_price, { params: { symbol: "BTC" + QUOTE } }).then((res) => {
                setBTCPrice(res.data.price);
            })
        };
        get_BTCPrice();
        const interval = setInterval(() => {
            get_BTCPrice()
        }, REFRESH_TIME);
        return () => clearInterval(interval);
    }, []);

    const { startPolling, stopPolling } = useQuery(GET_BALANCES, {
        onCompleted: data => {
            if (data.getBalances) {
                let assets = data.getBalances?.map((item) => {
                    return { ...item, symbol: svgToDataURL(item.symbol) };
                })
                assets = _.mapKeys(assets, "tokenSymbol");
                setMyAssets({ ...myAssets, ...assets });
            }
        },
        onError: (error) => console.log(error),
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
        pollInterval: REFRESH_TIME,
        notifyOnNetworkStatusChange: true
    });

    useEffect(() => {
        startPolling(REFRESH_TIME);
        return () => stopPolling();
    }, [startPolling, stopPolling]);

    useDeepCompareEffect(() => {
        const get_Balances_Price = async () => {
            let assets = { ...myAssets };
            if (_.isEqual(myAssets, InitialAssets)) return;
            
            for (const item of Object.values(myAssets)) {
                let price = 0;
                if (
                    !item.tokenSymbol ||
                    item.tokenSymbol === "NDB" ||
                    item.tokenSymbol === "WATT"
                ) {
                    price = 0;
                } else if(item.tokenSymbol === 'USDT') {
                    price = 1;
                } else {
                    const res = await axios.get(TICKER_price, {
                        params: { symbol: item.tokenSymbol + QUOTE },
                    });
                    price = Number(res.data.price);
                }
                const balance = (item.hold + item.free) * price;
                assets[item.tokenSymbol] = { ...item, price, balance: balance, value: item.tokenSymbol };
            }

            initLoaded.current = true;
            setMyAssetsWithBalance({ ...assets });
        };

        get_Balances_Price();
        const interval1 = setInterval(() => {
            get_Balances_Price();
        }, REFRESH_TIME);

        return () => clearInterval(interval1);
    }, [Object.keys(myAssets).length, InitialAssets, myAssets]);

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
                                            : Number(totalBalance * currencyRate).toFixed(2)
                                        : totalBalance === 0
                                        ? 0
                                        : (totalBalance / BTCPrice).toFixed(8)
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
                                            : (totalBalance / BTCPrice).toFixed(8)
                                        : totalBalance === 0
                                        ? 0
                                        : Number(totalBalance * currencyRate).toFixed(2)
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
                            className='btn btn-outline-light rounded-0 col-12 text-uppercase fw-bold py-2 h4'
                            onClick={() => {
                                setIsDepositOpen(true)
                            }}
                        >
                            deposit
                        </button>
                    </div>
                    <div className="col-6 ps-2">
                        <button
                            // disabled={true} // waiting for admin panel
                            className="btn btn-outline-light rounded-0 col-12 text-uppercase fw-bold py-2 h4"
                            onClick={() => {
                                setIsWithdrawOpen(true)
                            }}
                            disabled={!initLoaded.current}
                        >
                            withdraw
                        </button>
                    </div>
                    {isWithdrawOpen && (
                        <WithdrawModal
                            showModal={isWithdrawOpen}
                            setShowModal={setIsWithdrawOpen}
                            assets = {myAssetsWithBalance}
                        />
                    )}
                    {isDepositOpen && (
                        <DepositModal
                            showModal={isDepositOpen}
                            setShowModal={setIsDepositOpen}
                        />
                    )}
                </div>
            </div>

            <div className="wallet_balances">
                <table className="my-3">
                    <tbody>
                        {!initLoaded.current && (
                            <div className="text-center">
                                <CustomSpinner />
                            </div>
                        )}
                        {initLoaded.current && _.map(_.orderBy(myAssetsWithBalance, ["balance", "tokenSymbol"], ["desc", "asc"]), (item) => (
                            <Asset item={item} isHideAsset={hideValues} key={item.tokenName} />
                        ))}
                        {initLoaded.current && Object.values(myAssetsWithBalance).length === 0 && (
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
