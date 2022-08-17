import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import Modal from "react-modal"
import { useDispatch } from "react-redux"
import { navigate } from "gatsby"
import { useMutation } from "@apollo/client"
import NumberFormat from "react-number-format"

import { useAuction } from "../../providers/auction-context"
import { setBidInfo, setCurrentRound } from "../../redux/actions/bidAction"

import { CloseIcon } from "../../utilities/imgImport"
import { ROUTES } from "../../utilities/routes"
import { INCREASE_BID, PLACE_BID } from "../../apollo/graphqls/mutations/Bid"
import CustomSpinner from "../common/custom-spinner"

export default function AuctionPlaceBidModal() {
    const currency = useSelector(state => state.favAssets.currency);
    const currencyRates = useSelector(state => state.currencyRates);
    const currencyRate = currencyRates[currency.value]?? 1;

    // Containers
    const auction = useAuction()
    const dispatch = useDispatch()
    const { optCurrentRound, isBid, getBid } = auction
    const [amount, setAmount] = useState(1)
    const [price, setPrice] = useState(optCurrentRound?.minPrice)
    const [preAmount, setPreAmount] = useState(1);
    const [prePrice, setPrePrice] = useState(1);
    const [error, setError] = useState("")
    const [reqPending, setReqPending] = useState(false)

    // Webservice
    const [placeBid] = useMutation(PLACE_BID, {
        onCompleted: () => {
            navigate(ROUTES.payment)
            setReqPending(false)
            auction.setBidModal(false)
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
            auction.setBidModal(false)
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
        if (getBid)
            if (Object.keys(getBid).length !== 0) {
                setPrice(isBid ? optCurrentRound?.placeBid : getBid.tokenPrice)
                setAmount(isBid ? 1 : getBid.tokenAmount)
                if(!isBid) {
                    setPreAmount(getBid.tokenAmount)
                    setPrePrice(getBid.tokenPrice)
                }
            }
    }, [getBid, optCurrentRound?.placeBid, isBid])

    // Render
    return (
        <Modal
            isOpen={auction.bidModal}
            onRequestClose={() => auction.setBidModal(false)}
            ariaHideApp={false}
            className="place-bid"
            overlayClassName="place-bid__overlay"
        >
            <div className="tfa-modal__header">
                <div
                    onClick={() => auction.setBidModal(false)}
                    onKeyDown={() => auction.setBidModal(false)}
                    role="button"
                    tabIndex="0"
                >
                    <img
                        width="14px"
                        height="14px"
                        src={CloseIcon}
                        alt="close"
                    />
                </div>
            </div>
            <div className="tablet-view">
                {error && (
                    <div className="mt-1 mb-4">
                        <div className="d-flex align-items-center gap-2 text-start">
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
                <h4 className="range-label text-start mb-0">amount of Token</h4>
                <NumberFormat className="range-input"
                    value={amount}
                    onValueChange={values => setAmount(values.value)}
                    isAllowed={({ floatValue }) => floatValue >= 1 && floatValue <= optCurrentRound?.totalToken}
                    thousandSeparator={true}
                    decimalScale={0}
                    allowNegative={false}
                />
                <h4 className="range-label text-start mb-0">Per token price (USD)</h4>
                <NumberFormat className="range-input"
                    value={price}
                    onValueChange={values => setPrice(values.value? values.value: optCurrentRound?.minPrice)}
                    isAllowed={({ floatValue }) => floatValue >= optCurrentRound?.minPrice}
                    thousandSeparator={true}
                    decimalScale={4}
                    allowNegative={false}
                    placeholder="Type the price per Token Here"
                />
                <h4 className="range-label text-start mb-0">Total price <span className="txt-green">({currency.value})</span></h4>
                <NumberFormat
                    className="total-input"
                    value={Math.round(Number(Math.max(optCurrentRound?.minPrice, price * amount * currencyRate)).toFixed(3) * 10**3) / 10**3}
                    thousandSeparator={true}
                    displayType='text'
                    allowNegative={false}
                    renderText={(value, props) => <p {...props}>{value}</p>}
                />
                <div className="text-center mb-3" style={{height: 20, fontWeight: 600}}>
                    {currency.label !== 'USD'?
                        <NumberFormat
                            className="txt-green"
                            value={Math.round(Number(Math.max(optCurrentRound?.minPrice, price * amount)).toFixed(3) * 10**3) / 10**3}
                            thousandSeparator={true}
                            displayType='text'
                            allowNegative={false}
                            renderText={(value, props) => <span {...props}>{value} USD</span>}
                        />: ''
                    }
                </div>
                <button
                    className="btn btn-outline-light rounded-0 fw-bold w-100 fs-20px py-3 text-uppercase"
                    onClick={() => bidMutation()}
                    disabled={reqPending}
                >
                    <div className="d-flex align-items-center justify-content-center gap-3">
                        {reqPending && <CustomSpinner />}
                        {auction.isBid ? "Place Bid" : "Increase Bid"}
                    </div>
                </button>
            </div>
        </Modal>
    )
}
