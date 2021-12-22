import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import Modal from 'react-modal';
import { device } from '../../../../utilities/device';
import { width } from './columnWidth';
import NumberFormat from 'react-number-format';

const Balances = [
    {threshold: '50', points: 500},
    {threshold: '1k', points: 1000},
    {threshold: '50k', points: 1500},
    {threshold: '100k', points: 2000},
    {threshold: '300k', points: 3000},
    {threshold: '500k', points: 6000},
];

const WalletBalance = () => {
    const [show, setShow] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [balances, setBalances] = useState([]);

    const openEditModal = () => {
        setBalances(Balances);
        setModalIsOpen(true);
    };

    return (
        <>
            <DataRow>
                <div className='task' onClick={() => setShow(!show)} onKeyDown={() => setShow(!show)} aria-hidden="true">
                    <Main>
                        <p>Wallet Balance <span style={{marginLeft: 15}}><Icon icon={show? "ant-design:caret-up-filled": "ant-design:caret-down-filled"} /></span></p>
                    </Main>
                </div>
                <div className='threshold' onClick={() => setShow(!show)} onKeyDown={() => setShow(!show)} aria-hidden="true">
                    <Main>
                        <p>{Balances[0].threshold}</p>
                    </Main>         
                    <Toggle show={show}>
                        {Balances.map((value, index) => {
                            if(index === 0) return null;
                            return <p key={index}>{value.threshold}</p>;
                        })}
                    </Toggle>         
                </div>
                <div className='points' onClick={() => setShow(!show)} onKeyDown={() => setShow(!show)} aria-hidden="true">
                    <Main>
                        <p>{Balances[0].points}</p>
                    </Main>
                    <Toggle show={show}>
                        {Balances.map((value, index) => {
                            if(index === 0) return null;
                            return <p key={index}>{value.points}</p>;
                        })}
                    </Toggle>           
                </div>
                <div className='edit'>
                    <Main>
                        <p><span className='edit'><Icon icon="clarity:note-edit-line" onClick={openEditModal} /></span></p>
                    </Main>              
                </div>
            </DataRow>

            <DataRowForMobile>
                <div>
                    <LayoutForMobile>
                        <div className='left' onClick={() => setShow(!show)} onKeyDown={() => setShow(!show)} aria-hidden="true">
                            <p>Ballance Wallet</p>
                        </div>
                        <div className='right'>
                            <p>
                                <span className='edit'><Icon icon="clarity:note-edit-line" onClick={() => setModalIsOpen(true)} /></span>
                            </p>
                        </div>
                        <div className='right' onClick={() => setShow(!show)} onKeyDown={() => setShow(!show)} aria-hidden="true">
                            <p style={{fontSize: 16}}>
                                <span><Icon icon={show? "ant-design:caret-up-filled": "ant-design:caret-down-filled"} onClick={() => setShow(!show)} /></span>
                            </p>
                        </div>
                    </LayoutForMobile>
                </div>
                <ToggleForMobile show={show}>
                    <LayoutForMobile>
                        <div className='left'>
                            <p style={{color: 'dimgrey'}}>Threshold</p>
                        </div>
                        <div className='right'>
                            <p style={{color: 'dimgray'}}>Points</p>
                        </div>
                    </LayoutForMobile>
                    {Balances.map((value, index) => {
                        return (
                            <LayoutForMobile key={index}>
                                <div className='left'>
                                    <p style={{fontWeight: 400}}>{value.threshold}</p>
                                </div>
                                <div className='right'>
                                    <p style={{fontWeight: 400}}>{value.points}</p>
                                </div>
                            </LayoutForMobile>
                        );
                    })}
                </ToggleForMobile>
            </DataRowForMobile>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                ariaHideApp={false}
                className="wallet-balance-modal"
                overlayClassName="pwd-modal__overlay"
            >
                <div className="pwd-modal__header">
                    <p>Wallet Balance</p>
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
                    {balances.map((value, index) => {
                        return (
                            <div key={index} className='input'>
                                <div className='threshold_input'>
                                    <input className='black_input'
                                        value={value.threshold}
                                        onChange={e => {balances[index].threshold = e.target.value; setBalances([...balances]);}}
                                    />
                                </div>
                                <div className='points_input'>
                                    <NumberFormat className='black_input'
                                        placeholder='Enter number'
                                        thousandSeparator={true}
                                        allowNegative={false}
                                        value={value.points}
                                        onValueChange={values => {
                                            balances[index].points = values.value;
                                            setBalances([...balances]);
                                        }}
                                    />
                                </div>
                                <div className='trash_btn'>
                                    <Icon icon="bytesize:trash" onClick={() => {
                                        let array = [...balances]; 
                                        array.splice(index, 1);
                                        setBalances([...array]);
                                    }}/>
                                </div>
                            </div>
                        );
                    })}
                    <div className='input'>
                        <span className='add_balance'><Icon icon='akar-icons:plus' onClick={() => setBalances([...balances, {threshold: '', points: null}])}/></span>
                    </div>
                </form>
                <div className="pwd-modal__footer mt-5">
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
            </Modal>
        </>
    )
};

export default WalletBalance;

const DataRow = styled.div`
    min-height: 60px;
    border-bottom: 1px solid #464646;
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    svg {
        cursor: pointer;
    }

    &>div.task {width: ${width.task}; padding-left: 16px}
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

const Toggle = styled.div`
    min-height: 60px;
    display: ${props => {
        return props.show? 'flex': 'none';
    }};
    transition: 0.3s;
    flex-direction: column;
    justify-content: center;
    p {
        margin-bottom: 12px;
    }
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