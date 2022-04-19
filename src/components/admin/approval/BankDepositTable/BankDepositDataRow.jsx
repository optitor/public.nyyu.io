import React, { useState } from 'react';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import { Icon } from '@iconify/react';
import { device } from '../../../../utilities/device';
import { width } from './columnWidth';
import ApproveBankDepositModal from './ApproveBankDepositModal';

const RoundDataRow = ({ datum }) => {
    const [show, setShow] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);

    const renderNumberFormat = (value, unit = '') => {
        return (
            <NumberFormat
                value={value}
                displayType={'text'}
                thousandSeparator={true}
                decimalScale={4}
                renderText={(value, props) => <p {...props}>{value} {unit}</p>}
            />
        );
    }

    return (
        <>
            <DataRow>
                <div className='reference'>
                    <Main>
                        <p>{datum.uid}</p>
                    </Main>
                </div>
                <div className='email'>
                    <Main>
                        <p>{datum.email}</p>
                    </Main>
                </div>
                <div className='amount'>
                    <Main>
                        {renderNumberFormat(datum.amount, datum.fiatType)}
                    </Main>
                </div>
                <div className='usdAmount'>
                    <Main>
                        {renderNumberFormat(datum.usdAmount)}
                    </Main>
                </div>
                <div className='fee'>
                    <Main>
                        {renderNumberFormat(datum.fee)}
                    </Main>
                </div>
                <div className='deposited'>
                    <Main>
                        {renderNumberFormat(datum.deposited)}
                    </Main>
                </div>
                <div className='approve'>
                    <Main>
                        {datum.status?
                            <p className='text-green text-center' style={{fontSize: 30}}>
                                <Icon icon='line-md:confirm-circle' style={{cursor: 'unset'}} />
                            </p>:
                            <button className='text-warning bg-transparent border-0' onClick={() => setIsApproveOpen(true)}>Approve</button>
                        }
                    </Main>
                </div>
            </DataRow>
            <DataRowForMobile>
                <div>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p style={{fontSize: 16, fontWeight: 700, color: 'white'}}>Reference</p>
                            <p style={{color: 'white'}}>{datum.uid}</p>
                        </div>
                        <div className='right'>
                            {datum.status?
                                <p className='text-green text-center' style={{fontSize: 30}}>
                                    <Icon icon='line-md:confirm-circle' style={{cursor: 'unset'}} />
                                </p>:
                                <button className='text-warning bg-transparent border-0' onClick={() => setIsApproveOpen(true)}>Approve</button>
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
                            <p>{datum.email}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Deposit Amount</p>
                        </div>
                        <div className='right'>
                            {renderNumberFormat(datum.amount, datum.fiatType)}
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>USD Amount</p>
                        </div>
                        <div className='right'>
                            {renderNumberFormat(datum.usdAmount)}
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Fee (USD)</p>
                        </div>
                        <div className='right'>
                            {renderNumberFormat(datum.fee)}
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Deposited (USD)</p>
                        </div>
                        <div className='right'>
                            {renderNumberFormat(datum.deposited)}
                        </div>
                    </UnitRowForMobile>
                </div>
            </DataRowForMobile>
            {isApproveOpen && <ApproveBankDepositModal isOpen={isApproveOpen} setIsOpen={setIsApproveOpen} datum={datum} />}
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