import React from "react"

export default function PercentageBar({ percentage }) {
    const fooPercentage = 100 - percentage
    return (
        <>
            <div className="fs-12px">64/8,000</div>
            <div className="timeframe-bar">
                <div
                    className="timeleft"
                    style={{
                        width: (fooPercentage > 0 && fooPercentage < 101 ? fooPercentage : 0) + "%",
                        background: "#464646",
                    }}
                ></div>
            </div>
        </>
    )
}
