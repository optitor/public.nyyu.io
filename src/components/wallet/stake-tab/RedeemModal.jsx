import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import { Checkbox } from '@mui/material';
import { renderNumberFormat, roundNumber } from '../../../utilities/number';
import { NDB } from '../../../utilities/imgImport';

const label = { inputProps: { 'aria-label': 'Checkbox for agreement' } };

export default function RedeemModal({isModalOpen, setIsModalOpen, data={}}) {
    const [pending, setPending] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [stakingAmount, setStakingAmount] = useState('');

    const closeModal = () => setIsModalOpen(false);
    const handleSubmit = () => {

    };

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
                    <img src={NDB} alt="ndb coin" style={{width: 40}} className="m-2" />
                    <h4 className="font-bold m-0">NDB</h4>
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
                    <div className="d-flex justify-content-between">
                        <p className="fs-14px">Minimum</p>
                        <p>{renderNumberFormat(1, 'NDB')}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fs-14px">Maximum</p>
                        <p>{renderNumberFormat(8, 'NDB')}</p>
                    </div>
                    <div className="d-flex align-items-center my-3">
                        <Checkbox {...label} color="success" id="agree_for_ndb_saving"
                            value={agreed} onChange={e => setAgreed(e.target.checked)}
                            sx={{
                                color: "#23c865",
                                '&.Mui-checked': {
                                    color: "#23c865",
                                },
                                padding: 0
                            }}
                        />
                        <label htmlFor='agree_for_ndb_saving' className="fs-13px ms-2">I have read and agree to ndb savings service agreement</label>
                    </div>
                    <button className="btn btn-outline-light w-100 rounded-0 fw-bold text-uppercase my-4" style={{height: 47}}
                        onClick={handleSubmit} disabled={pending || !agreed}
                    >
                        {pending? 'Staking. . .': 'Stake'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}