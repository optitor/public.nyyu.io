import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import Select, { components } from "react-select";
import ReactTooltip from "react-tooltip";
import { GET_BALANCES } from "../../apollo/graghqls/querys/Auth";
import { PAYMENT_FRACTION_TOOLTIP_CONTENT } from "../../utilities/staticData";
import CustomSpinner from "../common/custom-spinner";
import { CheckBox } from "../common/FormControl";
import parser from "html-react-parser";
import { Qmark } from "../../utilities/imgImport";
import { PAY_WALLLET_FOR_AUCTION } from "./payment-webservice";
import PaymentSuccessful from "./PaymentSuccessful";

const { Option, SingleValue } = components;
const CustomOption = props => (
    <Option {...props}>
        <div className="custom-option">
            <p>{props.data.value}</p>
            <p className="ms-4">{props.data.label}</p>
        </div>
    </Option>
);
const CustomSingleValue = props => {
    return (
        <SingleValue {...props}>
            <p className="wallet-select__value">
                {props.data.value + " - " + props.data.label}
            </p>
        </SingleValue>
    );
};

export default function NDBWalletTab({ bidAmount, currentRound }) {
    // Containers
    const [balance, setBalance] = useState(null);
    const [userBalances, setUserBalances] = useState(null);
    const loading = !userBalances;
    const [requestPending, setRequestPending] = useState(false);
    const [error, setError] = useState("");
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);

    // Webservice
    useQuery(GET_BALANCES, {
        onCompleted: data => {
            setUserBalances(
                data.getBalances
                    .sort((token1, token2) => token2.free - token1.free)
                    .map(item => ({
                        value: item.free,
                        label: item.tokenSymbol,
                        icon: item.symbol,
                    }))
            );
        },
        onError: error => console.log(error),
    });
    const [payWalletForAuction] = useMutation(PAY_WALLLET_FOR_AUCTION, {
        onCompleted: data => {
            if (data && data?.payWalletForAuction === "SUCCESS")
                setPaymentSuccessful(true);
            setRequestPending(false);
        },
        onError: error => {
            setError(error.message);
            setRequestPending(false);
        },
    });

    // Methods
    const submitPayment = e => {
        e.preventDefault();
        setError("");
        setRequestPending(true);
        payWalletForAuction({
            variables: {
                roundId: currentRound,
                cryptoType: balance.label,
            },
        });
    };

    // Render
    if (loading)
        return (
            <div className="text-center py-3">
                <CustomSpinner />
            </div>
        );
    return (
        <div className="wallet-tab">
            <div className="payment-content">
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
                {paymentSuccessful ? (
                    <PaymentSuccessful />
                ) : (
                    <>
                        <div className="row">
                            <Select
                                className="balance-select col-lg-4 pe-0"
                                options={userBalances}
                                value={balance}
                                placeholder="YOUR BALANCE"
                                onChange={v => setBalance(v)}
                                components={{
                                    Option: CustomOption,
                                    SingleValue: CustomSingleValue,
                                }}
                            />
                            <div className="col-lg-8 d-flex pl-8px">
                                <div className="choosed-icon">
                                    {balance?.icon && parser(balance.icon)}
                                </div>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={bidAmount}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="mt-3 d-flex justify-content-between">
                            <div className="d-flex flex-row align-items-center">
                                <CheckBox
                                    type="checkbox"
                                    name="allow_fraction"
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
                                    alt="Question mark"
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
                        <button
                            className={`btn btn-outline-light rounded-0 text-uppercase confirm-payment fw-bold w-100 mt-4 ${
                                requestPending && "disabled"
                            }`}
                            disabled={requestPending}
                            onClick={submitPayment}
                        >
                            <div className="d-flex align-items-center justify-content-center gap-3">
                                {requestPending && <CustomSpinner />}
                                confirm payment
                            </div>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
