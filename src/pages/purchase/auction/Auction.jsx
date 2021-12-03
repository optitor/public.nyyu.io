import React, { useState, useEffect } from "react"
import Slider from 'rc-slider';
import Header from "./../../../components/common/header";
import { getSecTomorrow, numberWithLength } from "./../../../utilities/number"
import { AuctionLeft, AuctionRight, Title, TableContainer, SliderContainer, TimeBar, TotalPrice, BuyButton } from "./styledComponents";
import "./style.scss";

const Auction = () => {
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
                                    {numberWithLength(curTime.hours, 2)} : {numberWithLength(curTime.minutes, 2)} : {numberWithLength(curTime.seconds, 2)}
                                </span>
                                <span className="pointer" style={{left: percentage * 0.8 + 9 + "%"}}></span>
                                <div className="progress-bar"
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
                            <table className="table">
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
                        <Title>Exclusive pre round</Title>
                        <div className="tokenDiv">
                            <Title><span className="txt-green">100 USD</span> per token</Title>
                            <Title>amount of Token</Title>
                            <SliderContainer>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="range-input"
                                    min={0}
                                    max={10}
                                />
                                <Slider
                                    value={amount}
                                    onChange={(value) => setAmount(value)}
                                    min={0}
                                    max={10}
                                    step={0.1}
                                />
                            </SliderContainer>
                            <TotalPrice>
                                <Title className="totalPrice">total price</Title>
                                <div className="price">{price}</div>
                            </TotalPrice>   
                            <BuyButton className="w-100">
                                BUY
                            </BuyButton>                        
                        </div>
                    </AuctionRight>
                </div>
            </section>
        </main>
    );
};

export default Auction;