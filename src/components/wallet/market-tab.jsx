import React, { useState, useRef, useMemo, useEffect, useCallback } from "react"
import axios from "axios"
import { numberSign, numberWithCommas } from "../../utilities/number"
import icons from "base64-cryptocurrency-icons"
import ReactECharts from "echarts-for-react"
import useWebSocket, { ReadyState } from "react-use-websocket"

const QUOTE = "USDT"

const SOCKET_ENDPOINT = "wss://stream.binance.com:9443/stream"

const KLINE_ENDPOINT = "https://api.binance.com/api/v3/klines"

const KLINE_INTERVAL = "15m"

const market_data = [
    // {
    //     abbr: "ETH",
    //     name: "Ethereum",
    //     price: 282004.43,
    //     percent: 1.9,
    //     chart: "",
    //     volume: "$28,6B",
    // },
    {
        abbr: "BTC",
        name: "Bitcoin",
        price: 282004.43,
        percent: -2.2,
        chart: "",
        volume: "$28,6B",
    },
    {
        abbr: "BCH",
        name: "Bitcoin Cash",
        price: 282004.43,
        percent: 1.9,
        chart: "",
        volume: "$28,6B",
    },
    {
        abbr: "DOGE",
        name: "Dogecoin",
        price: 282004.43,
        percent: -1.9,
        chart: "",
        volume: "$28,6B",
    },
    {
        abbr: "USDC",
        name: "USD Coin",
        price: 282004.43,
        percent: 1.9,
        chart: "",
        volume: "$28,6B",
    },
    {
        abbr: "LTC",
        name: "Litecoin",
        price: 282004.43,
        percent: 1.9,
        chart: "",
        volume: "$28,6B",
    },
]
const CryptoRow = ({ data }) => {
    const [chart, setChart] = useState([])

    useEffect(() => {
        axios
            .get(KLINE_ENDPOINT, {
                params: { symbol: data.abbr + QUOTE, interval: KLINE_INTERVAL },
            })
            .then((res) => {
                console.log(
                    "KLINE DATA",
                    res.data.map((c) => c[1])
                )
                setChart(res.data.map((c) => c[1]))
            })
    }, [])

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(SOCKET_ENDPOINT)

    useEffect(() => {
        console.log("msg", lastJsonMessage)
    }, [lastJsonMessage])

    const handleClickSendMessage = useCallback(
        () =>
            sendJsonMessage({
                method: "SUBSCRIBE",
                params: [`${data.abbr.toLowerCase()}usdt@ticker`],
                id: 1,
            }),
        [sendJsonMessage]
    )

    const handleClickUnSendMessage = useCallback(
        () =>
            sendJsonMessage({
                method: "UNSUBSCRIBE",
                params: ["dogeaud@ticker"],
                id: 1,
            }),
        [sendJsonMessage]
    )

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState]

    useEffect(() => {
        if (readyState !== ReadyState.OPEN) return
        handleClickSendMessage()
    }, [readyState])

    return (
        <tr>
            <td className="d-flex align-items-start ps-2">
                <img src={icons[data.abbr]?.icon} alt="coin" className="me-2" width="30" />
                <div>
                    <p className="coin-abbr">{data.abbr}</p>
                    <p className="coin-name">{data.name}</p>
                </div>
            </td>
            <td>
                <p className="coin-price">${numberWithCommas(lastJsonMessage?.data?.c)}</p>
                <p
                    className={
                        numberSign(data.percent) === "+"
                            ? "coin-percent txt-green"
                            : "coin-percent txt-red"
                    }
                >
                    {numberSign(data.percent) + data.percent}%
                </p>
            </td>
            <td className="laptop-not price-chart">
                <ReactECharts
                    option={{
                        xAxis: {
                            type: "category",
                            show: false,
                        },
                        yAxis: {
                            type: "value",
                            show: false,
                            min: Math.min(chart),
                            max: Math.max(chart),
                        },
                        series: [
                            {
                                data: chart,
                                type: "line",
                                smooth: true,
                            },
                        ],
                    }}
                    style={{ height: "50px", width: "100%" }}
                    className="echarts-for-echarts"
                />
            </td>
            <td className="mobile-not text-end">{data.volume}</td>
        </tr>
    )
}

export default function MarketTab() {
    const [price, setPrice] = useState([])
    // axios.get("https://api.binance.com/api/v3/ticker/price").then((res) => {
    //     console.log("result", res.data)
    //     setPrice(res.data)
    // })

    console.log("ICONS", icons)
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="text-end">Price</th>
                    <th className="laptop-not text-center">Price Chart</th>
                    <th className="mobile-not text-end">Volume (24h)</th>
                </tr>
            </thead>
            <tbody>
                {market_data.map((item, idx) => (
                    <CryptoRow data={item} key={idx} />
                ))}
            </tbody>
        </table>
    )
}
