import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Slider from "rc-slider"
import { navigate } from "gatsby"
import { useMutation } from "@apollo/client"
import NumberFormat from 'react-number-format'
import { useAuction } from "../../providers/auction-context"
import { setBidInfo, setCurrentRound } from "../../redux/actions/bidAction"

import CustomSpinner from "../common/custom-spinner"
import { ROUTES } from "../../utilities/routes"
import { INCREASE_BID, PLACE_BID } from "../../apollo/graphqls/mutations/Bid"

const initialMaxPrice = 100

export default function AuctionPlaceBid() {
    const currency = useSelector(state => state.placeBid.currency);
    const currencyRates = useSelector(state => state.currencyRates);
    const currencyRate = currencyRates[currency.value]?? 1;

    // Containers
    const auction = useAuction();
    const dispatch = useDispatch()
    const { optCurrentRound, getBid, isBid } = auction
    const [amount, setAmount] = useState(1)
    const [price, setPrice] = useState(optCurrentRound?.minPrice)
    const [error, setError] = useState("")
    const [reqPending, setReqPending] = useState(false)
    const [preAmount, setPreAmount] = useState(1)
    const [prePrice, setPrePrice] = useState(1)
    const [maxPrice, setMaxPrice] = useState(initialMaxPrice)

    // Webservice
    const [placeBid] = useMutation(PLACE_BID, {
        onCompleted: () => {
            navigate(ROUTES.payment)
            setReqPending(false)
        },
        onError: (err) => {
            setError(err.message)
            setReqPending(false)
        },
    })
    const [increaseBid] = useMutation(INCREASE_BID, {
        onCompleted: () => {
            navigate(ROUTES.payment)
            setReqPending(false)
        },
        onError: (err) => {
            setError(err.message)
            setReqPending(false)
        },
    })

    // Methods
    const bidMutation = () => {
        setReqPending(true)
        setError("")
        if (auction.isBid) {
            placeBid({
                variables: {
                    roundId: optCurrentRound?.id,
                    tokenAmount: amount,
                    tokenPrice: price,
                },
            })
            dispatch(setBidInfo(Number(price * amount)))
        } else {
            increaseBid({
                variables: {
                    roundId: optCurrentRound?.id,
                    tokenAmount: amount,
                    tokenPrice: price,
                },
            })
            dispatch(setBidInfo(Number(price * amount - prePrice * preAmount)))
        }
        dispatch(setCurrentRound(optCurrentRound?.id))
    }

    useEffect(() => {
        if (price === maxPrice) {
            setTimeout(() => setMaxPrice(2*maxPrice), 200)
        }
    }, [price])

    useEffect(() => {
        if (getBid)
            if (Object.keys(getBid).length !== 0) {
                setPrice(isBid ? optCurrentRound.placeBid : getBid.tokenPrice)
                setAmount(isBid ? 1 : getBid.tokenAmount)
                if(!isBid) {
                    setPreAmount(getBid.tokenAmount)
                    setPrePrice(getBid.tokenPrice)
                }
            }
    }, [getBid, optCurrentRound?.placeBid, isBid])

    // Render
    return (
        <>
            {optCurrentRound?.status === 3 ? (
                <div className="d-sm-flex d-none text-light fw-bold fs-24px text-uppercase w-100 align-items-center justify-content-center h-85">
                    round is over
                </div>
            ) : optCurrentRound?.status === 1 ? <div className="d-sm-flex d-none text-light fw-bold fs-24px text-uppercase w-100 align-items-center justify-content-center h-85">
                countdown
            </div> : !auction.currentRoundBidList ? (
                <></>
            ) : (
                <div className="place-bid">
                    <h3 className="range-label">amount of token</h3>
                    <div className="d-flex align-items-center mb-4">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value ? e.target.value : 1)
                            }
                            className="range-input"
                            min={1}
                        />
                        <Slider
                            value={amount}
                            onChange={(value) => setAmount(value)}
                            min={1}
                            max={optCurrentRound.totalToken}
                            step={1}
                        />
                    </div>
                    <h3 className="range-label">per token price (USD)</h3>
                    <div className="d-flex align-items-center mb-4">
                        <input
                            type="number"
                            value={price}
                            onChange={(e) =>
                                setPrice(
                                    e.target.value
                                        ? e.target.value
                                        : optCurrentRound?.minPrice
                                )
                            }
                            className="range-input"
                            min={optCurrentRound?.minPrice}
                        />
                        <Slider
                            value={price}
                            onChange={(value) => setPrice(value)}
                            min={optCurrentRound?.minPrice}
                            max={maxPrice}
                            step={0.001}
                        />
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-12 range-label">
                            <div className="h-100 d-flex align-items-center">Total price</div>
                        </div>
                        <div className="col-lg-8 col-md-12">
                            <div className="d-flex align-items-center justify-content-end">
                                <NumberFormat
                                    className="total-input"
                                    value={Math.round(Number(Math.max(optCurrentRound?.minPrice, price * amount * currencyRate)).toFixed(3) * 10**3) / 10**3}
                                    thousandSeparator={true}
                                    displayType='text'
                                    allowNegative={false}
                                    renderText={(value, props) => <span {...props}>{value}</span>}
                                />
                                <h3 className="symbol-label">{currency.label}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-8px" style={{height: 20, fontWeight: 600}}>
                        {currency.label !== 'USD'?
                            <NumberFormat
                                className="text-green"
                                value={Math.round(Number(Math.max(optCurrentRound?.minPrice, price * amount)).toFixed(3) * 10**3) / 10**3}
                                thousandSeparator={true}
                                displayType='text'
                                allowNegative={false}
                                renderText={(value, props) => <span {...props}>{value} USD</span>}
                            />: ''
                        }
                    </div>
                    <div className="mt-3 mb-1">
                        <p className="text-secondary fw-500 text-[#959595]">
                            Audited by CertiK
                        </p>
                    </div>
                    {error && (
                        <div className="mt-1 mb-2">
                            <div className="d-flex align-items-center gap-2">
                                <svg
                                    className="icon-23px text-danger"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-danger fw-500 text-[#959595]">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        className="btn btn-outline-light rounded-0 text-uppercase w-100 fw-bold py-12px fs-20px"
                        onClick={bidMutation}
                        disabled={reqPending}
                    >
                        <div className="d-flex align-items-center justify-content-center gap-3">
                            {reqPending && <CustomSpinner />}
                            {auction.isBid ? "Place Bid" : "Increase Bid"}
                        </div>
                    </button>
                </div>
            )}
        </>
    )
}
