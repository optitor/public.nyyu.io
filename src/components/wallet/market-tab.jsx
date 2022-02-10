import React, { useReducer, useEffect, useState } from "react"
import useDeepCompareEffect from 'use-deep-compare-effect';
import axios from "axios"
import { numberSign, numberWithCommas, numFormatter } from "../../utilities/number"
import icons from "base64-cryptocurrency-icons"
import { Icon } from "@iconify/react"
import ReactECharts from "echarts-for-react"
import { cryptoSymbol } from 'crypto-symbol';
import _ from 'lodash';
import {NickToken} from "./../../utilities/imgImport";

const QUOTE = "USDT"

const KLINE_ENDPOINT = "https://api.binance.com/api/v3/klines"
const TICKER_24hr = "https://api.binance.com/api/v3/ticker/24hr"
const ALLPRICES = "https://api.binance.com/api/v3/ticker/price"

const KLINE_INTERVAL = "1h"
const GREEN = "#23C865"
const RED = "#F6361A"

const { get } = cryptoSymbol({})
const cryptoSymbolList = get().SNPair;
const REFRESH_TIME = 10;


const CryptoRow = ({ data = {}, favours = {}, doAction }) => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        chart: [],
        min: 0,
        percent: "",
        price: "",
        volume: "",
    })
    const { chart, min, price, percent, volume } = state

    useEffect(() => {
        if(!data.symbol) return;
        axios
            .get(KLINE_ENDPOINT, {
                params: {
                    symbol: data.symbol + QUOTE,
                    interval: KLINE_INTERVAL,
                    startTime: new Date().getTime() - 7 * 24 * 3600 * 1000,
                },
            })
            .then((res) => {
                const data = res.data.map((c) => c[1])

                setState({
                    min: Math.min(data),
                    max: Math.max(data),
                    chart: data,
                })
            })
        const getTicker24hr = () => {
            if(!data.symbol) return;
            axios.get(TICKER_24hr, { params: { symbol: data.symbol + QUOTE } }).then((res) => {
                setState({
                    price: numberWithCommas(res.data.lastPrice),
                    percent: res.data.priceChangePercent,
                    volume: numFormatter(res.data.quoteVolume, 2),
                })
            })
        }
        getTicker24hr()
        setInterval(() => {
            getTicker24hr()
        }, 1000 * REFRESH_TIME)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <tr onClick={doAction}>
            <td className="d-flex align-items-start ps-2">
                <div>
                    <Icon
                        icon="bx:bxs-star"
                        className={`star-checkbox ${favours[data.symbol]? "txt-green" : "txt-grey"}`}
                    />
                </div>
                <img src={icons[data.symbol]?.icon?? NickToken} alt="coin" className="me-2" width="30" />
                <div>
                    <p className="coin-abbr">{data.symbol}</p>
                    <p className="coin-name">{data.name}</p>
                </div>
            </td>
            <td className="text-center">
                <p className="coin-price text-center">${price}</p>
                <p
                    className={
                        numberSign(percent) === "+"
                            ? "coin-percent txt-green text-center"
                            : "coin-percent txt-red text-center"
                    }
                >
                    {numberSign(percent) + percent === undefined ? "0" : percent}%
                </p>
            </td>
            <td className="laptop-not price-chart">
                <ReactECharts
                    option={{
                        color: percent >= 0 ? GREEN : RED,
                        backgroundColor: "transparent",
                        xAxis: {
                            type: "category",
                            show: false,
                        },
                        yAxis: {
                            type: "value",
                            show: false,
                            min: min,
                        },
                        series: [
                            {
                                data: chart,
                                type: "line",
                                smooth: true,
                                showSymbol: false,
                            },
                        ],
                        grid: {
                            show: false,
                            top: "10%",
                            bottom: "10%",
                            left: "0",
                            right: "0",
                        },
                    }}
                    style={{ height: "50px", width: "150px", margin: "auto !important" }}
                    className="echarts-for-echarts"
                />
            </td>
            <td className="mobile-not text-center">${!volume ? 0 : volume}</td>
        </tr>
    )
}
const CryptoRowForSearch = ({ data = {}, favours = {}, doAction }) => {
    return (
        <tr onClick={doAction}>
            <td className="d-flex align-items-start ps-2">
                <div>
                    <Icon
                        icon="bx:bxs-star"
                        className={`star-checkbox ${favours[data.symbol]? "txt-green" : "txt-grey"}`}
                    />
                </div>
                <img src={icons[data.symbol]?.icon?? NickToken} alt="coin" className="me-2" width="30" />
                <div>
                    <p className="coin-abbr">{data.symbol}</p>
                    <p className="coin-name">{data.name}</p>
                </div>
            </td>
            <td className="text-center">
                <p className="coin-price text-center"></p>
            </td>
            <td className="laptop-not price-chart">                
            </td>
            <td className="mobile-not text-center"></td>
        </tr>
    )
}

export default function MarketTab() {
    const [searchValue, setSearchValue] = useState("");
    const [cryptoList, setCryptoList] = useState({});
    const [sortOption, setSortOption] = useState({});

    const InitialFavours = {
        BTC: {symbol: 'BTC', name: cryptoSymbolList['BTC']},
        ETH: {symbol: 'ETH', name: cryptoSymbolList['ETH']},
        SOL: {symbol: 'SOL', name: cryptoSymbolList['SOL']},
        DOGE: {symbol: 'DOGE', name: cryptoSymbolList['DOGE']},
        SHIB: {symbol: 'SHIB', name: cryptoSymbolList['SHIB']},
        // DAI: {symbol: 'DAI', name: cryptoSymbolList['DAI']},
        ADA: {symbol: 'ADA', name: cryptoSymbolList['ADA']},
        CAKE: {symbol: 'CAKE', name: cryptoSymbolList['CAKE']},
    };
    const [favours, setFavours] = useState(InitialFavours);

    useEffect(() => {
        axios.get(ALLPRICES).then((res) => {
            const allprices = res.data;
            let cryptos = allprices?.filter(el => el.symbol.match(/USDT$/))
                .map(item => ({symbol: item.symbol?.replace('USDT', '')}));
            cryptos = cryptos.map(item => ({ symbol: item.symbol, name: cryptoSymbolList[item.symbol]?? item.symbol + 'Coin' }))
            setCryptoList(_.mapKeys(cryptos, 'symbol'));
        });
    }, []);

    const [favoursData, setFavoursData] = useState({});

    useDeepCompareEffect(() => {
        (async function() {
            let assets = { ...favours };
            let price = 0, percent = 0, volume = 0;
            // if(!_.isEmpty(favoursData) && _.isEqual(favours, InitialFavours)) return;
            
            for(const favour of Object.values(favours)) {
                const res = await axios.get(TICKER_24hr, { params: { symbol: favour.symbol + QUOTE } });
                price = Number(res.data.lastPrice);
                percent = Number(res.data.priceChangePercent);
                volume = Number(res.data.quoteVolume);
                assets[favour.symbol] = { ...favour, price, percent, volume };
            }
            setFavoursData({ ...assets })
        })()
    }, [favours])
    // console.log(favoursData)
    // console.log(sortOption)

    const set_Favourite_Crypto = item => {
        if(favours[item.symbol]) {
            delete favoursData[item.symbol];
            setFavoursData({ ...favoursData });
            delete favours[item.symbol];
            setFavours({ ...favours });
            
            return;
        }
        setFavours({ ...favours, [item.symbol]: item });
    };

    // console.log(sortOption)
    const set_SortOption = sortName => {
        setSortOption({[sortName]: (sortOption[sortName] === 'desc'? 'asc': 'desc')});
    }
    
    return (
        <table className="wallet-transaction-table">
            <div className="search">
                <Icon className="search-icon text-light"
                    icon={searchValue? "bi:list-stars": "carbon:search"}
                    onClick={() => {setSearchValue(''); }}
                    disabled={!searchValue}
                />
                <input className="black_input"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder="Search"
                />
            </div>
            <thead>
                <tr>
                    <th className="text-center">
                        Name
                        <Icon icon={sortOption['symbol'] === 'desc'? "ant-design:caret-up-filled": "ant-design:caret-down-filled"}
                            className={sortOption['symbol']? 'text-green': ''}
                            onClick={() => set_SortOption('symbol')}
                        />
                    </th>
                    <th className="text-center">
                        Price
                        <Icon icon={sortOption['price'] === 'desc'? "ant-design:caret-up-filled": "ant-design:caret-down-filled"}
                            className={sortOption['price']? 'text-green': ''}
                            onClick={() => set_SortOption('price')}
                        />
                    </th>
                    <th className="laptop-not text-center">Price Chart</th>
                    <th className="mobile-not text-center">
                        Volume (24h)
                        <Icon icon={sortOption['volume'] === 'desc'? "ant-design:caret-up-filled": "ant-design:caret-down-filled"}
                            className={sortOption['volume']? 'text-green': ''}
                            onClick={() => set_SortOption('volume')}
                        />
                    </th>
                </tr>
            </thead>
            <tbody>
                <>
                    {searchValue && _.map( _.filter(cryptoList, item => 
                        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                        item.symbol.toLowerCase().includes(searchValue.toLowerCase())
                    ), item => (
                        <CryptoRowForSearch data={item} key={item.name} favours={favours} doAction={() => set_Favourite_Crypto(item)} />
                    ))}
                    {!searchValue && _.map(_.orderBy(favoursData, [Object.keys(sortOption)[0]], [Object.values(sortOption)[0]]), item => (
                        <CryptoRow data={item} key={item.name} favours={favours} doAction={() => set_Favourite_Crypto(item)} />
                    ))}
                </>
            </tbody>
        </table>
    );
};
