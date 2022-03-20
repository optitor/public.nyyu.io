import React from "react"
import { numberWithCommas } from "../../utilities/number"

export default function OrderSummary({ bidAmount }) {
    return (
        <div className="col-lg-4 d-flex flex-column justify-content-between">
            <div className="order-summary ">
                <h4>Order Summary</h4>

                <div className="order-list">
                    <div className="d-flex justify-content-between">
                        <p className="order-list__label">Total order</p>
                        <p className="order-list__label">
                            {numberWithCommas(bidAmount)} <span> USD</span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Fee</p>
                        <p className="order-list__label">0</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="order-list__label">Discount</p>
                        <p className="order-list__label">0</p>
                    </div>
                </div>
                <div
                    className="d-flex justify-content-between"
                    style={{ paddingTop: "11px", paddingBottom: "25px" }}
                >
                    <p
                        className="order-list__label"
                        style={{ color: "#959595" }}
                    >
                        Order total:
                    </p>
                    <p className="order-total">
                        {numberWithCommas(bidAmount)} <span> USD</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
