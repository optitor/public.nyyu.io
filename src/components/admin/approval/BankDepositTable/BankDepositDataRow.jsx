import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { device } from '../../../../utilities/device';
import { width } from './columnWidth';

const Status = {
    '0': 'pending',
    '1': 'countdown',
    '2': 'started',
    '3': 'ended',
};

const RoundDataRow = ({ datum }) => {
    const [show, setShow] = useState(false);

    return (
        <>
            <DataRow>
                <div className='reference'>
                    <Main>
                        <p className='first'>{datum.uid}</p>
                    </Main>
                </div>
                <div className='email'>
                    <Main>
                        <p>someone@some.com</p>
                    </Main>
                </div>
                <div className='amount'>
                    <Main>
                        <p className='first'>{datum.amount} {datum.fiatType}</p>
                    </Main>
                </div>
                <div className='usdAmount'>
                    <Main>
                        <p className='first'>{datum.usdAmount}</p>
                    </Main>
                </div>
                <div className='fee'>
                    <Main>
                        <p>{datum.fee}</p>
                    </Main>
                </div>
                <div className='deposited'>
                    <Main>
                        <p className='second'>{datum.deposited}</p>
                    </Main>
                </div>
                <div className='approve'>
                    <Main>
                        {!datum.status?
                            <p className='text-green text-center' style={{fontSize: 30}}>
                                <Icon icon='line-md:confirm-circle' />
                            </p>:
                            <button className='text-green bg-transparent border-0'>Approve</button>
                        }
                    </Main>
                </div>
            </DataRow>
            <DataRowForMobile>
                <div>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p style={{fontSize: 16, fontWeight: 700, color: 'white'}}>Reference</p>
                            <p>{datum.uid}</p>
                        </div>
                        <div className='right'>
                            {!datum.status?
                                <p className='text-green text-center' style={{fontSize: 30}}>
                                    <Icon icon='line-md:confirm-circle' />
                                </p>:
                                <button className='text-green bg-transparent border-0'>Approve</button>
                            }
                        </div>
                        <div className='right'>
                            <p style={{fontSize: 16}}>
                                <span><Icon icon={show? "ant-design:caret-up-filled": "ant-design:caret-down-filled"} data-bs-toggle="collapse" data-bs-target={`#id${datum.id}`} onClick={() => setShow(!show)} /></span>
                            </p>
                        </div>
                    </UnitRowForMobile>
                </div>
                <div id={`id${datum.id}`} className="collapse">
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>User Email</p>
                        </div>
                        <div className='right'>
                            <p>someone@some.com</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Deposit Amount</p>
                        </div>
                        <div className='right'>
                            <p>{datum.amount}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>USD Amount</p>
                        </div>
                        <div className='right'>
                            <p>{datum.usdAmount}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Fee</p>
                        </div>
                        <div className='right'>
                            <p>{datum.fee}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Deposited</p>
                        </div>
                        <div className='right'>
                            <p>{datum.deposited}</p>
                        </div>
                    </UnitRowForMobile>
                </div>
            </DataRowForMobile>
        </>
    );
};

export default RoundDataRow;

const DataRow = styled.div`
    min-height: 80px;
    padding: 8px 2px;
    border-bottom: 1px solid #464646;
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    svg {
        cursor: pointer;
    }


    &>div.reference {width: ${width.reference}; padding-left: 16px;}
    &>div.email {width: ${width.email};}
    &>div.amount {width: ${width.amount};}
    &>div.usdAmount {width: ${width.usdAmount};}
    &>div.fee {width: ${width.fee};}
    &>div.deposited {width: ${width.deposited};}
    &>div.approve {width: ${width.approve};}

    @media screen and (max-width: ${device['phone']}){
        display: none;
    }
`;

const Main = styled.div`
    height: 65px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

// For Mobile
const DataRowForMobile = styled.div`
    min-height: 80px;
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

const UnitRowForMobile = styled.div`
    display: flex;
    justify-content: space-between;
    &>div.left {
        width: 60%;
    }
    &>div.right {
        p {
            text-align: right;
        }
    }
`;