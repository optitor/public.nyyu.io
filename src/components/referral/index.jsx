import React, { useState } from 'react';

import Seo from '../seo';
import Header from './../header';
import CommissionHistory from './CommissionHistory';
import ReferralBody from './ReferralBody';

const Referral = () => {
    
    return (
        <>
            <Seo title="Referral" />
            <main className='history-page'>
                <Header />
                <div className='container-xxl'>
                    <div className='row px-5 px-md-2 px-xl-5'>
                        <CommissionHistory />
                        <ReferralBody />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Referral;