import React from 'react';
import KycComponent from './KycComponent';

const contents = {
    withdraw: 'threshold: 1 000',
    deposit: 'not required',
    bid: 'threshold: 2 000',
    direct_purchase: 'required',
};

const KYCTabPanel = () => {
    return (
        <>
            <KycComponent icon="fe:upload" topic="Withdraw" content={contents.withdraw} />
            <KycComponent icon="fe:download" topic="Deposit" content={contents.deposit} />
            <KycComponent icon="uil:university" topic="Bid" content={contents.bid} />
            <KycComponent icon="grommet-icons:basket" topic="Direct purchase round" content={contents.direct_purchase} />
        </>
    );
};

export default KYCTabPanel;