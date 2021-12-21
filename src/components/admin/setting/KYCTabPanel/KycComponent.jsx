import React from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { device } from '../../../../utilities/device';

const KycComponent = () => {
    return (
        <Container className='component'>
            <div className='icon'>
                <p><span><Icon icon="fe:upload" /></span></p>
            </div>
            <div className='topic'>
                <p>Withdraw</p>
            </div>
            <div className='content'>
                <p>Threshold: 1000</p>
            </div>
            <div className='edit'>
                <p><span><Icon icon="clarity:note-edit-line" /></span></p>
            </div>
        </Container>
    )
};

export default KycComponent;

const Container = styled.div`
    min-height: 75px;
    border-bottom: 1px solid #464646;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &>div.icon {
        width: 7%;
        p {
            text-align: center;
            span {
                font-size: 30px;
            }
        }
    }
    &>div.topic {
        width: 50%;
    }
    &>div.content {
        width: 35%;
    }
    &>div.edit {
        width: 7%;
        p {
            text-align: center;
            span {
                font-size: 22px;
                color: #23c865;
                cursor: pointer;
            }
        }
    }
    & p {
        font-size: 18px;
        font-weight: 700;
    }
    @media screen and (max-width: ${device['tablet']}){
        &>div.icon {
            width: 10%;}
        &>div.topic {width: 50%}
        &>div.content {width: 30%}
        &>div.edit {width: 10%}
    }
    @media screen and (max-width: ${device['phone']}){
        border-left: 1px solid #464646;
        border-right: 1px solid #464646;
        &>div.icon {width: 17%;}
        &>div.topic {display: none;}
        &>div.content {width: 65%}
        &>div.edit {width: 18%}
    }
`;