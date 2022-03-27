/* eslint-disable */
import React, { useReducer, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import useDeepCompareEffect from 'use-deep-compare-effect';
import axios from "axios";
import Cookies from 'js-cookie';
import NumberFormat from "react-number-format";
import { numberSign, numFormatter } from "../../utilities/number";
import icons from "base64-cryptocurrency-icons";
import { Icon } from "@iconify/react";
import ReactECharts from "echarts-for-react";
import { cryptoSymbol } from 'crypto-symbol';
import _ from 'lodash';
import {NickToken} from "../../utilities/imgImport";
import Skeleton from '@mui/material/Skeleton';
import CustomSpinner from './../common/custom-spinner';

const QUOTE = "USDT";

const KLINE_ENDPOINT = "https://api.binance.com/api/v3/klines";
const TICKER_24hr = "https://api.binance.com/api/v3/ticker/24hr";
const ALLPRICES = "https://api.binance.com/api/v3/ticker/price";

const KLINE_INTERVAL = "1h"
const GREEN = "#23C865"
const RED = "#F6361A"

const { get } = cryptoSymbol({})
const cryptoSymbolList = get().SNPair;
const REFRESH_TIME = 30;


const CryptoRow = ({ data = {}, favours = {}, doAction }) => {
    const currency = useSelector(state => state.placeBid.currency);
    const currencyRates = useSelector(state => state.currencyRates);
    const currencyRate = currencyRates[currency.value]?? 1;

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        chart: [],
        min: 0,
        percent: "",
        price: "",
        volume: "",
    });
    const { chart, min, price, percent, volume } = state;

    useEffect(() => {
        (async function() {
            if(!data.symbol) return;
            const res = await axios.get(KLINE_ENDPOINT, {
                    params: {
                        symbol: data.symbol + QUOTE,
                        interval: KLINE_INTERVAL,
                        startTime: new Date().getTime() - 7 * 24 * 3600 * 1000,
                    },
                });
            const chartData = res.data.map((c) => c[1]);

            setState({
                min: Math.min(chartData),
                max: Math.max(chartData),
                chart: chartData,
            })
            const getTicker24hr = async () => {
                if(!data.symbol) return;
                const res = await axios.get(TICKER_24hr, { params: { symbol: data.symbol + QUOTE } });
                setState({
                    price: res.data.lastPrice,
                    percent: res.data.priceChangePercent,
                    volume: res.data.quoteVolume,
                })
            };

            getTicker24hr();
            const interval1 = setInterval(async () => {
                await getTicker24hr()
            }, 1000 * REFRESH_TIME);
            return () => clearInterval(interval1);
        })();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    return (
        <tr>
            <td className="d-flex align-items-start ps-2">
                <div className="star_selected" onClick={doAction}>
                    <Icon
                        icon="bx:bxs-star"
                        className={`star-checkbox ${favours[data.symbol]? "txt-green" : "txt-grey"}`}
                    />
                </div>
                <img src={icons[data.symbol]?.icon?? NickToken} alt="coin" className="me-2" width="30" />
                <div style={{width: '100%', paddingRight: 20}}>
                    <p className="coin-abbr">{data.symbol}</p>
                    <p className="coin-name">{data.name}</p>
                </div>
            </td>
            <td className="text-center">
                <p className="coin-price text-center">
                    {price?
                    <NumberFormat
                        value={Math.round(price * Number(currencyRate).toFixed(2) * 10**8) / 10**8}
                        thousandSeparator={true}
                        displayType='text'
                        prefix={currency.sign + ' '}
                        allowNegative={false}
                        renderText={(value, props) => <span {...props}>{value}</span>}
                    />:
                    ''}
                </p>
                <p
                    className={
                        numberSign(percent) === "+"
                            ? "coin-percent txt-green text-center"
                            : "coin-percent txt-red text-center"
                    }
                >
                    {percent? `${numberSign(percent)}${percent}%`: ''}
                </p>
            </td>
            <td className="laptop-not price-chart">
                {
                    _.isEmpty(chart)?
                    <Skeleton variant="text" animation="wave" sx={{ bgcolor: '#d3d3d353' }}/>:
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
                }
            </td>
            <td className="mobile-not text-center">
                {!volume ? '' : currency.sign + ' '+ numFormatter(volume * Number(currencyRate), 2)}
            </td>
        </tr>
    )
}

const CryptoRowForSearch = ({ data = {}, favours = {}, doAction }) => {
    return (
        <tr>
            <td className="d-flex align-items-start ps-2">
                <div className="star_selected" onClick={doAction}>
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
            <td className="mobile-not text-center"/>
        </tr>
    )
}

export default function MarketTab() {
    const currency = useSelector(state => state.placeBid.currency);

    const [searchValue, setSearchValue] = useState("");
    const [cryptoList, setCryptoList] = useState({});
    const [sortOption, setSortOption] = useState({});

    const [favours, setFavours] = useState({});


    const InitialFavours = {
        BTC: {symbol: 'BTC'},
        ETH: {symbol: 'ETH'},
        SOL: {symbol: 'SOL'},
        DOGE: {symbol: 'DOGE'},
        SHIB: {symbol: 'SHIB'},
        LTC: {symbol: 'LTC'},
        ADA: {symbol: 'ADA'},
        CAKE: {symbol: 'CAKE'},
    };

    useEffect(() => {
        if(Cookies.get('NDB_FavCoins')) {
            setFavours(JSON.parse(Cookies.get('NDB_FavCoins')));
        } else {
            setFavours(InitialFavours);
            Cookies.set('NDB_FavCoins', JSON.stringify(InitialFavours));
        }
    }, []);

    useEffect(() => {
        axios.get(ALLPRICES).then((res) => {
            const allprices = res.data;
            let cryptos = allprices?.filter(el => el.symbol.match(/USDT$/))
                .map(item => ({symbol: item.symbol?.replace('USDT', '')}));
            cryptos = cryptos.map(item => ({ symbol: item.symbol, name: cryptoSymbolList[item.symbol]?? item.symbol + 'Coin' }))
            setCryptoList(_.mapKeys(cryptos, 'symbol'));
        });
    }, []);

    const [favoursData, setFavoursData] = useState(InitialFavours);

    useDeepCompareEffect(() => {
        (async function() {
            let assets = { ...favours };
            let price = 0, percent = 0, volume = 0;
            
            for(const favour of Object.values(favours)) {
                const res = await axios.get(TICKER_24hr, { params: { symbol: favour.symbol + QUOTE } });
                price = Number(res.data.lastPrice);
                percent = Number(res.data.priceChangePercent);
                volume = Number(res.data.quoteVolume);
                assets[favour.symbol] = { ...favour, name: cryptoSymbolList[favour.symbol]?? favour.symbol + 'Coin', price, percent, volume };
            }
            setFavoursData({ ...assets })
        })()
    }, [favours, favoursData]);

    const set_Favourite_Crypto = item => {
        if(favours[item.symbol]) {
            delete favoursData[item.symbol];
            setFavoursData({ ...favoursData });
            delete favours[item.symbol];
            setFavours({ ...favours });
            Cookies.set('NDB_FavCoins', JSON.stringify(favours));
            
            return;
        }
        const temp = { ...favours, [item.symbol]: item };
        setFavours(temp);
        Cookies.set('NDB_FavCoins', JSON.stringify(temp));
    };

    // console.log(loading)
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
                        Price ({currency.label})
                        <Icon icon={sortOption['price'] === 'desc'? "ant-design:caret-up-filled": "ant-design:caret-down-filled"}
                            className={sortOption['price']? 'text-green': ''}
                            onClick={() => set_SortOption('price')}
                        />
                    </th>
                    <th className="laptop-not text-center">
                        Price Chart
                        <Icon icon={sortOption['percent'] === 'desc'? "ant-design:caret-up-filled": "ant-design:caret-down-filled"}
                            className={sortOption['percent']? 'text-green': ''}
                            onClick={() => set_SortOption('percent')}
                        />
                    </th>
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
                {searchValue?
                    _.map( _.filter(cryptoList, item => 
                        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                        item.symbol.toLowerCase().includes(searchValue.toLowerCase())
                    ), item => (
                        <CryptoRowForSearch data={item} key={item.name} favours={favours} doAction={() => set_Favourite_Crypto(item)} />
                    )) :
                    _.isEmpty(favoursData)?
                        (
                            <div className='d-flex justify-content-center align-items-center mt-4'>
                                <CustomSpinner />
                            </div>
                        ) :
                        _.map(_.orderBy(favoursData, [Object.keys(sortOption)[0]], [Object.values(sortOption)[0]]), item => (
                            <CryptoRow data={item} key={item.name} favours={favours} doAction={() => set_Favourite_Crypto(item)} />
                        ))
                }
            </tbody>
        </table>
    );
};
