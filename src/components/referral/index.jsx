import React from 'react';

import Seo from '../seo';
import Header from './../header';
import ReferralBody from './referralBody/ReferralBody';

const Referral = () => {
    
    return (
        <>
            <Seo title="Referral" />
            <main className='history-page'>
                <Header />
                <div className='container-xxl'>
                    <div className='px-3 px-md-2 px-xl-5'>
                        <div className='d-flex d-md-none align-items-start flex-column my-3 my-md-5'>
                            <h3 className='fw-bold'>INVITE FRIENDS</h3>
                            <h6 className='fs-14px'>Earn commission when your friends purchase NDB</h6>
                        </div>
                        <ReferralBody />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Referral;