import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { CURRENCIES } from "../../utilities/staticData2";
import { setCurrencyRates } from "../../redux/actions/bidAction";

const GET_CURRENCY_PRICES_ENDPOINT = 'https://api.exchangerate.host/latest';

export default function LoadCurrencyRates() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        (async function() {
            try {
                const res = await axios.get(GET_CURRENCY_PRICES_ENDPOINT, 
                    {
                        params: {base: 'USD', symbols: CURRENCIES, timestamp: Date.now()},
                    },
                );
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