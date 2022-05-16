import React from "react";
import { useSelector } from "react-redux";
import { roundNumber } from "../../utilities/number";
import NumberFormat from "react-number-format";

export default function OrderSummary({ bidAmount }) {
    const { temp: coinData } = useSelector((state) => state);

    return (
        <div className="col-lg-4 d-flex flex-column justify-content-between">
            <div className="order-summary ">
                <h4>ORDER SUMMARY</h4>

                <div className="order-list-coinpayment">
                    <div className="d-flex justify-content-between">
                        <p className="order-list__label">Status</p>
                        <p className="order-list__detail">
                            Waiting for your funds
                        </p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Balance remaining</p>
                        {coinData.coinValue ? (
                            <NumberFormat
                                className="order-list__detail"
                                displayType={"text"}
                                suffix={` ${coinData.coinSymbol}`}
                                value={coinData.coinValue}
                                thousandSeparator={true}
                                renderText={(value, props) => (
                                    <p {...props}>{value}</p>
                                )}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Recieved so far</p>
                        <p className="order-list__detail">
                            {coinData.coinValue
                                ? `0 ${coinData.coinSymbol}`
                                : ""}
                        </p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">
                            Time left to confirm funds
                        </p>
                        <p className="order-list__detail">8h 0m 0s</p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Payment ID</p>
                        <p className="order-list__detail">
                            {coinData?.paymentId ? coinData?.paymentId : ""}
                        </p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Transaction fee</p>
                        {coinData?.transactionFee ? (
                            <NumberFormat
                                className="order-list__detail"
                                displayType={"text"}
                                suffix={` USD`}
                                value={coinData?.transactionFee}
                                thousandSeparator={true}
                                renderText={(value, props) => (
                                    <p {...props}>{value}</p>
                                )}
                            />
                        ) : (
                            ""
                        )}
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
                    <NumberFormat
                        className="order-total"
                        displayType={"text"}
                        suffix=' USD'
                        value={roundNumber(bidAmount, 2)}
                        thousandSeparator={true}
                        renderText={(value, props) => (
                            <p {...props}>~ {value}</p>
                        )}
                    />
                </div>
                {coinData.coinValue ? (
                    <NumberFormat
                        style={{ textAlign: "right", color: "dimgrey" }}
                        displayType={"text"}
                        suffix={` ${coinData.coinSymbol}`}
                        value={coinData.coinValue}
                        thousandSeparator={true}
                        renderText={(value, props) => (
                            <p {...props}>~ {value}</p>
                        )}
                    />
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}
