import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Amex } from "../../../utilities/imgImport";
import CustomSpinner from "../../common/custom-spinner";
import {
    DELETE_CARD,
    GET_SAVED_CARDS,
    GET_STRIPE_PUB_KEY,
} from "../../payment/payment-webservice";

const StripeDepositSection = () => {
    // Containers
    const [isNewCard, setIsNewCard] = useState(false);
    const [savedCards, setSavedCards] = useState(null);
    const [stripePublicKey, setStripePublicKey] = useState(null);
    const [selectedSavedCard, setSelectedSavedCard] = useState(0);

    const [deleteCardLoading, setDeleteCardLoading] = useState(false);
    const loading = !(stripePublicKey && savedCards);

    // Webserver
    useQuery(GET_STRIPE_PUB_KEY, {
        fetchPolicy: "network-only",
        onCompleted: (data) => setStripePublicKey(data.getStripePubKey),
        onError: (error) => console.log(error),
    });
    useQuery(GET_SAVED_CARDS, {
        fetchPolicy: "network-only",
        onCompleted: (data) => setSavedCards(data.getSavedCards),
        onError: (error) => console.log(error),
    });
    const [deleteCard] = useMutation(DELETE_CARD, {
        onCompleted: (data) => setDeleteCardLoading(false),
        onError: (error) => console.log(error),
    });

    // Methods
    const deleteCardMethod = (id) => {
        setDeleteCardLoading(true);
        setSavedCards(savedCards.filter((item) => item.id !== id));
        deleteCard({
            variables: {
                id,
            },
        });
    };

    // Render
    return (
        <>
            <div className="row m-0 my-4">
                <button
                    onClick={() => setIsNewCard(true)}
                    className={`btn col-6 py-3 border-0 border-bottom fw-500 text-center rounded-0 ${
                        isNewCard
                            ? "border-success text-success"
                            : "border-light text-light"
                    }`}
                >
                    New card
                </button>
                <button
                    onClick={() => setIsNewCard(false)}
                    className={`btn col-6 py-3 border-0 border-bottom fw-500 text-center rounded-0 ${
                        !isNewCard
                            ? "border-success text-success"
                            : "border-light text-light"
                    }`}
                >
                    Saved cards
                </button>
            </div>

            {loading || deleteCardLoading ? (
                <div className="text-center mx-auto mt-2">
                    <CustomSpinner />
                </div>
            ) : isNewCard ? (
                <></>
            ) : (
                <div className="credit-card-save-cards text-light row m-0 mb-4 mb-sm-2">
                    {savedCards.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={`credit-card-save-cards-item mb-3 mb-sm-2 col-lg-6 col-12 ${
                                    index % 2 === 0
                                        ? "ps-sm-2 px-0"
                                        : "pe-sm-2 px-0"
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
                                        <div className="credit-card-save-cards-item-details text-start">
                                            **** **** **** {item.last4} <br />
                                            {item.expMonth}/{item.expYear}{" "}
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
                    {savedCards.length === 0 && (
                        <div className="text-center mx-auto mt-2 text-uppercase text-light fw-500">
                            No saved cards
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default StripeDepositSection;
