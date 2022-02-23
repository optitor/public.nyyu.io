import React from "react"
import { useSelector } from 'react-redux'
import { numberWithCommas } from "../../utilities/number"
import NumberFormat from "react-number-format"

export default function OrderSummary({ bidAmount }) {
    const {temp: coinData} = useSelector(state => state)
    
    return (
        <div className="col-lg-4 d-flex flex-column justify-content-between">
            <div className="order-summary ">
                <h4>ORDER SUMMARY</h4>

                <div className="order-list-coinpayment">
                    <div className="d-flex justify-content-between">
                        <p className="order-list__label">Status</p>
                        <p className="order-list__detail">Waiting for your funds</p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Balance remaining</p>
                        <p className="order-list__detail">0.0000000000 BTC</p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Recieved so far</p>
                        <p className="order-list__detail">0.0000027 BTC</p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Time left to confirm funds</p>
                        <p className="order-list__detail">7h 23m 45s</p>
                    </div>
                    <div className="d-flex justify-content-between my-3">
                        <p className="order-list__label">Payment ID</p>
                        <p className="order-list__detail">9MdNsX...ahwWt6ILF</p>
                    </div>
                </div>
                <div
                    className="d-flex justify-content-between"
                    style={{ paddingTop: "11px", paddingBottom: "10px" }}
                >
                    <p className="order-list__label" style={{ color: "dimgrey" }}>
                        Order total:
                    </p>
                    <p className="order-total">
                        {numberWithCommas(bidAmount)} <span> USD</span>
                    </p>
                </div>
                {coinData.coinValue? (
                    <NumberFormat
                        style={{textAlign: 'right', color: 'dimgrey'}}
                        displayType={'text'}
                        suffix={` ${coinData.coinSymbol}`}
                        value={coinData.coinValue}
                        thousandSeparator={true}
                        renderText={(value, props) => <p {...props}>~ {value}</p>}
                    />
                ) : ''}
            </div>
        </div>
    )
}
