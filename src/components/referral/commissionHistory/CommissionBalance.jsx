import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AiFillEyeInvisible } from '@react-icons/all-files/ai/AiFillEyeInvisible';
import { AiFillEye } from '@react-icons/all-files/ai/AiFillEye';

import { SPINNER } from '../../../utilities/imgImport';
import { useReferral } from '../ReferralContext';
import { changeEquity, updateHiddenStatus } from '../../../redux/actions/tempAction';
import { NumericFormat } from 'react-number-format';

const QUOTE = "USDT";
const TICKER_price = `${process.env.GATSBY_BINANCE_BASE_API}/v3/ticker/price`;
const REFRESH_TIME = 30 * 1000;

const CommissionBalance = ({loading, totalEarned}) => {
    const dispatch = useDispatch();

    const currency = useSelector(state => state.favAssets?.currency.value);
    const currencyRate = useSelector(state => state.currencyRates);
    const { equity, hidden, ndbPrice } = useSelector(state => state.balance);
    
    const {
        btcPrice, setBtcPrice
    } = useReferral();
    
    const [price, setPrice] = useState(equity !== 'BTC' ? 1 / currencyRate[equity] : btcPrice);
    const [decimals, setDecimals] = useState(equity !== 'BTC' ? 2 : 8);

    const onChangeEquity = (newEquity) => {
        if(equity === newEquity) return;
        // change equity
        dispatch(changeEquity(newEquity));
        
        // change equity balance
        setDecimals(newEquity === 'BTC' ? 8 : 2);
        setPrice(newEquity === 'BTC' ? btcPrice : 1 / currencyRate[newEquity]);
    }

    useEffect(() => {
        const getBtcPrice = async () => {
            const { data } = await axios.get(TICKER_price, { params: { symbol: "BTC" + QUOTE } });
            setBtcPrice(data.price);
            if(equity === 'BTC') {
                setPrice(data.price);
            }
        };
        getBtcPrice();
        const interval = setInterval(() => {
            getBtcPrice()
        }, REFRESH_TIME);
        return () => clearInterval(interval);
    }, []);

    return <div className='text-white bg-gray-50 px-3 py-3'>
        <div className='d-flex justify-content-between fs-17px'>
            <div className='txt-disable-gray'>Total Earned&nbsp;&nbsp;
                {!hidden ? 
                    <AiFillEye className='cursor-pointer' size='1.5em' onClick={() => dispatch(updateHiddenStatus(true))}/> : 
                    <AiFillEyeInvisible className='cursor-pointer' size='1.5em' onClick={() => dispatch(updateHiddenStatus(false))}/> 
                }
            </div>
            <div className='ms-auto'>
                <span 
                    className={`me-1 cursor-pointer ${equity === 'BTC' ? 'text-white fw-bold':'txt-disable-gray'}`} 
                    onClick={() => onChangeEquity('BTC')} onKeyDown={() => onChangeEquity('BTC')}>BTC</span>
                <span className='txt-disable-gray'>|</span>
                <span className={`ms-1 cursor-pointer ${equity === currency ? 'text-white fw-bold':'txt-disable-gray'}`} onClick={() => onChangeEquity(currency)} onKeyDown={() => onChangeEquity(currency)}>{currency}</span>
            </div>
        </div>
        <div className='lh-54px'>
            {!hidden ? 
                <>{loading ? <img src={SPINNER} width='17px' height='17px' alt='spinner'/> : 
                    <NumericFormat
                        value={totalEarned}
                        className='fs-30px fw-400 lh-54px'
                        displayType='text'
                        thousandSeparator={true}
                        renderText={(value, props) => (
                            <p {...props}>
                                {value} NDB
                            </p>
                        )}
                    >
                    </NumericFormat>
                   }</> : 
                <p className='fs-30px fw-400 lh-54px'>********</p>
            }
        </div>
        <div className='fs-14px text-[#959595] mt-3 lh-18px'>
            {!hidden ? 
                <>{loading ? <img src={SPINNER} width='15px' height='15px' alt='spinner'/> : 
                <NumericFormat
                        value={((totalEarned * ndbPrice) / price).toFixed(decimals)}
                        className='text-[#959595] fs-15px'
                        displayType='text'
                        thousandSeparator={true}
                        renderText={(value, props) => (
                            <p {...props}>
                                ~ {value} {equity}
                            </p>
                        )}
                    >
                    </NumericFormat>
                }
                </> : 
                <p className='fs-15px txt-disable-gray'>********</p>
            }
            
        </div>
    </div>
}

export default CommissionBalance;