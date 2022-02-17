import React, { useEffect, useState } from "react"
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
import { GET_STRIPE_PUB_KEY } from "./payment-webservice"
import { useQuery } from "@apollo/client"
import CustomSpinner from "../common/custom-spinner"
export default function CreditCardTab() {
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
                <Elements stripe={loadStripe(stripePublicKey)}>
                    <CardSection />
                </Elements>
            )}
        </div>
    )
}

const CardSection = () => {
    // Containers
    const [allowFractionBox, setAllowFractionBox] = useState(false)
    const stripe = useStripe()
    const elements = useElements()
    const style = {
        base: {
            color: "white",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
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
    // Methods
    const submitPayment = async (e) => {
        e.preventDefault()
        if (!stripe || !elements) return

        const result = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardNumberElement),
            billing_details: {
                name: "Mohammad Eskini", // TODO: Change this later on.
            },
        })
        console.log(result)
    }
    // Render
    return (
        <>
            <form className="row m-0">
                <CardNumberElement
                    className="border border-light border-1 p-2 col-12 mb-3"
                    options={{
                        style,
                        placeholder: "Card number",
                    }}
                />
                <div className="col-6 ps-0">
                    <CardExpiryElement
                        className="border border-light border-1 p-2 mb-3 w-100"
                        options={{
                            style,
                            placeholder: "Expiration date",
                        }}
                    />
                </div>
                <div className="col-6 pe-0">
                    <CardCvcElement
                        className="border border-light border-1 p-2 mb-3 w-100"
                        options={{
                            style,
                            placeholder: "CVC code",
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
                    <ReactTooltip place="right" type="light" effect="solid">
                        <div
                            className="text-justify"
                            style={{
                                width: "300px",
                            }}
                        >
                            {PAYMENT_FRACTION_TOOLTIP_CONTENT}
                        </div>
                    </ReactTooltip>
                    <FontAwesomeIcon
                        data-tip="React-tooltip"
                        icon={faQuestionCircle}
                        className="fa-2x ms-2 cursor-pointer text-light"
                    />
                </div>
                <p className="payment-expire my-auto">
                    payment expires in <span className="txt-green">10 minutes</span>
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

            <button className="btn btn-outline-light" onClick={submitPayment}>
                Confirm Payment
            </button>
        </>
    )
}
