import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import ReferralWalletConnector from './ReferralWalletConnector';
import ReferralLink from './ReferralLink';

import { GET_REFERRAL } from '../api/query';
import { ACTIVE_ACTION, UPDATE_ACTION } from '../constants';
import { SPINNER } from '../../../utilities/imgImport';

const ReferralBody = () => {
    
    // Referral status, 
    //1 - wallet is not connected, 2 - activated
    const [referrer, setReferrer] = useState(null);
    const [action, setAction] = useState(ACTIVE_ACTION);

    // check referrer status
    const {loading} = useQuery(GET_REFERRAL, {
        onCompleted: data => {
            if(data.getReferral) {
                setReferrer(data.getReferral);
            } else {
                /// has no referral code yet
                setReferrer(null);
            }
        },
        onError: err => {
            console.log(err);
        }
    })

    const onChangeReferrer = (_referrer) => {
        setReferrer(_referrer);
        setAction(ACTIVE_ACTION);
    }

    const onChangeWallet = () => {
        setAction(UPDATE_ACTION);
    }

    return (
        <>     
            <div className='col-12 col-md-8 p-1 p-lg-5'>
                {loading ? 
                    <div className='text-center pt-5'>
                        <img src={SPINNER} width='34px' height='34px' />
                    </div>: 
                    <><div className='d-flex align-items-center flex-column my-5'>
                        <h3 className='fw-bold'>INVITE FRIENDS</h3>
                        <h6 className='fs-16px'>Earn commission when your friends purchase NDB</h6>
                    </div>
                    {(referrer === null || action === UPDATE_ACTION) && 
                        <ReferralWalletConnector 
                            referrerInfo={referrer} 
                            setReferrer={onChangeReferrer} 
                            action={action} />}
                    {(referrer && action === ACTIVE_ACTION) && <ReferralLink referrerInfo={referrer} onChangeWallet={onChangeWallet}/>}</>
                }
            </div>
        </>
    )
}

export default ReferralBody;