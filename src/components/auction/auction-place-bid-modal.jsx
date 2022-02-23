import React, { useState } from "react"
import Modal from "react-modal"
import { useAuction } from "./auction-context"
import { CloseIcon } from "../../utilities/imgImport"
import { numberWithCommas } from "../../utilities/number"
import { useDispatch } from "react-redux"
import { PLACE_BID } from "../../apollo/graghqls/mutations/Bid"
import { useMutation } from "@apollo/client"
import { ROUTES } from "../../utilities/routes"
import { setBidInfo, setCurrentRound } from "../../redux/actions/bidAction"
import { navigate } from "gatsby"

export default function AuctionPlaceBidModal() {
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
                    {!auction.isBid ? "Place Bid" : "Increase Bid"}
                </button>
            </div>
        </Modal>
    )
}
