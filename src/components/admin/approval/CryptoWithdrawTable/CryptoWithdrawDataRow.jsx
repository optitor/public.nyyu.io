import React, { useState } from 'react';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import { Icon } from '@iconify/react';
import { device } from '../../../../utilities/device';
import { width } from './columnWidth';
// import ApproveBankDepositModal from './ApproveBankDepositModal';

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
                renderText={(value, props) => <span {...props}>{value} {unit}</span>}
            />
        );
    }

    return (
        <>
            <DataRow>
                <div className='email'>
                    <Main>
                        <p>{datum.email? datum.email: <span className='text-danger'>Deleted User</span>}</p>
                    </Main>
                </div>
                <div className='sourceToken'>
                    <Main>
                        <p>Source Token: {datum.sourceToken}</p>
                        <p>Token Price: {datum.tokenPrice}</p>
                        <p>Network: {datum.network}</p>
                    </Main>
                </div>
                <div className='amount'>
                    <Main>
                        <p>Withdraw: {renderNumberFormat(datum.withdrawAmount)}</p>
                        <p>Fee: {renderNumberFormat(datum.fee)}</p>
                        <p>Token: {renderNumberFormat(datum.tokenAmount)}</p>
                    </Main>
                </div>
                <div className='destination'>
                    <Main>
                        <p>{datum.destination}</p>
                    </Main>
                </div>
                <div className='time'>
                    <Main>
                        <p>{new Date(datum.requestedAt).toDateString()}</p>
                        <p>{new Date(datum.requestedAt).toLocaleTimeString()}</p>
                    </Main>
                </div>
                <div className='approve'>
                    <Main>
                        {datum.status?
                            <p className='text-green text-center' style={{fontSize: 30}}>
                                <Icon icon='line-md:confirm-circle' style={{cursor: 'unset'}} />
                            </p>:
                            <button className='text-warning bg-transparent border-0' onClick={() => setIsApproveOpen(true)}
                                disabled={!datum.email}
                            >Approve</button>
                        }
                    </Main>
                </div>
            </DataRow>
            <DataRowForMobile>
                <div>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p style={{fontSize: 16, fontWeight: 700, color: 'white'}}>User's email</p>
                            <p style={{color: 'white'}}>{datum.email}</p>
                        </div>
                        <div className='right'>
                            {datum.status?
                                <p className='text-green text-center' style={{fontSize: 30}}>
                                    <Icon icon='line-md:confirm-circle' style={{cursor: 'unset'}} />
                                </p>:
                                <button className='text-warning bg-transparent border-0' onClick={() => setIsApproveOpen(true)}
                                    disabled={!datum.email}
                                >Approve</button>
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
                            <p>Source Token</p>
                        </div>
                        <div className='right'>
                            <p>{datum.sourceToken}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Token Price</p>
                        </div>
                        <div className='right'>
                            <p>{datum.tokenPrice}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Network</p>
                        </div>
                        <div className='right'>
                            <p>{datum.network}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Withdraw Amount</p>
                        </div>
                        <div className='right'>
                            <p>{renderNumberFormat(datum.withdrawAmount)}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Fee</p>
                        </div>
                        <div className='right'>
                            <p>{renderNumberFormat(datum.fee)}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Token Amount</p>
                        </div>
                        <div className='right'>
                            <p>{renderNumberFormat(datum.tokenAmount)}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Destination</p>
                        </div>
                        <div className='right'>
                            <p>{renderNumberFormat(datum.destination)}</p>
                        </div>
                    </UnitRowForMobile>
                    <UnitRowForMobile>
                        <div className='left'>
                            <p>Request Time</p>
                        </div>
                        <div className='right'>
                            <p>{new Date(datum.requestedAt).toDateString()}</p>
                            <p>{new Date(datum.requestedAt).toLocaleTimeString()}</p>
                        </div>
                    </UnitRowForMobile>
                </div>
            </DataRowForMobile>
            {/* {isApproveOpen && <ApproveBankDepositModal isOpen={isApproveOpen} setIsOpen={setIsApproveOpen} datum={datum} />} */}
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


    &>div.email {width: ${width.email}; padding-left: 16px;}
    &>div.sourceToken {width: ${width.sourceToken};}
    &>div.amount {width: ${width.amount};}
    &>div.destination {width: ${width.destination};}
    &>div.time {width: ${width.time};}
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