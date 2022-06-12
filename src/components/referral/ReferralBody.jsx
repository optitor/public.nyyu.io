import React, { useState } from 'react';
import CommissionWallet from './CommissionWallet';
import ReferralWalletConnector from './ReferralWalletConnector';
import ReferralLink from './ReferralLink';

const ReferralBody = () => {
    
    // Referral status, 
    //1 - wallet is not connected, 2 - activated
    const [referrerStatus, setReferrerStatus] = useState(2);
    
    return <div className='col-12 col-md-8 p-1 p-lg-5'>
        <div className='d-flex align-items-center flex-column my-5'>
            <h3 className='fw-bold'>INVITE FRIENDS</h3>
            <h6 className='fs-16px'>Earn commission when your friends purchase NDB</h6>
        </div>
        {referrerStatus === 1 && <ReferralWalletConnector changeStatus={setReferrerStatus} />}
        {referrerStatus === 2 && <ReferralLink />}
    </div>
}

export default ReferralBody;