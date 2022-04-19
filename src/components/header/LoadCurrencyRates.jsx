import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { CURRENCIES } from "../../utilities/staticData2";
import { setCurrencyRates } from "../../redux/actions/bidAction";

const GET_CURRENCY_PRICES_ENDPOINT = 'https://api.exchangerate.host/latest';
// const GET_CURRENCY_PRICES_ENDPOINT = 'https://api.currencyfreaks.com/latest';
// const API_KEY = '013a5b710f794e2b8515478f6d5e166b';

const SYMBOLS = CURRENCIES;

export default function LoadCurrencyRates() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        (async function() {
            try {
                const res = await axios.get(GET_CURRENCY_PRICES_ENDPOINT, { params: { base: 'USD', symbols: SYMBOLS } });
                // const res = await axios.get(GET_CURRENCY_PRICES_ENDPOINT, { params: { apikey: API_KEY, symbols: SYMBOLS } });
                dispatch(setCurrencyRates(res.data.rates));
            } catch(err) {
                console.log(err);
            }
        })();
    }, [dispatch]);
    
    return (
        <div></div>
    )
};