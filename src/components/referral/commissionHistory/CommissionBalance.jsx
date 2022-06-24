import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { AiFillEyeInvisible } from '@react-icons/all-files/ai/AiFillEyeInvisible';
import { AiFillEye } from '@react-icons/all-files/ai/AiFillEye';

import { SPINNER } from '../../../utilities/imgImport';
import { useReferral } from '../ReferralContext';

const QUOTE = "USDT";
const TICKER_price = "https://api.binance.com/api/v3/ticker/price";
const REFRESH_TIME = 30 * 1000;

const CommissionBalance = ({loading, totalEarned}) => {
    
    const currency = useSelector(state => state.favAssets?.currency.value);
    const currencyRate = useSelector(state => state.currencyRates);
    const {
        hidden, setHidden, 
        currentEquity, setCurrentEquity,
        btcPrice, setBtcPrice,
        ndbPrice
    } = useReferral();
    
    // USD vs. BTC(BNB)??
    const [ equityBalance, setEquityBalance ] = useState(0);
    const onChangeEquity = (equity) => {
        if(equity === currentEquity) return;
        // change equity
        setCurrentEquity(equity);
        
        // change equity balance
        const price = equity === 'BTC' ? btcPrice : 1 / currencyRate[currency];
        setEquityBalance((totalEarned / ndbPrice) / price );
    }

    useEffect(() => {
        setCurrentEquity('BTC');
        const getBtcPrice = async () => {
            const { data } = await axios.get(TICKER_price, { params: { symbol: "BTC" + QUOTE } });
            setBtcPrice(data.price);
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
                    <AiFillEye className='cursor-pointer' size='1.6em' onClick={() => setHidden(true)}/> : 
                    <AiFillEyeInvisible className='cursor-pointer' size='1.6em' onClick={() => setHidden(false)}/> 
                }
            </div>
            <div className='ms-auto'>
                <span className={`me-1 cursor-pointer ${currentEquity === 'BTC' ? 'text-white':'txt-disable-gray'}`} onClick={() => onChangeEquity('BTC')} onKeyDown={() => onChangeEquity('BTC')}>BTC</span>
                <span className='txt-disable-gray'>|</span>
                <span className={`ms-1 cursor-pointer ${currentEquity === currency ? 'text-white':'txt-disable-gray'}`} onClick={() => onChangeEquity(currency)} onKeyDown={() => onChangeEquity(currency)}>{currency}</span>
            </div>
        </div>
        <div className='mt-2'>
            {!hidden ? 
                <>{loading ? <img src={SPINNER} width='17px' height='17px' alt='spinner'/> : <span className='fs-30px fw-600'>{totalEarned}</span>} <span className="fs-22px">NDB</span></> : 
                <span className='fs-24px text-white'>********</span>
            }
        </div>
        <div className='fs-14px text-[#959595] mt-4 mb-2'>
            {!hidden ? 
                <>{loading ? <img src={SPINNER} width='17px' height='17px' alt='spinner'/> : <span className='text-[#959595] fs-15px'>~ {equityBalance}</span>} {currentEquity}</> : 
                <span className='fs-14px txt-disable-gray'>********</span>
            }
            
        </div>
    </div>
}

export default CommissionBalance;