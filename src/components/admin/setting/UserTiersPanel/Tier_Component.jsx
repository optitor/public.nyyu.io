import React from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import NumberFormat from 'react-number-format';
import { device } from '../../../../utilities/device';

const TierComponent = ({tier = {}}) => {
    return (
        <>
            <Container className='component'>
                <div className='image'>
                    <img src={tier.image} alt={tier.name} />
                </div>
                <div className='name'>
                    <p>{tier.name}</p>
                </div>
                <div className='threshold'>
                    <NumberFormat
                        value={tier.threshold}
                        displayType={'text'}
                        thousandSeparator={true}
                        renderText={(value, props) => <p {...props}>{value}</p>}
                    />
                    <p><span><Icon icon="clarity:note-edit-line" /></span></p>
                </div>
            </Container>
        </>
    );
};

export default TierComponent;

const Container = styled.div`
    min-height: 75px;
    border-bottom: 1px solid #464646;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &>div.image {
        width: 7%;
        img {
            width: 45px;
            height: 45px;
            display: block;
            margin: auto;
        }
    }
    &>div.name {
        width: 43%;
    }
    &>div.threshold {
        width: 50%;
        display: flex;
        justify-content: space-between;
        padding-right: 2%;
        p span {
            font-size: 22px;
            color: #23c865;
            cursor: pointer;
        }
    }
    @media screen and (max-width: ${device['laptop-md']}){
        &>div.image {width: 10%}
        &>div.name {width: 40%}
        &>div.threshold {
            width: 10%
            p span {
                font-size: 18px;
            }
        }
    }
    @media screen and (max-width: ${device['tablet']}){
        &>div.image {width: 12%}
        &>div.name {width: 38%}
    }
    @media screen and (max-width: ${device['phone']}){
        border-left: 1px solid #464646;
        border-right: 1px solid #464646;
        &>div.image {
            width: 15%;
            img {
                width: 30px;
                height: 30px;
            }
        }
        &>div.name {width: 45%;}
        &>div.threshold {width: 40%;}
    }
`;
