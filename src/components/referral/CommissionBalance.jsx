import React, { useState } from 'react';

const CommissionBalance = ({loading, totalEarned}) => {
    
    // USD vs. BTC(BNB)??
    const [ currentEquity, setCurrentEquity ] = useState('USD');
    const [equityBalance, setEquityBalance] = useState(123456);
    
    const onChangeEquity = (equity) => {
        if(equity === currentEquity) return;
        // change equity
        setCurrentEquity(equity);
        // change equity balance
    }

    return <div className='text-white bg-gray-50 px-2 py-2'>
        <div className='d-flex justify-content-between'>
            <div className='fs-12px txt-disable-gray'>Total Earned From Friends (NDB) </div>
            <div className='ms-auto fs-13px'>
                <span onClick={() => onChangeEquity('BTC')} onKeyDown={() => onChangeEquity('BTC')}>BTC</span>|
                <span onClick={() => onChangeEquity('USD')} onKeyDown={() => onChangeEquity('USD')}>USD</span>
            </div>
        </div>
        <div className='mt-2'>{loading ? <>spinner</> : <span className='fs-24px'>{totalEarned}</span>} <span className="fs-13px">NDB</span></div>
        <div className='fs-14px text-[#959595] mt-4 mb-2'>{loading ? <>spinner</> : <span className='text-[#959595]'>~ {equityBalance}</span>} {currentEquity.toUpperCase()}</div>
    </div>
}

export default CommissionBalance;