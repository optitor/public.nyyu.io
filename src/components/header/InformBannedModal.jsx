import React, { useState, useMemo } from 'react';
import Modal from 'react-modal';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { device } from '../../utilities/device';

const InformBannedModal = ({isModalOpen, setIsModalOpen}) => {
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
            className="delete-confirm-modal"
            overlayClassName="pwd-modal__overlay"
        >
            <div className="pwd-modal__header">
                <p></p>
                <div
                    onClick={closeModal}
                    onKeyDown={closeModal}
                    role="button"
                    tabIndex="0"
                >
                    <Icon icon="ep:close-bold" />
                </div>
            </div>
            <InformBanned>
                <div className='text-center mb-3'>
                    <h4>Sorry</h4>
                    <p>Your country is banned from our services.</p>
                </div>
            </InformBanned>
        </Modal>
    );
};

export default InformBannedModal;

const InformBanned = styled.div`
    margin-top: 20px;
    p {
        font-size: 18px;
        font-weight: 600;
        &.description {
            font-size: 14px;
            font-weight: 400;
        }
    }
    button.btn {
        color: #ffffff;
        border: 1px solid #ffffff;
        border-radius: 0;
        display: block;
        margin: 10px auto;
        width: 150px;
        text-transform: uppercase;
        font-size: 18px;
        font-weight: 600;
        &:hover {
            color: #23c865;
        }
    }
    button.green {
        border: 1px solid #23c865;
    }
    div.confirm {
        width: 80%;
        margin: auto;
    }
    @media screen and (max-width: ${device['phone']}){
        p {
            font-size: 14px;
            font-weight: 500;
            &.description {
                font-size: 12px;
            }
        }
        button.btn {
            font-size: 14px;
            font-weight: 500;
        }
        div.confirm {
            width: 100%;
        }
    }
`;