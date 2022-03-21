import React from "react";
import { Amex } from "../../utilities/imgImport";

export default function CreditCardSavedCards({
    savedCards,
    deleteCardMethod,
    selectedSavedCard,
    setSelectedSavedCard,
}) {
    return (
        <div className="credit-card-save-cards text-light row m-0 mb-4 mb-sm-2 px-0">
            {savedCards.map((item, index) => {
                return (
                    <div
                        key={index}
                        className={`credit-card-save-cards-item mb-3 mb-sm-2 col-lg-6 col-12 ${
                            index % 2 === 0 ? "pe-sm-2 px-0" : "ps-sm-2 px-0"
                        }`}
                    >
                        <button
                            onClick={() => setSelectedSavedCard(index)}
                            className={`btn rounded-0 mt-0 col-12 ${
                                index === selectedSavedCard && "active"
                            }`}
                        >
                            <div className="d-flex align-items-start">
                                <img src={Amex} alt="Amex" className="me-4" />
                                <div className="credit-card-save-cards-item-details">
                                    **** **** **** {item.last4} <br />
                                    {item.expMonth}/{item.expYear} <br />
                                    Card holder's name
                                </div>
                                <button
                                    onClick={() => deleteCardMethod(item.id)}
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
    );
}
