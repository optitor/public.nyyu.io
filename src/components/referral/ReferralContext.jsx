import React, { useContext, useState } from 'react';
export const ReferralContext = React.createContext();
export const useReferral = () => useContext(ReferralContext);

const ReferralProvider = ({children}) => {
    const [hidden, setHidden] = useState(false);
    const [currentEquity, setCurrentEquity] = useState('USD');
    const [ndbPrice] = useState(0.01);
    const [btcPrice, setBtcPrice] = useState(1);
    const [view, setView] = useState('all');
    const [xl, setXl] = useState(false);

    const provider = {
        hidden,
        setHidden,
        currentEquity,
        setCurrentEquity,
        ndbPrice,
        btcPrice,
        setBtcPrice,
        view,
        setView,
        xl,
        setXl
    };

    return (
        <ReferralContext.Provider value={provider}>
            {children}
        </ReferralContext.Provider>
    )
}

export default ReferralProvider;