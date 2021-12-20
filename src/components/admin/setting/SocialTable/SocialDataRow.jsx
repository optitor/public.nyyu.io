import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { device } from '../../../../utilities/device';
import { width } from './columnWidth';

const SocailDataRow = ({datum}) => {
    const [show, setShow] = useState(false);
    return (
        <>
            <DataRow>
                <div className='social'>
                    <Main>
                        <p style={{fontSize: 16, fontWeight: '700'}}>{datum.social}</p>
                    </Main>
                </div>
                <div className='key'>
                    <Main>
                        <p>API Key</p>
                    </Main>
                </div>
                <div className='secret'>
                    <Main>
                        <p>API Secret</p>
                    </Main>
                </div>
            </DataRow>
            <DataRowForMobile>
                <div onClick={() => setShow(!show)} onKeyDown={() => setShow(!show)} aria-hidden="true">
                    <LayoutForMobile>
                        <div className='left'>
                            <p className='text-white' style={{fontSize: 16, fontWeight: '700'}}>{datum.social}</p>
                        </div>
                        <div className='right'>
                            <p style={{fontSize: 16}}>
                                {show? <span><Icon icon="ant-design:caret-up-filled" /></span>: <span><Icon icon="ant-design:caret-down-filled" /></span>}
                            </p>
                        </div>
                    </LayoutForMobile>
                </div>
                <ToggleForMobile show={show}>
                    <LayoutForMobile>
                        <div className='left'>
                            <p style={{color: 'dimgrey'}}>Key</p>
                        </div>
                        <div className='right'>
                            <p>API Key</p>
                        </div>
                    </LayoutForMobile>
                    <LayoutForMobile>
                        <div className='left'>
                            <p style={{color: 'dimgrey'}}>Secret</p>
                        </div>
                        <div className='right'>
                            <p>API Secret</p>
                        </div>
                    </LayoutForMobile>
                </ToggleForMobile>
            </DataRowForMobile>
        </>
    );
};

export default SocailDataRow;

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

    &>div.social {width: ${width.social}; padding-left: 16px;}
    &>div.key {width: ${width.key};}
    &>div.secret {width: ${width.secret};}  

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
    min-height: 50px;
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
        width: 60%;
    }
    &>div.right {
        p {
            text-align: right;            
        }
    }
`;