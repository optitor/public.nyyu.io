import React, { useState } from 'react';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';
import { useMutation } from '@apollo/client';

import WalletSelector from '../../common/wallet/WalletSelector';
import { ACTIVATE_REFERRER, CHANGE_COMMISSION_WALLET } from '../api/mutation';
import CustomSpinner from '../../common/custom-spinner';
import { ACTIVE_ACTION, UPDATE_ACTION } from '../constants';

const ReferralWalletConnector = ({referrerInfo, setReferrer, action}) => {
    
    const [error, setError] = useState(null);

    // selected wallet 
    const [selectedWallet, setSelectedWallet] = useState('internal');
    const [walletAddress, setWalletAddress] = useState(null);
    const onWalletChanged = (wallet) => {
        setSelectedWallet(wallet.selectedWallet);
        setWalletAddress(wallet.address);
    }

    // getting activate code
    const [activateReferrer, { loading: activateLoading }] = useMutation(ACTIVATE_REFERRER, {
        onCompleted: data => {
            if(data.activateReferralCode) {
                /// referral code 
                const {referralCode, rate} = data.activateReferralCode;
                setReferrer({referralCode, rate, walletConnect: walletAddress});
            } else {
                // cannot get code
                setError('Cannot get referral code.');
            }
        },
        onError: err => {
            setError(err.message);
        }
    });

    const [changeReferrerWallet, { loading: updateLoading }] = useMutation(CHANGE_COMMISSION_WALLET, {
        onCompleted: data => {
            if(data.changeReferralCommissionWallet) {
                console.log(data.changeReferralCommissionWallet);
                setReferrer({...referrerInfo, walletConnect: walletAddress});
            } else {
                setError('Cannot update referral wallet.');
            }
        },
        onError: err => {
            setError(err.message);
        }
    })

    const onActivateClicked = () => {
        // check loading
        if(activateLoading || updateLoading) return;
        
        // check wallet 
        setError(null);
        // internal wallet is not supported now
        if(selectedWallet === 'internal') {
            setError('Nyyu wallet is not supported now.')
            return;
        }
        // check wallet address is exists
        if(!walletAddress) {
            setError('Please connect wallet.');
            return;
        }

        if(action === ACTIVE_ACTION) {
            activateReferrer({variables: {
                wallet: walletAddress
            }});
        } else if (action === UPDATE_ACTION) {
            if(referrerInfo?.walletConnect === walletAddress) {
                setReferrer({...referrerInfo});
            }
            changeReferrerWallet({variables: {
                wallet: walletAddress
            }})
        } else {
            setError('Unknown error.')
        }
    }
    
    return <div className='text-white'>
        <div>
            {/* <div>STEP <span className='text-green'>2</span></div> */}
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
            {error && <div className='text-danger'>{error}</div>}
            <button 
                onClick={onActivateClicked}
                className='d-flex align-items-center justify-content-center w-100 py-2 bg-transparent text-white fw-bold border border-white fs-22px'
            >
                <div className={`${(activateLoading || updateLoading) ? "opacity-1": "opacity-0"}`}><CustomSpinner /></div>
                <div className={`fs-20px ${(activateLoading || updateLoading) ? 'ms-3' : 'pe-4'}`}>
                    {action === ACTIVE_ACTION && 'ACTIVATE INVITE & EARN'}
                    {action === UPDATE_ACTION && 'UPDATE REFERRAL WALLET'}
                </div>
            </button>
            {action === UPDATE_ACTION && 
                <button
                    onClick={() => setReferrer({...referrerInfo})}
                    className='d-flex align-items-center justify-content-center w-100 py-2 mt-3 bg-transparent text-white fw-bold border border-white fs-22px'
                >
                    CANCEL UPDATE
                </button>
            }
        </div>
    </div>
}

export default ReferralWalletConnector;