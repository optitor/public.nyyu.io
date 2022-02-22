import React, { useState } from "react"
import Slider from "rc-slider"
import Modal from "react-modal"
import { useAuction } from "./auction-context"
import { CloseIcon } from "../../utilities/imgImport"
import { numberWithCommas } from "../../utilities/number"
import { useDispatch } from "react-redux"
import { PLACE_BID } from "../../apollo/graghqls/mutations/Bid"
import { useMutation } from "@apollo/client"
import { ROUTES } from "../../utilities/routes"
import { Currencies } from "../../utilities/staticData"
import { setBidInfo, setCurrentRound } from "../../redux/actions/bidAction"
import { navigate } from "gatsby"

export default function AuctionPlaceBidModal({ isBid }) {
    // Containers
    const auction = useAuction()
    const dispatch = useDispatch()
    const { auctions, currentRoundNumber } = auction
    const current = auctions?.filter(
        (auction) => auction.round === currentRoundNumber
    )[0]
    const [amount, setAmount] = useState(1)
    const [price, setPrice] = useState(1)

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
            <div className="desktop-view">
                <h3 className="range-label">amount of Token</h3>
                <div className="d-flex align-items-center mb-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="range-input rounded-0"
                    />
                    <Slider
                        value={amount}
                        onChange={(value) => setAmount(value)}
                        min={1}
                        max={current.token}
                        step={1}
                    />
                </div>
                <h3 className="range-label">Per token price</h3>
                <div className="d-flex align-items-center mb-4">
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="range-input rounded-0"
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
                    <span className="range-label">Total price</span>
                    <input
                        className="total-input rounded-0"
                        type="text"
                        value={numberWithCommas(
                            Number(
                                Math.max(current.minPrice, price * amount),
                                ","
                            )
                        )}
                        readOnly
                    />
                    <h3 className="symbol-label">{Currencies[0].label}</h3>
                </div>
                <button
                    className="btn-primary text-uppercase w-100 mt-4"
                    onClick={() => {
                        auction.setBidModal(false)
                        bidMutation()
                    }}
                >
                    {!isBid ? "Place Bid" : "Increase Bid"}
                </button>
            </div>
            <div className="tablet-view">
                <h4 className="range-label">amount of Token</h4>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Type the Token Amount Here"
                    className="range-input"
                />
                <h4 className="range-label">Per token price</h4>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Type the price per Token Here"
                    className="range-input"
                />
                <h4 className="range-label">Total price</h4>
                <input
                    className="total-input"
                    type="text"
                    value={numberWithCommas(
                        Number(Math.max(current.minPrice, price * amount), ",")
                    )}
                    readOnly
                />
                <button
                    className="btn-primary text-uppercase"
                    onClick={() => {
                        bidMutation()
                        auction.setBidModal(false)
                    }}
                >
                    {!isBid ? "Place Bid" : "Increase Bid"}
                </button>
            </div>
        </Modal>
    )
}
