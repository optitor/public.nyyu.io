import React, { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import Select, { components } from 'react-select';
import { useDispatch } from "react-redux";
import { isBrowser } from "../../utilities/auth";
import axios from 'axios';
import { ROUTES } from "../../utilities/routes";
import { SUPPORTED_CURRENCIES } from './../../utilities/staticData2';
import { setCurrencyInfo, setCurrencyRates } from "../../redux/actions/bidAction";
import { EuropeanFlag } from './../../utilities/imgImport';

const GET_CURRENCY_PRICES_ENDPOINT = 'https://api.currencyfreaks.com/latest';
const API_KEY = '49cd7eb3c5f54f638e0e2bb4ce3ba8e2';
const Currencies = SUPPORTED_CURRENCIES.map(item => ({label: item.symbol, value: item.symbol, sign: item.sign}));
const SYMBOLS = SUPPORTED_CURRENCIES.map(item => item.symbol).join(',');

const CurrencyIconEndpoint = 'https://currencyfreaks.com/photos/flags';

const { Option } = components;

const SelectOption = (props) => {
    const { data } = props;
    return (
        <Option {...props}>
            <div className="d-flex justify-content-center justify-content-sm-start align-items-center ">
                <div className='flag_div'>
                    <img
                        src={data.value !=='EUR'? `${CurrencyIconEndpoint}/${String(data.value).toLowerCase()}.png`: EuropeanFlag}
                        alt={data.value}
                    />
                </div>
                <p className="coin-label ms-2">{data.value}</p>
            </div>
        </Option>
    );
};

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

    const isShowCurrencyChoice = isBrowser && (window.location.pathname === ROUTES.auction ||
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
            {isShowCurrencyChoice && (
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
                                DropdownIndicator,
                                Option: SelectOption,
                                SingleValue: SelectOption,
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
        width: 120,
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected? '#000000': undefined,
        fontSize: 14,
        borderBottom: '1px solid dimgrey',
        cursor: 'pointer',
        ":hover": {
            backgroundColor: "inherit",
        },
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: 'none',
        borderRadius: 0,
        height: 47,
        color: 'lightgrey',
        cursor: 'pointer'
    }),
    input: provided => ({
        ...provided,
        position: 'absolute'
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