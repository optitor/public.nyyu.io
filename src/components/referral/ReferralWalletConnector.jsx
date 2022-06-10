import React, { useState } from 'react';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import WalletSelector from '../common/wallet/WalletSelector';

const ReferralWalletConnector = ({changeStatus}) => {
    
    // getting activate code

    // activate invite

    // go to next step

    // selected wallet 
    const [selectedWallet, setSelectedWallet] = useState('internal');
    const [walletAddress, setWalletAddress] = useState(null);
    const onWalletChanged = (wallet) => {
        setSelectedWallet(wallet.selectedWallet);
        setWalletAddress(wallet.address);
    }
    
    return <div className='text-white'>
        <div>
            <div>STEP <span className='text-green'>2</span></div>
            <div>
                {selectedWallet === 'external' && 
                    <><FaArrowLeft onClick={() => setSelectedWallet('internal')}/>&nbsp;</>
                }
                Connect your wallet
            </div>
        </div>
        <div>
            <WalletSelector 
                walletChanged={onWalletChanged} 
                selectedWallet={selectedWallet}
            />
        </div>
        <div>
            <button>ACTIVATE INVITE & EARN</button>
        </div>
    </div>
}

export default ReferralWalletConnector;