import { navigate } from "gatsby";
import React, { useEffect, useState } from "react";
import useCountDown from "react-countdown-hook";
import { ROUTES } from "../../utilities/routes";

export default function PaymentSuccessful() {
    // Countdown
    const initialTime = 3 * 1000;
    const interval = 1000;
    const [startedCounting, setStartedCounting] = useState(false);
    const [timeLeft, { start: startTimer }] = useCountDown(
        initialTime,
        interval
    );

    // Methods
    useEffect(() => startTimer(), []);
    useEffect(() => {
        setStartedCounting(true);
        if (startedCounting) if (timeLeft === 0) navigate(ROUTES.auction);
    }, [timeLeft]);
    // Render
    return (
        <div className="text-center p-4">
            <div className="text-danger mb-4">
                <svg
                    className="text-success"
                    width="126"
                    height="126"
                    viewBox="0 0 126 126"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        x="31"
                        y="64.1067"
                        width="14.2931"
                        height="34.4792"
                        transform="rotate(-45 31 64.1067)"
                        fill="#F2F2F2"
                    />
                    <rect
                        width="14.2931"
                        height="57.0408"
                        transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 95.6963 48.1067)"
                        fill="#F2F2F2"
                    />
                    <circle
                        cx="63"
                        cy="63"
                        r="56.5"
                        stroke="#F2F2F2"
                        strokeWidth="13"
                    />
                </svg>
            </div>
            <div className="text-capitalize text-light fs-28px fw-bold text-success">
                payment successful
            </div>
            <div className="text-capitalize text-light fs-18px fw-500 mt-2">
                you will be redirected in {Math.floor(timeLeft / 1000)} ...
            </div>
        </div>
    );
}
