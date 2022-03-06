import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import Select, { components } from 'react-select';
import { useDispatch } from "react-redux";
import axios from 'axios';
import getSymbolFromCurrency from 'currency-symbol-map';
import { ROUTES } from "../../utilities/routes";
import { setCurrencyInfo, setCurrencyRates } from "../../redux/actions/bidAction";

const GET_CURRENCY_PRICES_ENDPOINT = 'https://api.currencyfreaks.com/latest';
const API_KEY = '49cd7eb3c5f54f638e0e2bb4ce3ba8e2';
const SYMBOLS = 'USD,EUR,GBP,CNY,JPY,CAD,AUD,AED,CHF,RUB,ARS,CLP,CZK,DKK,EGP,HKD,HRK,HUF,INR,MXN,NGN,NZD,RON,SEK,SGD,TRY,UAH,UYU,VND,BHD,SAR,BRL';
const Currencies = SYMBOLS.split(',').map(item => ({label: item, value: item, symbol: getSymbolFromCurrency(item)}));

export default function CurrencyChoice({ classNames }) {
    const dispatch = useDispatch()
    const [selectedCurrency, setSelectedCurrency] = useState(Currencies[0])
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        (async function() {
            setLoading(true);
            const res = await axios.get(GET_CURRENCY_PRICES_ENDPOINT, { params: { apikey: API_KEY, symbols: SYMBOLS } });
            dispatch(setCurrencyRates(res.data.rates));
            setLoading(false);
        })();
    }, [dispatch]);

    const isShowCurrencyChoice = (window.location.pathname === ROUTES.auction ||
        window.location.pathname === ROUTES.wallet ||
        window.location.pathname === ROUTES.profile ||
        window.location.pathname === ROUTES.presale_auction);
    
    const DropdownIndicator = props => {
        return (
          <components.DropdownIndicator {...props}>
            <Icon icon='ant-design:caret-down-filled' />
          </components.DropdownIndicator>
        );
    };
    
    return (
        <div className={`${classNames} mx-1`}>
            {typeof window !== `undefined` && isShowCurrencyChoice && (
                    <div>
                        <Select
                            className={loading? 'disabled': ''}
                            options={Currencies}
                            value={selectedCurrency}
                            onChange={selected => {
                                setSelectedCurrency(selected);
                                dispatch(setCurrencyInfo(selected));
                            }}
                            styles={customSelectStyles}
                            components={{
                                IndicatorSeparator: null,
                                DropdownIndicator
                            }}
                            isDisabled={loading}
                        />
                    </div>
                )}
        </div>
    )
}

const customSelectStyles = {
    container: provided => ({
        ...provided,
        border: '1px solid white',
        width: 95,
    }),
    option: (provided, state) => ({
        ...provided,
        color: "white",
        backgroundColor: state.isSelected? '#000000': undefined,
        fontSize: 14,
        borderBottom: '1px solid dimgrey',
        cursor: 'pointer'
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: 'none',
        borderRadius: 0,
        height: 47,
        cursor: 'pointer'
    }),
    input: provided => ({
        ...provided,
        color: 'lightgrey'
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "1px solid white",
        borderRadius: 0,
        opacity: 1,
    }),
    menuList: provided => ({
        ...provided,
        margin: 0,
        padding: 0
    }),
    valueContainer: provided => ({
        ...provided,
        padding: 0
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white",
        marginLeft: 10,
        fontWeight: 600
    }),
    placeholder: provided => ({
        ...provided,
        color: 'dimgrey'
    })
};