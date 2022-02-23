import React from "react"
import Slider from "rc-slider"
import { useAuction } from "./auction-context"
import { Currencies } from "../../utilities/staticData"
import { navigate } from "gatsby"
import { numberWithCommas } from "../../utilities/number"
import { INCREASE_BID, PLACE_BID } from "../../apollo/graghqls/mutations/Bid"
import { useMutation } from "@apollo/client"
import { setBidInfo, setCurrentRound } from "../../redux/actions/bidAction"
import { useState } from "react"
import { ROUTES } from "../../utilities/routes"
import { useDispatch } from "react-redux"

export default function AuctionPlaceBid() {
    // Containers
    const auction = useAuction()
    const dispatch = useDispatch()
    const { auctions, currentRoundNumber } = auction
    const current = auctions?.filter(
        (auction) => auction.round === currentRoundNumber
    )[0]
    const [amount, setAmount] = useState(1)
    const [price, setPrice] = useState(current.minPrice)
    const [error, setError] = useState("")
    const [reqPending, setReqPending] = useState(false)

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
                    roundId: current.id,
                    tokenAmount: amount,
                    tokenPrice: price,
                    payment: 1,
                    cryptoType: "BTC",
                },
            })
        } else {
            increaseBid({
                variables: {
                    roundId: current.id,
                    tokenAmount: amount,
                    tokenPrice: price,
                    payment: 1,
                    cryptoType: "BTC",
                },
            })
        }
        dispatch(setBidInfo(Number(price * amount)))
        dispatch(setCurrentRound(current.id))
    }

    // Render
    return (
        <>
            {current.endedAt < new Date().getTime() ? (
                <div className="d-sm-flex d-none text-light fw-bold fs-24px text-uppercase w-100 align-items-center justify-content-center h-85">
                    round is over
                </div>
            ) : !auction.currentRoundBidList ? (
                <></>
            ) : (
                <div className="place-bid">
                    <h3 className="range-label">amount of token</h3>
                    <div className="d-flex align-items-center mb-4">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="range-input"
                        />
                        <Slider
                            value={amount}
                            onChange={(value) => setAmount(value)}
                            min={1}
                            max={100}
                            step={1}
                        />
                    </div>
                    <h3 className="range-label">per token price</h3>
                    <div className="d-flex align-items-center mb-4">
                        <input
                            type="number"
                            value={price}
                            onChange={(value) => setPrice(value)}
                            className="range-input"
                        />
                        <Slider
                            value={price}
                            onChange={(value) => setPrice(value)}
                            min={current.minPrice}
                            max={10000}
                            step={100}
                        />
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="range-label mb-0">Total price</span>
                        <input
                            className="total-input"
                            type="text"
                            value={numberWithCommas(
                                Number(
                                    Math.max(current.minPrice, price * amount),
                                    " "
                                )
                            )}
                            readOnly
                        />
                        <h3 className="symbol-label">{Currencies[0].label}</h3>
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
                                    class="icon-23px text-danger"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <p className="text-danger text-capitalize fw-500 text-[#959595]">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        className="btn btn-outline-light rounded-0 text-uppercase w-100 fw-bold py-12px fs-20px"
                        onClick={() => {
                            bidMutation()
                        }}
                        disabled={reqPending}
                    >
                        {reqPending
                            ? "processing..."
                            : auction.isBid
                            ? "Place Bid"
                            : "Increase Bid"}
                    </button>
                </div>
            )}
        </>
    )
}
