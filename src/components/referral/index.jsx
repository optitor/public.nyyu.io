import React, { useState } from 'react';
import CommissionHistory from './CommissionHistory';
import ReferralBody from './ReferralBody';

const Referral = () => {
    
    return <div className='container-xxl'>
        <div className='row'>
            <CommissionHistory />
            <ReferralBody />
        </div>
    </div>
}

export default Referral;