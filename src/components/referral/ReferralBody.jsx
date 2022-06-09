import React, { useState } from 'react';
import CommissionWallet from './CommissionWallet';
import ReferralWalletConnector from './ReferralWalletConnector';
import ReferralLink from './ReferralLink';

const ReferralBody = () => {
    
    // Referral status, 
    //0 - inactive, 1 - wallet is not connected, 2 - activated
    const [referrerStatus, setReferrerStatus] = useState(0);
    
    return <div className='col-1 col-md-8'>
        <div>
            <h3>INVITE FRIENDS</h3>
            <h6>Earn commission when your friends purchase NDB</h6>
        </div>
        {referrerStatus === 0 && <CommissionWallet changeStatus={setReferrerStatus}/>}
        {referrerStatus === 1 && <ReferralWalletConnector changeStatus={setReferrerStatus} />}
        {referrerStatus === 2 && <ReferralLink />}
    </div>
}

export default ReferralBody;