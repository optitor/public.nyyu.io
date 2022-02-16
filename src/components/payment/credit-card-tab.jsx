import React from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    Elements,
    ElementsConsumer,
} from "@stripe/react-stripe-js"

export default function CreditCardTab() {
    // Containers
    const stripePromise = loadStripe("pk_test_oKhSR5nslBRnBZpjO6KuzZeX")

    // Methods

    // Render
    return (
        <div>
            <Elements stripe={stripePromise}>
                <CardSection />
            </Elements>
        </div>
    )
}

const CardSection = () => {
    // Containers
    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                color: "white",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                backgroundColor: "transparent",
                border: "1px solid white",
                "::placeholder": {
                    color: "white",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    }
    // Render
    return (
        // <form className="form">
        //     <div className="mb-2">
        //         <CardElement options={CARD_ELEMENT_OPTIONS} />
        //     </div>
        //     <button
        //         type="submit"
        //         className="btn btn-outline-light rounded-0 mx-auto"
        //         disabled={false}
        //     >
        //         Pay
        //     </button>
        // </form>
        <form>
            <label htmlFor="cardNumber">Card Number</label>
            <CardNumberElement id="cardNumber" options={CARD_ELEMENT_OPTIONS} />
            <label htmlFor="expiry">Card Expiration</label>
            <CardExpiryElement id="expiry" options={CARD_ELEMENT_OPTIONS} />
            <label htmlFor="cvc">CVC</label>
            <CardCvcElement id="cvc" options={CARD_ELEMENT_OPTIONS} />

            <button type="submit">Pay</button>
        </form>
    )
}
