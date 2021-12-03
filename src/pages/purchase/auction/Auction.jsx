import React, { useState, useEffect } from "react"
import Slider from 'rc-slider';
import Modal from 'react-modal';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Header from "./../../../components/common/header";
import { getSecTomorrow, numberWithLength } from "./../../../utilities/number"
import { AuctionLeft, AuctionRight, Title, TableContainer, SliderContainer, TimeBar, TotalPrice, BuyButton } from "./styledComponents";
import "./style.scss";

const modalDesc = {
    signDesc: [
        "To buy please sign in or sign up for an account.",
        "To buy for more than 2000 CHF worth, please sign in or create an account and complete the KYC identity verification.",
        "To buy more than 100,000 CHF worth, please sign in or create an account and complete the AML identity verification."
    ],
    verifyDesc: [
        "To buy more than 2000 CHF worth, please complete the KYC identity verification.",
        "To buy more than 100,000 CHF worth, please complete the AML identity verification."
    ]
};

const Auction = () => {
    const duration = 86400;
    const [curTime, setCurTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const distanceToDate = getSecTomorrow();
    const percentage = (distanceToDate / duration) * 100;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showSelect, setShowSelect] = useState(false);

    const auth = {
        isSigned: true,
        isKYCVerified: false,
        isAMLVerified: false
    };

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

    const handleBuyToken = () => {
        if(!auth.isSigned) {
            setModalIsOpen(true);
        } else if(amount >= 100000) {
            if(!auth.isAMLVerified) {
                setModalIsOpen(true);
            } else {
                return null;
            }
        } else if(amount >=2000) {
            if(!auth.isKYCVerified) {
                setModalIsOpen(true);
            } else {
                return null;
            }
        }
    };

    const renderModalContent = () => {
        if(!auth.isSigned) {
            return (
                <>
                    <p className="description">
                        {
                            amount >= 100000? modalDesc.signDesc[2]: (amount >= 2000? modalDesc.signDesc[1]: modalDesc.signDesc[0])
                        }
                    </p>
                    <div className="btnDiv">
                        <Link to="/signup">
                            <p className="blackbtn">Sign Up</p>
                        </Link>
                        <Link to="/signin">
                            <p className="greenbtn">Sign In</p>
                        </Link>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <p className="description">
                        {
                            amount >= 100000? modalDesc.verifyDesc[1]: (amount >= 2000? modalDesc.verifyDesc[0]: "")
                        }
                    </p>
                    <div className="btnDiv">
                        <Link to="#">
                            <p onClick={() => setModalIsOpen(false)} className="blackbtn">Go back</p>
                        </Link>
                        <Link to={`${amount >= 100000? "/aml_verify": (amount >= 2000? "/kyc_verify": "")}`}>
                            <p className="greenbtn">Verify</p>
                        </Link>
                    </div>
                </>
            );
        }
    };

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
                            <Title style={{margin: '5px 0'}}>amount of Token</Title>
                            <SliderContainer>
                                <span className="max">Maximum 10</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="range-input"
                                    min={0}
                                    max={100000}
                                />
                                <Slider
                                    value={amount}
                                    onChange={(value) => setAmount(value)}
                                    min={0}
                                    max={100000}
                                    step={1}
                                />
                            </SliderContainer>
                            <TotalPrice>
                                <Title className="totalPrice">total price</Title>
                                <div className="price">{price}</div>
                            </TotalPrice>   
                            <BuyButton onClick={handleBuyToken}>
                                BUY
                            </BuyButton>                        
                        </div>
                    </AuctionRight>
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    ariaHideApp={false}
                    className="signVerify-modal"
                    overlayClassName="signVerify-modal__overlay"
                >
                    <span className="close">
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="text-white modal-close"
                            onClick={() => setModalIsOpen(false)}
                            onKeyDown={() => setModalIsOpen(false)}
                            role="button"
                            tabIndex="0"
                        />
                    </span>    
                    {renderModalContent()}
                </Modal>
            </section>
        </main>
    );
};

export default Auction;