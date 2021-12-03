import styled from "styled-components";

export const AuctionLeft = styled.div`
    height: 90vh;
    border-right: 2px solid #464646;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1vw 0;
    @media screen and (max-width: 768px) {
        border: none;
        height: auto;
    }
`;

export const AuctionRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1vw 4vw;
    margin-bottom: 20px;
    &>div.tokenDiv {
        width: 100%;
        border: 1px solid #464646;
        padding: 12px 39px;
    }
    @media screen and (max-width: 768px) {
        height: auto;
        &>div.tokenDiv {
            padding: 0 10px;
        }
    }
`;

export const Title = styled.p`
    font-size: 28px;
    font-weight: 700;
    margin: 16px 0;
    text-transform: uppercase;
    @media screen and (max-width: 1200px) {
        font-size: 24px;
    }
    @media screen and (max-width: 768px) {
        font-size: 14px;
    }
`;

export const TimeBar = styled.div` 
    width: 100%;
    margin-top: 60px;
    margin-bottom: 40px;
    position: relative;
    &>div.progress {
        height: 12px;
        border-radius: 0;
        margin: 0 10%;
        overflow: visible;
    }
    & span.time {
        position: absolute;
        font-weight: 700;
        font-size: 18px;
        top: -50px;
        @media screen and (max-width: 768px) {
            font-size: 12px;
            top: -40px;
        }
    }
    & span.pointer {
        position: absolute;
        height: 25px;        
        top: -13px;
        border: 2px solid #de4934;
    }
`;

export const TableContainer = styled.div`
    width: 100%;
    padding: 0 10%;
`;

export const SliderContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    &>span.max {
        position: absolute;
        font-weight: 500;
        font-size: 14px;
        top: 30px;
        right: 0px;
    }
    &>input {
        padding: 8px 10px;
        background: #1e1e1e;
        border: 1px solid #ffffff;
        width: 87px;
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
        color: white;
        text-align: center;
        margin-right: 14px;
    
    }
    &>div.rc-slider {
        position: relative;
        height: 14px;
        padding: 5px 0;
        width: 100%;
        border-radius: 6px;
        touch-action: none;
        box-sizing: border-box;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    & div.rc-slider-rail {
        position: absolute;
        width: 100%;
        background-color: #e9e9e9;
        height: 4px;
        border-radius: 6px;    
    }
    & div.rc-slider-track {
        height: 5px;
        background-color: #23c865;
        position: absolute;
        border-radius: 6px;
    }
    & div.rc-slider-handle {
        width: 24px;
        height: 24px;
        border-color: #23c865;
        background-color: #23c865;
        margin-top: -10px;
    }
`;

export const TotalPrice = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 70px;
    &>.totalPrice {
        width: 40%;
        margin: 0;
        margin-right: 10%;
    }
    &>div.price {
        background: #1e1e1e;
        border: 1px solid #ffffff;
        width: 40%;
        height: 53px;
        font-weight: bold;
        font-size: 30px;
        color: white;
        text-align: center;
    }
    @media screen and (max-width: 768px) {
        &>div.price {
            width: 60%;
        }
    }
`

export const BuyButton = styled.button`
    color: white;
    background-color: transparent;
    border: 1px solid #ffffff;
    font-size: 30px;
    font-weight: 700;
    width: 100%;
    padding: 7px;
    margin: 35px 0;
    &:hover {
        color: #23c865;
        border: 1px solid #23c865;
    }
`