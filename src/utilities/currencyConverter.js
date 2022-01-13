import React from "react"
import fetch from "unfetch"
import useSWR from "swr"

const API_KEY = "483a7217ada6c56b346c651d8512ea7f"
const API_URL = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json`

const fetcher = async (path) => {
    const res = await fetch(API_URL + path)
    const json = await res.json()
    return json
}

const CurrencyConverter = ({ value, from, to }) => {
    const { data: currencies } = useSWR(fetcher)
    console.log(currencies)

    return (
        <>
            <p>hi</p>
        </>
    )
}

export default CurrencyConverter
