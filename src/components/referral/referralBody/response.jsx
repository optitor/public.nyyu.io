import React, { useState, useEffect } from 'react';
import { isBrowser } from '../../../utilities/auth';

const ReferralResponse = ({onChangeScreen}) => {
    
    const [view, setView] = useState('');

    const onViewClick = (viewMode) => {
        setView(viewMode);
        onChangeScreen(viewMode);
    }

    useEffect(() => {
        // mounted
        if(!isBrowser) return;
        
        const handleResize = () => {
            if(window.innerWidth <= 769) {
                setView('balance');
                onChangeScreen('balance');
            }
            if(window.innerWidth > 769) {
                setView('all');
                onChangeScreen('all');
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    
    return (
        <div className="d-flex d-md-none justify-content-between">
            <button 
                onClick={() => onViewClick('balance')}
                className={`w-100 me-2 py-2 text-white fw-700 fs-14px border border-white ${view === 'balance' ? 'bg-green':'bg-transparent'}`}
            >
                BALANCE
            </button>
            <button 
                onClick={() => onViewClick('setting')}
                className={`w-100 ms-2 py-2 text-white fw-700 fs-14px border border-white ${view === 'setting' ? 'bg-green':'bg-transparent'}`}
            >
                SETTING
            </button>
        </div>
    )
}

export default ReferralResponse;