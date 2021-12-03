import React, { useState, useEffect } from "react"
import styled from "styled-components";
import "./style.scss";
import Header from "./../../../components/common/header";
import { getSecTomorrow, numberWithLength } from "./../../../utilities/number"


const Auction = () => {
    const [tabIndex, setTabIndex] = useState(0)
    const duration = 86400
    const [curTime, setCurTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    const [amount, setAmount] = useState(0)
    const [price, setPrice] = useState(0)
    const distanceToDate = getSecTomorrow()
    const percentage = (distanceToDate / duration) * 100

    useEffect(() => {
        const id = setInterval(() => {
            setCurTime({
                hours: parseInt(getSecTomorrow() / (60 * 60)),
                minutes: parseInt((getSecTomorrow() % (60 * 60)) / 60),
                seconds: parseInt(getSecTomorrow() % 60),
            })
        }, 1000)
        return () => {
            clearInterval(id)
        }
    }, [])

    return (
        <main className="purchaseAuction-page">
            <Header />
            <section className="container">
                <div className="row">
                    <AuctionLeft className="col-md-5">
                        <Title>Next round starts In</Title>
                        <TimeBar>
                            <div className="progress">
                                <span className="time" style={{left: percentage * 0.8 + "%"}}>
                                    {`${numberWithLength(curTime.hours, 2)} : ${numberWithLength(curTime.minutes, 2)} : ${numberWithLength(curTime.seconds, 2)}`}
                                </span>
                                <span className="pointer" style={{left: percentage * 0.8 + 9 + "%"}}></span>
                                <div class="progress-bar"
                                    style={{
                                        width: percentage + "%",
                                        background:
                                            "linear-gradient(270deg, #941605 60%, #de4934 86.3%)",
                                        transform: "rotate(-180deg)",
                                    }}
                                ></div>
                            </div>
                        </TimeBar>
                        <TableContainer>
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td className="item">Token Left</td>
                                        <td className="quantity">100</td>
                                    </tr>
                                    <tr>
                                        <td className="item">Token Sold For</td>
                                        <td className="quantity">100</td>
                                    </tr>
                                </tbody>
                            </table>
                        </TableContainer>                        
                    </AuctionLeft>
                    <AuctionRight className="col-md-7">

                    </AuctionRight>
                </div>
            </section>
        </main>
    )
}

export default Auction

const AuctionLeft = styled.div`
    height: 90vh;
    border-right: 2px solid #464646;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 768px) {
        border: none;
    }
`;

const AuctionRight = styled.div`
    height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.p`
    font-size: 30px;
    font-weight: 700;
    text-transform: uppercase;
    @media screen and (max-width: 1200px) {
        font-size: 24px;
    }
    @media screen and (max-width: 768px) {
        font-size: 20px;
    }
`;

const TimeBar = styled.div` 
    width: 100%;
    margin-top: 70px;
    margin-bottom: 50px;
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

const TableContainer = styled.div`
    width: 100%;
    padding: 0 10%;
`;