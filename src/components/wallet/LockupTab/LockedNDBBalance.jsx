import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { AiFillEyeInvisible } from '@react-icons/all-files/ai/AiFillEyeInvisible';
import { AiFillEye } from '@react-icons/all-files/ai/AiFillEye';

import { SPINNER } from '../../../utilities/imgImport';
import { changeEquity, updateHiddenStatus } from '../../../redux/actions/tempAction';
import NumberFormat from 'react-number-format';

const QUOTE = "USDT";
const TICKER_price = `${process.env.GATSBY_BINANCE_BASE_API}/v3/ticker/price`;
const REFRESH_TIME = 30 * 1000;

const obscureValueString = "********"

const LockedNDBBalance = ({loading, totalLocked}) => {
    const dispatch = useDispatch();

    const currency = useSelector(state => state.favAssets?.currency.value);
    const currencyRate = useSelector(state => state.currencyRates);
    const { equity, hidden, ndbPrice } = useSelector(state => state.balance);
    
    const [price, setPrice] = useState(1 / currencyRate[equity]);
    const [decimals, setDecimals] = useState(equity !== 'BTC' ? 2 : 8);

    // const onChangeEquity = (newEquity) => {
    //     if(equity === newEquity) return;
    //     // change equity
    //     dispatch(changeEquity(newEquity));
        
    //     // change equity balance
    //     setDecimals(newEquity === 'BTC' ? 8 : 2);
    //     setPrice(newEquity === 'BTC' ? btcPrice : 1 / currencyRate[newEquity]);
    // }

    // useEffect(() => {
    //     const getBtcPrice = async () => {
    //         const { data } = await axios.get(TICKER_price, { params: { symbol: "BTC" + QUOTE } });
    //         setBtcPrice(data.price);
    //         if(equity === 'BTC') {
    //             setPrice(data.price);
    //         }
    //     };
    //     getBtcPrice();
    //     const interval = setInterval(() => {
    //         getBtcPrice()
    //     }, REFRESH_TIME);
    //     return () => clearInterval(interval);
    // }, []);

    return <div className='text-white bg-gray-50 px-3 py-3'>
        <div className='d-flex justify-content-between fs-17px'>
            <div className='txt-disable-gray'>
                Total Locked(NDB)
            </div>
            <div>
                {!hidden ? 
                    <AiFillEye className='cursor-pointer' size='1.5em' onClick={() => dispatch(updateHiddenStatus(true))}/> : 
                    <AiFillEyeInvisible className='cursor-pointer' size='1.5em' onClick={() => dispatch(updateHiddenStatus(false))}/> 
                }
            </div>
        </div>
        <div className='lh-54px'>
            {!hidden ? 
                <>{loading ? <img src={SPINNER} width='17px' height='17px' alt='spinner'/> : 
                    <NumberFormat
                        value={totalLocked}
                        className='fs-30px fw-400 lh-54px'
                        displayType='text'
                        thousandSeparator={true}
                        renderText={(value, props) => (
                            <p {...props}>
                                {value} NDB
                            </p>
                        )}
                        decimalScale={2}
                    />
                   }</> : 
                <p className='fs-30px fw-400 lh-54px'>{obscureValueString}</p>
            }
        </div>
        <div className='fs-14px text-[#959595] mt-3 lh-18px'>
            {!hidden ? 
                <>{loading ? <img src={SPINNER} width='15px' height='15px' alt='spinner'/> : 
                <NumberFormat
                    value={((totalLocked * ndbPrice) / price).toFixed(decimals)}
                    className='text-[#959595] fs-15px'
                    displayType='text'
                    thousandSeparator={true}
                    renderText={(value, props) => (
                        <p {...props}>
                            ~ {value} {equity}
                        </p>
                    )}
                />
                }
                </> : 
                <p className='fs-15px txt-disable-gray'>{obscureValueString}</p>
            }
            
        </div>
    </div>
}

export default LockedNDBBalance;