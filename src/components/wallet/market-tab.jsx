import React, { useReducer, useEffect, useState } from "react"
import axios from "axios"
import Select, {components} from 'react-select'
import { numberSign, numberWithCommas, numFormatter } from "../../utilities/number"
import icons from "base64-cryptocurrency-icons"
import { Icon } from "@iconify/react"
import ReactECharts from "echarts-for-react"
import { cryptoSymbol } from 'crypto-symbol';
import {NickToken} from "./../../utilities/imgImport";

const QUOTE = "USDT"

const KLINE_ENDPOINT = "https://api.binance.com/api/v3/klines"
const TICKER_24hr = "https://api.binance.com/api/v3/ticker/24hr"
const ALLPRICES = "https://api.binance.com/api/v3/ticker/price"

const KLINE_INTERVAL = "1h"

const GREEN = "#23C865"

const RED = "#F6361A"

const cryptoList = [
    {value: 'ETH', label: 'Ethereum'},
    {value: 'BTC', label: 'Bitcoin'},
    {value: 'BCH', label: 'Bitcoin Cash'},
    {value: 'ETH', label: 'Ethereum'},
    {value: 'BTC', label: 'Bitcoin'},
    {value: 'BCH', label: 'Bitcoin Cash'},
    {value: 'ETH', label: 'Ethereum'},
    {value: 'BTC', label: 'Bitcoin'},
    {value: 'BCH', label: 'Bitcoin Cash'},
    {value: 'ETH', label: 'Ethereum'},
    {value: 'BTC', label: 'Bitcoin'},
    {value: 'BCH', label: 'Bitcoin Cash'},
    {value: 'ETH', label: 'Ethereum'},
    {value: 'BTC', label: 'Bitcoin'},
    {value: 'BCH', label: 'Bitcoin Cash'},
];

const market_data = [
    {
        abbr: "ETH",
        name: "Ethereum",
        active: false,
    },
    {
        abbr: "BTC",
        name: "Bitcoin",
        active: true,
    },
    {
        abbr: "BCH",
        name: "Bitcoin Cash",
        active: false,
    },
    {
        abbr: "DOGE",
        name: "Dogecoin",
        active: true,
    },
    {
        abbr: "TRX",
        name: "TronCoin",
        active: true,
    },
    {
        abbr: "USDC",
        name: "USD Coin",
        active: false,
    },
    {
        abbr: "LTC",
        name: "Litecoin",
        active: false,
    },
]

const { get } = cryptoSymbol({})
const cryptoSymbolList = get().SNPair;

const { Option, SingleValue } = components;

const SelectOption = (props) => (
    <Option {...props}>
        <div className="d-flex justify-content-center justify-content-sm-start align-items-center ">
            <img
                src={icons[props.value]?.icon?? NickToken}
                style={{ width: "30px", height: "auto" }}
                alt={props.label}
            />
            <p className="coin-label ms-2">{props.label} ({props.value})</p>
        </div>
    </Option>
);

const CryptoRow = ({ data }) => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        chart: [],
        min: 0,
        percent: "",
        price: "",
        volume: "",
    })
    const { chart, min, price, percent, volume } = state

    useEffect(() => {
        axios
            .get(KLINE_ENDPOINT, {
                params: {
                    symbol: data.abbr + QUOTE,
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
            axios.get(TICKER_24hr, { params: { symbol: data.abbr + QUOTE } }).then((res) => {
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
        }, 1000 * 60 * 30)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <tr>
            <td className="d-flex align-items-start ps-2">
                <div>
                    <Icon
                        icon="bx:bxs-star"
                        className={`star-checkbox ${data.active ? "txt-green" : "txt-grey"}`}
                    />
                </div>
                <img src={icons[data.abbr]?.icon} alt="coin" className="me-2" width="30" />
                <div>
                    <p className="coin-abbr">{data.abbr}</p>
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

export default function MarketTab() {
    const [searchValue, setSearchValue] = useState("")
    const [cryptoList, setCryptoList] = useState([]);

    useEffect(() => {
        axios.get(ALLPRICES).then((res) => {
            const allprices = res.data;
            let cryptos = allprices?.filter(el => el.symbol.includes('USDT'))
                .map(item => ({symbol: item.symbol?.replace('USDT', '')}));
            cryptos = cryptos.map(item => ({ value: item.symbol, label: cryptoSymbolList[item.symbol]?? item.symbol + 'Coin' }))
            setCryptoList(cryptos);
        })
    }, []);
    
    return (
        <table className="wallet-transaction-table">
            <thead>
                <tr>
                    <th className="text-center">Name</th>
                    <th className="text-center">Price</th>
                    <th className="laptop-not text-center">Price Chart</th>
                    <th className="mobile-not text-center">Volume (24h)</th>
                </tr>
            </thead>
            <div className="search">
                <Icon className="search-icon text-light" icon="carbon:search" />
                <Select
                    className="black_input"
                    value=''
                    // onChange={(selected) => {
                    //     setAvatarInfo({...avatarInfo, tier: selected});
                    // }}
                    options={cryptoList}
                    styles={customSelectStyles}
                    placeholder="Search"
                    components={{
                        Option: SelectOption,
                        SingleValue: SelectOption,
                    }}
                />
            </div>
            <tbody>
                {market_data
                    .filter(
                        (item) =>
                            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                            item.abbr.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((item, idx) => (
                        <CryptoRow data={item} key={idx} />
                    ))}
            </tbody>
        </table>
    )
}

const customSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: 'white',
      backgroundColor: state.isSelected ? '#23c865' : '#1e1e1e'
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: '#1e1e1e',
      borderRadius: 0,
      fontSize: 14,
      border: 'none'
    }),
    IndicatorSeparator: provided => ({
        ...provided,
        display: 'none'
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#1e1e1e',
        border: '1px solid white',
    }),
    singleValue: provided => ({
        ...provided,
        color: 'white',
    }),
    input: provided => ({
        ...provided,
        color: 'white'
    }),
    placeholder: provided => ({
        ...provided,
        fontWeight: 400
    })
};