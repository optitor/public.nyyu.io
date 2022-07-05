import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from 'react-modal';

export default function NDBStakingModal({isModalOpen, setIsModalOpen, data={}}) {
    const [pending, setPending] = useState(false);

    const closeModal = () => setIsModalOpen(false);
    const handleSubmit = () => {

    }

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
            className="pwd-reset-modal"
            overlayClassName="pwd-modal__overlay"
        >
            <div className="pwd-modal__header">
                <div className='d-flex justify-content-center align-items-center'>
                    <p>NDB Staking</p>
                </div>
                <div
                    onClick={closeModal}
                    onKeyDown={closeModal}
                    role="button"
                    tabIndex="0"
                >
                    <Icon icon="ep:close-bold" />
                </div>
            </div>
            <form className="form" onSubmit={(e) => e.preventDefault()}>
                <div className='input'>
                    <p className='mt-2' style={{fontSize: 12}}>Points</p>
                </div>                  
                <div className="mt-4">
                    <button className='btn text-upppercase' onClick={handleSubmit} disabled={pending}>
                        {pending? 'Staking. . .': 'Stake'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}