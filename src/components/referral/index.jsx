import React from 'react';

import ReferralProvider from './ReferralContext';
import Seo from '../seo';
import Header from './../header';
import ReferralBody from './referralBody/ReferralBody';

const Referral = () => {
    
    return (
        <>
            <Seo title="Referral" />
            <main className='history-page'>
                <Header />
                <ReferralProvider>
                    <div className='container'>
                        <div>
                            <div className='d-flex d-lg-none align-items-start flex-column my-3 my-lg-5'>
                                <h3 className='fw-bold'>INVITE FRIENDS</h3>
                                <h6 className='fs-14px'>Earn commission when your friends purchase NDB</h6>
                            </div>
                            <ReferralBody />
                        </div>
                    </div>
                </ReferralProvider>
            </main>
        </>
    )
}

export default Referral;