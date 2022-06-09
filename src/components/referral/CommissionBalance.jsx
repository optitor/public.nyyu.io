import React, { useState } from 'react';

const CommissionBalance = ({loading, totalEarned}) => {
    
    // USD vs. BTC(BNB)??
    const [ currentEquity, setCurrentEquity ] = useState('USD');
    const [equityBalance, setEquityBalance] = useState(0);
    
    const onChangeEquity = (equity) => {
        if(equity === currentEquity) return;
        // change equity
        setCurrentEquity(equity);
        // change equity balance
    }

    return <div>
        <div>Total Earned From Friends (NDB) 
            <span role='button' tabIndex={0} onClick={() => onChangeEquity('BTC')} onKeyDown={() => onChangeEquity('BTC')}>BTC</span>|
            <span role='button' tabIndex={-1} onClick={() => onChangeEquity('USD')} onKeyDown={() => onChangeEquity('USD')}>USD</span>
        </div>
        <div>{loading ? <>spinner</> : totalEarned} NDB</div>
        <div>{loading ? <>spinner</> : equityBalance} {currentEquity.toUpperCase}</div>
    </div>
}

export default CommissionBalance;