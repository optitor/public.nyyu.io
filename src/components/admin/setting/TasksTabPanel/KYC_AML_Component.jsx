import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import NumberFormat from 'react-number-format';
import Modal from 'react-modal';
import { device } from '../../../../utilities/device';
import { width } from './columnWidth';

const KYC_AML_Component = () => {
    const [show, setShow] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [points, setPoints] = useState(null);
    return (
        <>
            <DataRow>
                <div className='task'>
                    <Main>
                        <p>KYC/AML COMPLETION</p>
                    </Main>
                </div>
                <div className='threshold'></div>
                <div className='points'>
                    <Main>
                        <p>500</p>
                    </Main>
                </div>
                <div className='edit'>
                    <Main>
                        <p><span><Icon icon="clarity:note-edit-line" onClick={() => setModalIsOpen(true)} /></span></p>
                    </Main>
                </div>
            </DataRow>
            <DataRowForMobile>
                <div>
                    <LayoutForMobile>
                        <div className='left' onClick={() => setShow(!show)} onKeyDown={() => setShow(!show)} aria-hidden="true">
                            <p>KYC/AML COMPLETION</p>
                        </div>
                        <div className='right'>
                            <p>
                                <span className='edit'><Icon icon="clarity:note-edit-line" onClick={() => setModalIsOpen(true)} /></span>
                            </p>
                        </div>
                        <div className='right'>
                            <p style={{fontSize: 16}}>
                                <span><Icon icon={show? "ant-design:caret-up-filled": "ant-design:caret-down-filled"} onClick={() => setShow(!show)} /></span>
                            </p>
                        </div>
                    </LayoutForMobile>
                </div>
                <ToggleForMobile show={show}>
                    <LayoutForMobile>
                        <div className='left'>
                            <p style={{color: 'dimgrey'}}>Points</p>
                        </div>
                        <div className='right'>
                            <p>500</p>
                        </div>
                    </LayoutForMobile>
                </ToggleForMobile>
            </DataRowForMobile>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                ariaHideApp={false}
                className="pwd-reset-modal"
                overlayClassName="pwd-modal__overlay"
            >
                <div className="pwd-modal__header">
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>KYC/AML Completion</p>
                    </div>
                    <div
                        onClick={() => setModalIsOpen(false)}
                        onKeyDown={() => setModalIsOpen(false)}
                        role="button"
                        tabIndex="0"
                    >
                        <Icon icon="ep:close-bold" />
                    </div>
                </div>
                <form className="form" onSubmit={(e) => e.preventDefault()}>
                    <div className='input'>
                        <p className='mt-4' style={{fontSize: 12}}>Points</p>
                        <NumberFormat className='black_input'
                            placeholder='Enter number'
                            thousandSeparator={true}
                            allowNegative={false}
                            value={points}
                            onValueChange={values => setPoints(values.value)}
                        />
                    </div>                  
                    <div className="pwd-modal__footer mt-4">
                        <button
                            className="btn previous"
                            onClick={() => setModalIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className='btn next'>
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default KYC_AML_Component;

const DataRow = styled.div`
    min-height: 60px;
    border-bottom: 1px solid #464646;
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    svg {
        cursor: pointer;
    }

    &>div.task {width: ${width.task}; padding-left: 16px;}
    &>div.threshold {width: ${width.threshold};}
    &>div.points {width: ${width.points};}
    &>div.edit {
        width: ${width.edit};
        display: flex;
        justify-content: center;
        p span {
            font-size: 22px;
            color: #23c865;
        }
    }

    @media screen and (max-width: ${device['phone']}){
        display: none;
    }
`;

const Main = styled.div`
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

// For Mobile
const DataRowForMobile = styled.div`
    min-height: 60px;
    border-bottom: 1px solid #464646;
    padding: 16px;
    display: none;    
    svg {
        cursor: pointer;
    }
    @media screen and (max-width: ${device['phone']}){
        display: flex;
        flex-direction: column;
    } 
`;

const ToggleForMobile = styled.div`
    display: ${props => {
        return props.show? 'block': 'none';
    }};
`;

const LayoutForMobile = styled.div`
    display: flex;
    justify-content: space-between;
    &>div.left {
        width: 80%;
    }
    &>div.right {
        p {
            text-align: right;
            span.edit {
                font-size: 22px;
                color: #23c865;
            }    
        }
    }
`;