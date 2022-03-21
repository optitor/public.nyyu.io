import React, { useState } from "react";
import { Amex } from "../../utilities/imgImport";
import CustomSpinner from "../common/custom-spinner";

export default function CreditCardSavedCards({
    savedCards,
    deleteCardMethod,
    selectedSavedCard,
    setSelectedSavedCard,
}) {
    // Containers
    const [requestPending, setRequestPending] = useState(false);
    const [stripePaymentSecondCall, setStripePaymentSecondCall] =
        useState(false);
    const [successfulPayment, setSuccessfulPayment] = useState(null);

    // Methods
    const submitPayment = () => {};

    // Render
    return (
        <>
            <div className="credit-card-save-cards text-light row m-0 mb-4 mb-sm-2 px-0">
                {savedCards.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={`credit-card-save-cards-item mb-3 mb-sm-2 col-lg-6 col-12 ${
                                index % 2 === 0
                                    ? "pe-sm-2 px-0"
                                    : "ps-sm-2 px-0"
                            }`}
                        >
                            <button
                                onClick={() => setSelectedSavedCard(index)}
                                className={`btn rounded-0 mt-0 col-12 ${
                                    index === selectedSavedCard && "active"
                                }`}
                            >
                                <div className="d-flex align-items-start">
                                    <img
                                        src={Amex}
                                        alt="Amex"
                                        className="me-4"
                                    />
                                    <div className="credit-card-save-cards-item-details">
                                        **** **** **** {item.last4} <br />
                                        {item.expMonth}/{item.expYear} <br />
                                        Card holder's name
                                    </div>
                                    <button
                                        onClick={() =>
                                            deleteCardMethod(item.id)
                                        }
                                        className="btn text-underline text-light mt-0 pt-0 fs-13px ms-auto"
                                    >
                                        Delete card
                                    </button>
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>
            <button
                className={`btn btn-outline-light rounded-0 text-uppercase confirm-payment fw-bold w-100 mt-2 ${
                    requestPending && "disabled"
                }`}
                onClick={requestPending ? null : submitPayment}
            >
                <div className="d-flex align-items-center justify-content-center gap-3">
                    {requestPending && <CustomSpinner sm />}
                    {stripePaymentSecondCall ? "verifying" : "confirm payment"}
                </div>
            </button>
        </>
    );
}
