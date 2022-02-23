import React from "react"
import { numberWithCommas } from "../../utilities/number"

export default function PercentageBar({ percentage, sold, total }) {
    const fooPercentage = 100 - percentage
    return (
        <div className="mt-5">
            <div className="fs-12px text-light">
                {numberWithCommas(sold)}/{numberWithCommas(total)}
            </div>
            <div className="timeframe-bar">
                <div
                    className="timeleft"
                    style={{
                        width:
                            (fooPercentage > 0 && fooPercentage < 101
                                ? fooPercentage
                                : 0) + "%",
                        background: "#464646",
                    }}
                ></div>
            </div>
        </div>
    )
}
