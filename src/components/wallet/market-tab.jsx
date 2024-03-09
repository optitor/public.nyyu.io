/* eslint-disable */
import React, { useReducer, useEffect, useState, useRef } from "react";
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { NumericFormat } from "react-number-format";
import { numberSign, numFormatter } from "../../utilities/number";
import icons from "base64-cryptocurrency-icons";
import { Icon } from "@iconify/react";
import ReactECharts from "echarts-for-react";
import { cryptoSymbol } from 'crypto-symbol';
import _ from 'lodash';
import { NickToken, NDB } from "../../utilities/imgImport";
import Skeleton from '@mui/material/Skeleton';
import CustomSpinner from './../common/custom-spinner';
import { setCookie, getCookie, NDB_FavAssets } from '../../utilities/cookies';
import { update_Favor_Assets } from "../../redux/actions/settingAction";

const QUOTE = "USDT";

const KLINE_ENDPOINT = `${process.env.GATSBY_BINANCE_BASE_API}/v3/klines`;
const TICKER_24hr = `${process.env.GATSBY_BINANCE_BASE_API}/v3/ticker/24hr`;
const ALLPRICES = `${process.env.GATSBY_BINANCE_BASE_API}/v3/ticker/price`;

const KLINE_INTERVAL = "30m"
const GREEN = "#23C865"
const RED = "#F6361A"

const { get } = cryptoSymbol({})
const cryptoSymbolList = get().SNPair;
const REFRESH_TIME = 30;


const fetch_Ticker_From_Binance = async (tokenSymbol) => {
    const res = await axios.get(TICKER_24hr, { params: { symbol: tokenSymbol + QUOTE } });
    const price = Number(res.data.lastPrice);
    const percent = Number(res.data.priceChangePercent);
    const volume = Number(res.data.quoteVolume);
    return { price, percent, volume };
};

const fetch_Ticker_Of_NDB = async () => {
    const res = await axios.get(`${process.env.GATSBY_API_BASE_URL}/ndbcoin/info`);
    const price = Number(res.data.price);
    const percent = Number(res.data.change);
    const volume = Number(res.data.volume);
    return { price, percent, volume };
};

const CryptoRow = ({ data = {}, favours = {}, doAction }) => {
    const currency = useSelector(state => state.favAssets.currency);
    const currencyRates = useSelector(state => state.currencyRates);
    const currencyRate = currencyRates[currency.value]?? 1;

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        chart: [],
        min: 0,
        max: 0,
        percent: "",
        price: "",
        volume: "",
    });
    
    const { chart, min, price, percent, volume } = state;

    useEffect(() => {
        const getChartData = async () => {
            if(!data.symbol) return;
            let chartData;

            if(data.symbol === 'NDB') {
                const res = await axios.get(`${process.env.GATSBY_API_BASE_URL}/ndbcoin/kline`);
                chartData = res.data;
            } else {
                const res = await axios.get(KLINE_ENDPOINT, {
                    params: {
                        symbol: data.symbol + QUOTE,
                        interval: KLINE_INTERVAL,
                        startTime: new Date().getTime() - 24 * 3600 * 1000,
                    },
                });
                chartData = res.data.map((c) => c[4]);
            }

            setState({
                min: Math.min(chartData),
                max: Math.max(chartData),
                chart: chartData,
            });
        };

        const getTicker24hr = async () => {
            if(!data.symbol) return;
            let fetchData;

            if(data.symbol === 'NDB') {
                fetchData = await fetch_Ticker_Of_NDB();
            } else {
                fetchData = await fetch_Ticker_From_Binance(data.symbol);
            }

            const { price, percent, volume } = fetchData;
            setState({
                price,
                percent,
                volume
            });
        };

        getTicker24hr();
        getChartData();

        const interval_crypto = setInterval(() => {
            getTicker24hr();
            getChartData();
        }, 1000 * REFRESH_TIME);

        return () => clearInterval(interval_crypto);
    }, [])

    let tokenImage;
    if(data.symbol === 'NDB') {
        tokenImage = NDB;
    } else {
        tokenImage = icons[data.symbol]?.icon?? NickToken;
    }
    
    return (
        <tr>
            <td className="d-flex align-items-start ps-2">
                <div className="star_selected" onClick={doAction}>
                    <Icon
                        icon="bx:bxs-star"
                        className={`star-checkbox ${favours[data.symbol]? "txt-green" : "txt-grey"}`}
                    />
                </div>
                <div>
                    <img src={tokenImage} alt="coin" className="me-2 full-width" width="30" />
                </div>
                <div style={{width: '100%', paddingRight: 20}}>
                    <p className="coin-abbr">{data.symbol}</p>
                    <p className="coin-name">{data.name}</p>
                </div>
            </td>
            <td className="text-center">
                <p className="coin-price text-center">
                    {price?
                    <NumericFormat
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
                    {percent? `${numberSign(percent)}${Number(percent).toFixed(2)}%`: ''}
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
};

const CryptoRowForSearch = ({ data = {}, favours = {}, doAction }) => {
    let tokenImage;
    if(data.symbol === 'NDB') {
        tokenImage = NDB;
    } else {
        tokenImage = icons[data.symbol]?.icon?? NickToken;
    }
    return (
        <tr>
            <td className="d-flex align-items-start ps-2">
                <div className="star_selected" onClick={doAction}>
                    <Icon
                        icon="bx:bxs-star"
                        className={`star-checkbox ${favours[data.symbol]? "txt-green" : "txt-grey"}`}
                    />
                </div>
                <img src={tokenImage} alt="coin" className="me-2" width="30" />
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
    const { currency, assets } = useSelector(state => state.favAssets);
    const dispatch = useDispatch();

    const [searchValue, setSearchValue] = useState("");
    const [cryptoList, setCryptoList] = useState({});
    const [sortOption, setSortOption] = useState({});

    const [favours, setFavours] = useState({});
    const [favoursData, setFavoursData] = useState({});

    const componentWillUnmount = useRef(false);

    // This is componentWillUnmount
    useEffect(() => {
        return () => {
            componentWillUnmount.current = true
        }
    }, []);

    useEffect(() => {
        return function cleanup() {
            if(componentWillUnmount.current && !_.isEmpty(favoursData)) {
                const updateData = {
                    assets: currency.label + ',' + Object.keys(favoursData).join(',')
                };
                dispatch(update_Favor_Assets(updateData));
            }
        }
    }, [favoursData]);

    useDeepCompareEffect(() => {
        const fav_Cookie = JSON.parse(getCookie(NDB_FavAssets) ?? '{}');
        if(!_.isEmpty(fav_Cookie)) {
            setFavours(fav_Cookie);
        } else {
            const favArray = assets.map(item => ({ symbol: item }));
            const favObj = _.mapKeys(favArray, 'symbol');
            setFavours(favObj);
            setCookie(NDB_FavAssets, JSON.stringify(favObj));
        }
    }, [assets]);

    useEffect(() => {
        axios.get(ALLPRICES).then((res) => {
            const allprices = res.data;
            let cryptos = allprices?.filter(el => el.symbol.match(/USDT$/))
                .map(item => ({symbol: item.symbol?.replace('USDT', '')}));
            // Added NDB to search list
            cryptos = [ { symbol: 'NDB' }, ...cryptos ];

            cryptos = cryptos.map(item => ({ symbol: item.symbol, name: cryptoSymbolList[item.symbol]?? item.symbol + ' Coin' }))
            setCryptoList(_.mapKeys(cryptos, 'symbol'));
        });
    }, []);
    
    useDeepCompareEffect(() => {
        (async function() {
            let assets = { ...favours };
            let tickerData;
            
            for(const favour of Object.values(favours)) {
                if(favour.symbol === 'NDB') {
                    tickerData = await fetch_Ticker_Of_NDB(favour.symbol);
                } else {
                    tickerData = await fetch_Ticker_From_Binance(favour.symbol);
                }
                const { price, percent, volume } = tickerData;
                assets[favour.symbol] = { ...favour, name: cryptoSymbolList[favour.symbol]?? favour.symbol + ' Coin', price, percent, volume };
            }
            setFavoursData({ ...assets })
        })()
    }, [favours]);

    const set_Favourite_Crypto = item => {
        if(favoursData[item.symbol]) {
            delete favoursData[item.symbol];
            setFavoursData({ ...favoursData });
            delete favours[item.symbol];
            setFavours({ ...favours });
            setCookie(NDB_FavAssets, JSON.stringify(favours));

            return;
        }
        const temp = { ...favours, [item.symbol]: item };
        setFavours(temp);
        setCookie(NDB_FavAssets, JSON.stringify(temp));
    };

    // console.log(loading)
    const set_SortOption = sortName => {
        setSortOption({[sortName]: (sortOption[sortName] === 'desc'? 'asc': 'desc')});
    };
    
    return (
        <table className="wallet-transaction-table">
            <div className="search">
                <Icon className="search-icon text-light"
                    icon={searchValue? "bi:list-stars": "carbon:search"}
                    onClick={() => setSearchValue('')}
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
                            className={sortOption['symbol']? 'txt-green': ''}
                            onClick={() => set_SortOption('symbol')}
                        />
                    </th>
                    <th className="text-center">
                        Price ({currency.label})
                        <Icon icon={sortOption['price'] === 'desc'? "ant-design:caret-up-filled": "ant-design:caret-down-filled"}
                            className={sortOption['price']? 'txt-green': ''}
                            onClick={() => set_SortOption('price')}
                        />
                    </th>
                    <th className="laptop-not text-center">
                        Price Chart
                        <Icon icon={sortOption['percent'] === 'desc'? "ant-design:caret-up-filled": "ant-design:caret-down-filled"}
                            className={sortOption['percent']? 'txt-green': ''}
                            onClick={() => set_SortOption('percent')}
                        />
                    </th>
                    <th className="mobile-not text-center">
                        Volume (24h)
                        <Icon icon={sortOption['volume'] === 'desc'? "ant-design:caret-up-filled": "ant-design:caret-down-filled"}
                            className={sortOption['volume']? 'txt-green': ''}
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
                            <CustomSpinner/>
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