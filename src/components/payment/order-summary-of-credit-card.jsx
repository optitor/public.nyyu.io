import React from "react";
import { useSelector } from "react-redux";
import { numberWithCommas } from "../../utilities/number";
import { getStripePaymentFee } from "../../utilities/utility-methods";

export default function OrderSummaryOfCreditCard({ bidAmount }) {
    // Containers
    const { allFees } = useSelector((state) => state);
    const user = useSelector((state) => state.auth.user);
    const stripePaymentFee = getStripePaymentFee(user, allFees, bidAmount);

    // Render
    return (
        <div className="col-lg-4 d-flex flex-column justify-content-between">
            <div className="order-summary">
                <h4>ORDER SUMMARY</h4>
                <div className="order-list-coinpayment">
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Total order</p>
                        <p className="order-list__detail">{bidAmount}</p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Fee</p>
                        <p className="order-list__detail">{stripePaymentFee}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="order-list__label">Discount</p>
                        <p className="order-list__label">0</p>
                    </div>
                </div>
                <div
                    className="d-flex justify-content-between"
                    style={{ paddingTop: "11px", paddingBottom: "10px" }}
                >
                    <p
                        className="order-list__label"
                        style={{ color: "dimgrey" }}
                    >
                        Order total:
                    </p>
                    <p className="order-total">
                        {numberWithCommas(bidAmount + stripePaymentFee)}{" "}
                        <span> USD</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
