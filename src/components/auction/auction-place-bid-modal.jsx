import React, { useState } from "react"
import Modal from "react-modal"
import { useAuction } from "./auction-context"
import { CloseIcon } from "../../utilities/imgImport"
import { numberWithCommas } from "../../utilities/number"
import { useDispatch } from "react-redux"
import { INCREASE_BID, PLACE_BID } from "../../apollo/graghqls/mutations/Bid"
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
    const [price, setPrice] = useState(current?.minPrice)
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
                    roundId: current?.id,
                    tokenAmount: amount,
                    tokenPrice: price,
                },
            })
        } else {
            increaseBid({
                variables: {
                    roundId: current?.id,
                    tokenAmount: amount,
                    tokenPrice: price,
                },
            })
        }
        dispatch(setBidInfo(Number(price * amount)))
        dispatch(setCurrentRound(current?.id))
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
                {error && (
                    <div className="mt-1 mb-4">
                        <div className="d-flex align-items-center gap-2 text-start">
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
                <h4 className="range-label text-start mb-0">amount of Token</h4>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Type the Token Amount Here"
                    className="range-input"
                />
                <h4 className="range-label text-start mb-0">Per token price</h4>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Type the price per Token Here"
                    className="range-input"
                />
                <h4 className="range-label text-start mb-0">Total price</h4>
                <input
                    className="total-input"
                    type="text"
                    value={numberWithCommas(
                        Number(Math.max(current?.minPrice, price * amount), ",")
                    )}
                    readOnly
                />
                <button
                    className="btn btn-outline-light rounded-0 fw-bold w-100 fs-20px py-3 text-uppercase"
                    onClick={() => bidMutation()}
                    disabled={reqPending}
                >
                    {reqPending
                        ? "processing..."
                        : auction.isBid
                        ? "Place Bid"
                        : "Increase Bid"}
                </button>
            </div>
        </Modal>
    )
}
