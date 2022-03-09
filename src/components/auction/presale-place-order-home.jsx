import React, { useState } from "react"
import Slider from "rc-slider"

import { useAuction } from "../../providers/auction-context"

import { numberWithCommas } from "../../utilities/number"
import { Currencies } from "../../utilities/staticData"

export default function PresalePlaceOrderHome() {
    const auction = useAuction()
    const { optCurrentRound, setPresalePlaceOrderStage, setPresaleNdbAmount } = auction
    const [amount, setAmount] = useState(1)

    const handleOrder = () => {
        setPresalePlaceOrderStage(1)
        setPresaleNdbAmount(amount)
    }

    // Render
    return (
        <>
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
            <div className="row">
                <div className="col-md-4"><div className="range-label mt-15px">Total price</div></div>
                <div className="col-md-8">
                    <div className="w-100 d-flex justify-content-between align-items-center">
                        <div className="w-100 d-flex flex-column justify-content-center align-items-end">
                            <input
                                className="presale-total-input"
                                type="text"
                                value={numberWithCommas(
                                    Number(
                                        optCurrentRound?.tokenPrice * amount,
                                        " "
                                    )
                                )}
                                readOnly
                            />
                            <div className="text-white fw-bold fs-14px mt-8px mr-18px">
                                PRICE PER TOKEN
                                <span className="txt-mountainMeadow">
                            {` ${optCurrentRound.tokenPrice}`}
                        </span>
                            </div>
                        </div>
                        <h3 className="symbol-label mt-10px">{Currencies[0].label}</h3>
                    </div>
                </div>
            </div>
            <div className="mt-3 mb-1">
                <p className="text-secondary fw-500 text-[#959595]">
                    Audited by CertiK
                </p>
            </div>
            <button
                className="btn btn-outline-light rounded-0 text-uppercase w-100 fw-bold py-12px fs-20px"
                onClick={() => handleOrder()}
            >
                <div className="d-flex align-items-center justify-content-center gap-3">
                    BUY
                </div>
            </button>
        </>
    )
}
