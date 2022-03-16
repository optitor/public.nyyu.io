import React, { useState } from "react";
import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement,
} from "@stripe/react-stripe-js";
import CustomSpinner from "../../common/custom-spinner";
import { CheckBox } from "../../common/FormControl";
const StripeDepositForm = ({ amount }) => {
    // Containers
    const [error, setError] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [country, setCountry] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [requestPending, setRequestPending] = useState(false);
    const [isSaveCard, setIsSaveCard] = useState(false);

    // Methods
    const submitPayment = () => {};

    // Render
    return (
        <form className="row m-0">
            {error && (
                <div className="text-danger fs-16px ps-0 mb-2">
                    <div className="d-flex align-items-center gap-2">
                        <svg
                            className="icon-23px"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <div>{error}</div>
                    </div>
                </div>
            )}

            <div className="col-sm-6 col-12 pe-sm-1 px-0">
                <CardNumberElement
                    className="border border-light border-1 p-2 w-100 mb-3"
                    options={{
                        style,
                        placeholder: "Card number (4563 9999 8883 7777 2888)",
                    }}
                />
            </div>
            <div className="col-sm-3 col-12 px-sm-1 px-0">
                <CardExpiryElement
                    className="border border-light border-1 p-2 mb-3 w-100"
                    options={{
                        style,
                        placeholder: "MM/YY (07/27)",
                    }}
                />
            </div>
            <div className="col-sm-3 col-12 ps-sm-1 px-0">
                <CardCvcElement
                    className="border border-light border-1 p-2 mb-3 w-100"
                    options={{
                        style,
                        placeholder: "CVC code (123)",
                    }}
                />
            </div>
            <div className="col-sm-6 col-12 pe-sm-1 px-0">
                <input
                    type="text"
                    style={style.base}
                    className="border border-light border-1 p-2 w-100 mb-3 form-control"
                    placeholder="Card holder (John Smith)"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                />
            </div>
            <div className="col-sm-3 col-12 px-sm-1 px-0">
                <input
                    type="text"
                    style={style.base}
                    className="border border-light border-1 p-2 w-100 mb-3 form-control"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                />
            </div>
            <div className="col-sm-3 col-12 ps-sm-1 px-0">
                <input
                    type="text"
                    style={style.base}
                    className="border border-light border-1 p-2 w-100 mb-3 form-control"
                    placeholder="Billing zip/postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                />
            </div>
            <div className="d-flex flex-row align-items-center mt-2 gap-2 px-0">
                <input
                    id="save-card-checkbox"
                    type="checkbox"
                    value={isSaveCard}
                    onChange={(e) => setIsSaveCard(e.target.checked)}
                    className="text-uppercase bg-transparent text-light"
                />
                <label
                    htmlFor="save-card-checkbox"
                    className="fw-500 text-light text-uppercase fs-10px noselect"
                >
                    save card details for future purchase
                </label>
            </div>
            <button
                className={`btn btn-outline-light rounded-0 text-uppercase confirm-payment fw-bold w-100 mt-4 py-3 ${
                    requestPending && "disabled"
                }`}
                onClick={requestPending ? null : submitPayment}
            >
                <div className="d-flex align-items-center justify-content-center gap-3">
                    {requestPending && <CustomSpinner />}
                    {/* {stripePaymentSecondCall ? "verifying" : "confirm payment"} */}
                    confirm deposit
                </div>
            </button>
        </form>
    );
};
export default StripeDepositForm;

const style = {
    base: {
        color: "#696969",
        fontFamily: "Montserrat",
        fontWeight: "500",
        fontSmoothing: "antialiased",
        fontSize: "14px",
        backgroundColor: "transparent",
        border: "1px solid white",
        "::placeholder": {
            color: "dimgrey",
        },
    },
    invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
    },
};
