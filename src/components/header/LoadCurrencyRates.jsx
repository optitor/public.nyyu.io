import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { SUPPORTED_CURRENCIES } from "../../utilities/staticData2";
import { setCurrencyRates } from "../../redux/actions/bidAction";

const GET_CURRENCY_PRICES_ENDPOINT = 'https://api.currencyfreaks.com/latest';
// const API_KEY = '49cd7eb3c5f54f638e0e2bb4ce3ba8e2';
const API_KEY = '013a5b710f794e2b8515478f6d5e166b';
// const API_KEY = 'da4017f4889c4ff9bcf5a243eedad995';

const SYMBOLS = SUPPORTED_CURRENCIES.map(item => item.symbol).join(',');

export default function LoadCurrencyRates() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        (async function() {
            const res = await axios.get(GET_CURRENCY_PRICES_ENDPOINT, { params: { apikey: API_KEY, symbols: SYMBOLS } });
            dispatch(setCurrencyRates(res.data.rates));

        })();
    }, [dispatch]);
    
    return (
        <div></div>
    )
};