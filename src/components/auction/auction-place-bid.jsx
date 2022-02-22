import React from "react"
import Slider from "rc-slider"
import { useAuction } from "./auction-context"
import { Currencies } from "../../utilities/staticData"
import { navigate } from "gatsby"
import { numberWithCommas } from "../../utilities/number"
import { PLACE_BID } from "../../apollo/graghqls/mutations/Bid"
import { useMutation } from "@apollo/client"
import { setBidInfo, setCurrentRound } from "../../redux/actions/bidAction"
import { useState } from "react"
import { ROUTES } from "../../utilities/routes"
import { useDispatch } from "react-redux"

export default function AuctionPlaceBid({ isBid }) {
    // Containers
    const auction = useAuction()
    const dispatch = useDispatch()
    const { auctions, currentRoundNumber } = auction
    const current = auctions?.filter(
        (auction) => auction.round === currentRoundNumber
    )[0]
    const [amount, setAmount] = useState(1)
    const [price, setPrice] = useState(current.minPrice)

    // Webservice
    const [PlaceBid] = useMutation(PLACE_BID, {
        onError: (err) => console.log(err),
    })

    // Methods
    const bidMutation = () => {
        PlaceBid({
            variables: {
                roundId: current.id,
                tokenAmount: amount,
                tokenPrice: price,
                payment: 1,
                cryptoType: "BTC",
            },
        })
        dispatch(setBidInfo(Number(Math.max(current.minPrice, price * amount))))
        dispatch(setCurrentRound(current.id))
        navigate(ROUTES.payment)
    }

    // Render
    return (
        <>
            {current.endedAt < new Date().getTime() ? (
                <div className="d-sm-flex d-none text-light fw-bold fs-24px text-uppercase w-100 align-items-center justify-content-center h-90">
                    round is over
                </div>
            ) : (
                <div className={`place-bid ${isBid && "d-none"}`}>
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
                    <div className="mt-3 mb-2">
                        <p className="text-secondary fw-500 text-[#959595]">
                            Audited by CertiK
                        </p>
                    </div>
                    <button
                        className="btn-primary text-uppercase w-100"
                        onClick={() => {
                            bidMutation()
                        }}
                    >
                        {!isBid ? "Place Bid" : "Increase Bid"}
                    </button>
                </div>
            )}
        </>
    )
}
