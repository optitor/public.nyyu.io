import React from 'react';
import Modal from 'react-modal';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { device } from '../../utilities/device';
import { SadFace } from '../../utilities/imgImport';

const InformBannedModal = ({isModalOpen, setIsModalOpen}) => {
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
            className="inform-banned-modal"
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
                <div className='text-center mb-5 px-5'>
                    <img src={SadFace} />
                    <p className='mt-3'>It seems you are accessing nyyu.io from an IP address belonging to the unallowed country.</p>
                    <p className='mt-3'>
                        As per our
                        <a target='_blank' href='https://ndb.technology' className='ms-2 text-green text-underline'>Terms of Use</a>
                        , we are unable to provide services to users from this region.
                    </p>
                </div>
            </InformBanned>
        </Modal>
    );
};

export default InformBannedModal;

const InformBanned = styled.div`
    img {
        width: 150px;
    }
    p {
        font-size: 18px;
        font-weight: 600;
        &.description {
            font-size: 14px;
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