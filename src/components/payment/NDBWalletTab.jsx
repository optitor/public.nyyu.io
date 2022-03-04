import { useQuery } from "@apollo/client";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Select, { components } from "react-select";
import ReactTooltip from "react-tooltip";
import { GET_BALANCES } from "../../apollo/graghqls/querys/Auth";
import { PAYMENT_FRACTION_TOOLTIP_CONTENT } from "../../utilities/staticData";
import CustomSpinner from "../common/custom-spinner";
import { CheckBox } from "../common/FormControl";
import parser from "html-react-parser";

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

export default function NDBWalletTab({ bidAmount }) {
    // Containers
    const [balance, setBalance] = useState(null);
    const [userBalances, setUserBalances] = useState(null);
    const loading = !userBalances;

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
                    <p className="d-flex flex-row">
                        <CheckBox
                            type="checkbox"
                            name="allow_fraction"
                            className="text-uppercase"
                        ></CheckBox>
                        <div className="allow-text">
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
                            className="fa-xl ms-2 cursor-pointer"
                        />
                    </p>
                    <p className="payment-expire my-auto">
                        payment expires in{" "}
                        <span className="txt-green">10 minutes</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
