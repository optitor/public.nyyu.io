import React, { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    Elements,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js"
import { PAYMENT_FRACTION_TOOLTIP_CONTENT } from "../../utilities/staticData"
import ReactTooltip from "react-tooltip"
import { CheckBox } from "../common/FormControl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/fontawesome-free-regular"
import { GET_STRIPE_PUB_KEY, STRIPE_PAYMENT } from "./payment-webservice"
import { useMutation, useQuery } from "@apollo/client"
import CustomSpinner from "../common/custom-spinner"
import { navigate } from "gatsby"
import { ROUTES } from "../../utilities/routes"
import useCountDown from "react-countdown-hook"
import { Qmark } from "../../utilities/imgImport"

export default function CreditCardTab({ amount, round }) {
    // Containers
    const [loading, setLoading] = useState(true)
    const [stripePublicKey, setStripePublicKey] = useState(null)

    // Webservice
    useQuery(GET_STRIPE_PUB_KEY, {
        onCompleted: (data) => {
            setStripePublicKey(data.getStripePubKey)
            setLoading(false)
        },
        onError: (error) => console.log(error),
    })

    // Render
    return (
        <div>
            {loading ? (
                <div className="text-center mx-auto mt-2">
                    <CustomSpinner />
                </div>
            ) : (
                <Elements
                    options={{
                        fonts: [
                            {
                                cssSrc: "https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap%27",
                            },
                        ],
                    }}
                    stripe={loadStripe(stripePublicKey)}
                >
                    <CardSection amount={amount} round={round} />
                </Elements>
            )}
        </div>
    )
}

const CardSection = ({ amount, round }) => {
    // Containers
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState("")
    const [cardHolder, setCardHolder] = useState("")
    const [allowFractionBox, setAllowFractionBox] = useState(false)
    const [successfulPayment, setSuccessfulPayment] = useState(null)
    const [requestPending, setRequestPending] = useState(false)
    const [stripePaymentSecondCall, setStripePaymentSecondCall] =
        useState(false)

    // Countdown
    const initialTime = 5 * 1000
    const interval = 1000
    const [timeLeft, { start: startTimer }] = useCountDown(
        initialTime,
        interval
    )

    const style = {
        base: {
            color: "#E3E3E3",
            fontFamily: "Montserrat",
            fontWeight: "500",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            backgroundColor: "transparent",
            border: "1px solid white",
            "::placeholder": {
                color: "#E3E3E3",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    }

    // Webservice
    const [stripePayment] = useMutation(STRIPE_PAYMENT, {
        onCompleted: async (data) => {
            if (stripePaymentSecondCall === false) {
                setStripePaymentSecondCall(true)
                if (data.payStripeForAuction.error) {
                    setRequestPending(false)
                    return setError(data.payStripeForAuction.error)
                }
                const { clientSecret, requiresAction } =
                    data.payStripeForAuction
                if (requiresAction === false) {
                    startTimer()
                    setRequestPending(false)
                    return setSuccessfulPayment(true)
                }
                if (clientSecret)
                    return stripe
                        .handleCardAction(clientSecret)
                        .then((result) => {
                            if (result.error) {
                                startTimer()
                                return setSuccessfulPayment(false)
                            }
                            return stripePayment({
                                variables: {
                                    roundId: Number(round),
                                    amount: amount * 100,
                                    paymentMethodId: null,
                                    paymentIntentId: result.paymentIntent.id,
                                },
                            })
                        })
                return setError("Invalid payment")
            } else if (stripePaymentSecondCall === true) {
                if (
                    data.payStripeForAuction.error ||
                    data.payStripeForAuction.requiresAction === true
                ) {
                    startTimer()
                    setRequestPending(false)
                    return setSuccessfulPayment(false)
                }
                startTimer()
                return setSuccessfulPayment(true)
            }
        },
        onError: (error) => {
            console.log(error)
            setRequestPending(false)
        },
    })

    // Methods
    const submitPayment = async (e) => {
        e.preventDefault()
        setError("")
        setRequestPending(true)
        if (!stripe || !elements) return

        const { paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardNumberElement),
            billing_details: {
                name: cardHolder,
            },
        })
        if (paymentMethod && "id" in paymentMethod && paymentMethod.id) {
            return stripePayment({
                variables: {
                    roundId: Number(round),
                    amount: amount * 100,
                    paymentMethodId: paymentMethod.id,
                    paymentIntentId: null,
                },
            })
        }
        setRequestPending(false)
        return setError("Invalid card information")
    }

    useEffect(() => {
        if (successfulPayment !== null)
            if (timeLeft === 0) navigate(ROUTES.auction)
    }, [timeLeft])

    // Render
    return successfulPayment === true ? (
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
                        stroke-width="13"
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
    ) : successfulPayment === false ? (
        <div className="text-center p-4">
            <div className="text-danger mb-4">
                <svg
                    width="126"
                    height="126"
                    viewBox="0 0 126 126"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect
                        width="14.2931"
                        height="63.0592"
                        transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 90.6963 46.1069)"
                        fill="white"
                    />
                    <rect
                        x="36"
                        y="46.1069"
                        width="14.2931"
                        height="63.0592"
                        transform="rotate(-45 36 46.1069)"
                        fill="white"
                    />
                    <circle
                        cx="63"
                        cy="63"
                        r="56.5"
                        stroke="white"
                        stroke-width="13"
                    />
                </svg>
            </div>
            <div className="text-capitalize text-light fs-28px fw-bold">
                payment failed
            </div>
            <div className="text-capitalize text-light fs-18px fw-500 mt-2">
                you will be redirected in {Math.floor(timeLeft / 1000)} ...
            </div>
        </div>
    ) : (
        <>
            <form className="row m-0">
                {error && (
                    <div className="text-danger fs-16px ps-0 mb-2">
                        <div className="d-flex align-items-center gap-2">
                            <svg
                                class="icon-23px"
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
                            <div>{error}</div>
                        </div>
                    </div>
                )}

                <div className="col-6 ps-0 pe-1">
                    <input
                        type="text"
                        style={style.base}
                        className="border border-light border-1 p-2 w-100 mb-3 placeholder:text-light form-control"
                        placeholder="Card holder (John Smith)"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                    />
                </div>
                <div className="col-6 pe-0 ps-0">
                    <CardNumberElement
                        className="border border-light border-1 p-2 w-100 mb-3"
                        options={{
                            style,
                            placeholder:
                                "Card number (4563 9999 8883 7777 2888)",
                        }}
                    />
                </div>
                <div className="col-6 ps-0 pe-1">
                    <CardExpiryElement
                        className="border border-light border-1 p-2 mb-3 w-100"
                        options={{
                            style,
                            placeholder: "MM/YY",
                        }}
                    />
                </div>
                <div className="col-6 pe-0 ps-0">
                    <CardCvcElement
                        className="border border-light border-1 p-2 mb-3 w-100"
                        options={{
                            style,
                            placeholder: "CVC (123)",
                        }}
                    />
                </div>
            </form>
            <div className="mt-3 d-flex justify-content-between">
                <div className="d-flex flex-row align-items-center">
                    <CheckBox
                        type="checkbox"
                        name="allow_fraction"
                        value={allowFractionBox}
                        onChange={(e) => setAllowFractionBox(e.target.checked)}
                        className="text-uppercase"
                    ></CheckBox>
                    <div className="allow-text text-light">
                        Do you allow fraction of order compleation?
                    </div>
                    <ReactTooltip
                        id="question-mark-tooltip"
                        place="right"
                        type="light"
                        effect="solid"
                    >
                        <div
                            className="text-justify"
                            style={{
                                width: "300px",
                            }}
                        >
                            {PAYMENT_FRACTION_TOOLTIP_CONTENT}
                        </div>
                    </ReactTooltip>

                    <img
                        src={Qmark}
                        data-tip
                        data-for="question-mark-tooltip"
                        className="ms-2 cursor-pointer text-light"
                    />
                </div>
                <p className="payment-expire my-auto">
                    payment expires in{" "}
                    <span className="txt-green">10 minutes</span>
                </p>
            </div>
            <div className="mt-2 d-flex justify-content-between">
                <div className="d-flex flex-row align-items-center">
                    <CheckBox
                        type="checkbox"
                        name="allow_fraction"
                        value={allowFractionBox}
                        onChange={(e) => setAllowFractionBox(e.target.checked)}
                        className="text-uppercase"
                    ></CheckBox>
                    <div className="allow-text text-light">
                        save card details for future purchase
                    </div>
                </div>
            </div>
            <button
                className={`btn btn-outline-light rounded-0 text-uppercase confirm-payment fw-bold w-100 mt-4 ${
                    requestPending && "disabled"
                }`}
                onClick={requestPending ? null : submitPayment}
            >
                <div className="d-flex align-items-center justify-content-center gap-3">
                    {requestPending && <CustomSpinner />}
                    {stripePaymentSecondCall ? "verifying" : "confirm payment"}
                </div>
            </button>
        </>
    )
}
