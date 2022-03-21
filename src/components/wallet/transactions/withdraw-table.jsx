import React, { useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import {
    AccordionDownIcon,
    AccordionUpIcon,
} from "../../../utilities/imgImport";
import { receiptTemplate } from "./receiptTemplate";
import { useTransactions } from "./transactions-context";

const withdrawOptions = [
    { value: "paypal", label: "Paypal" },
    { value: "crypto", label: "Crypto" },
    { value: "credit_card", label: "Credit Card" },
];

export default function WithdrawTable() {
    // Containers
    const user = useSelector((state) => state.auth.user);
    const { tabs, paypalWithdrawTransactions, coinWithdrawTransactions } =
        useTransactions();
    const [list, setList] = useState(paypalWithdrawTransactions);
    const [currentRowsOpen, setCurrentRowsOpen] = useState([]);
    const [currentWithdrawType, setCurrentWithdrawType] = useState(
        withdrawOptions[0]
    );

    // Methods
    const toggleDetails = (index) => {
        const item = document.getElementById(`transaction-details-${index}`);
        if (item) {
            item.classList.toggle("d-none");
            if (currentRowsOpen.includes(index))
                setCurrentRowsOpen(
                    currentRowsOpen.filter((row) => row !== index)
                );
            else setCurrentRowsOpen([...currentRowsOpen, index]);
        }
    };

    const downloadContent = (
        id,
        date,
        time,
        amount,
        asset,
        fee,
        status,
        type,
        paymentId
    ) => {
        const downloadable = window.open("", "", "");
        downloadable.document.write(
            receiptTemplate({
                id,
                date,
                time,
                amount,
                asset,
                fee,
                status,
                type,
                paymentId,
                user,
            })
        );
        downloadable.print();
    };

    const changeDepositType = (type) => {
        setCurrentWithdrawType(type);
        if (type.value === "paypal") setList(paypalWithdrawTransactions);
        if (type.value === "crypto") setList(coinWithdrawTransactions);
        if (type.value === "credit_card") setList([]);
    };

    // Render
    return (
        <div className="px-sm-4 px-3 table-responsive transaction-section-tables">
            <table className="wallet-transaction-table w-100">
                <div className="mt-4">
                    <Select
                        isSearchable={false}
                        options={withdrawOptions}
                        defaultValue={withdrawOptions[0]}
                        value={currentWithdrawType}
                        onChange={changeDepositType}
                    />
                </div>
                {list?.length === 0 && (
                    <tr className="py-4 text-center">
                        <td
                            colSpan={4}
                            className="text-light fs-16px text-uppercase fw-500"
                        >
                            no records found
                        </td>
                    </tr>
                )}
                {list?.length && (
                    <tr className="border-bottom-2-dark-gray pb-3 pt-1">
                        <th scope="col">Date</th>
                        <th scope="col" className="text-sm-end">
                            FIAT/Crypto
                        </th>
                        <th scope="col" className="text-center text-sm-end">
                            Fee
                        </th>
                        <th scope="col" className="text-center text-sm-end">
                            Status
                        </th>
                    </tr>
                )}
                {list?.map(
                    ({
                        id,
                        date,
                        time,
                        amount,
                        asset,
                        fee,
                        status,
                        type,
                        paymentId,
                    }) => (
                        <>
                            <tr
                                className="border-bottom-2-dark-gray cursor-pointer"
                                onClick={() => toggleDetails(id)}
                            >
                                <td className="text-light pe-5 pe-sm-0 fw-light">
                                    <div className="fs-16px">{date}</div>
                                    <div className="text-secondary fs-12px mt-1 fw-500">
                                        {time}
                                    </div>
                                </td>
                                <td className="pe-5 pe-sm-0 white-space-nowrap text-uppercase">
                                    <div className="text-sm-end fs-16px">
                                        {amount + "" + asset}
                                    </div>
                                </td>
                                <td className="text-end pe-5 pe-sm-0 white-space-nowrap">
                                    {fee + " " + asset}
                                </td>
                                <td className="d-flex align-items-center justify-content-end">
                                    <div
                                        className={`${
                                            status
                                                ? "green-bullet"
                                                : "red-bullet"
                                        } me-2`}
                                    ></div>
                                    <div>{status ? "Completed" : "Failed"}</div>
                                    <button className="btn text-light border-0">
                                        {currentRowsOpen.includes(id) ? (
                                            <img
                                                src={AccordionUpIcon}
                                                className="icon-sm ms-2 cursor-pointer"
                                                alt="Down arrow icon"
                                            />
                                        ) : (
                                            <img
                                                src={AccordionDownIcon}
                                                className="icon-sm ms-2 cursor-pointer"
                                                alt="Down arrow icon"
                                            />
                                        )}
                                    </button>
                                </td>
                            </tr>
                            <tr
                                className="text-light d-none px-5"
                                id={`transaction-details-${id}`}
                            >
                                <td colSpan={tabs.length}>
                                    <div className="d-flex align-items-start justify-content-between">
                                        <div className="text-capitalize fs-12px">
                                            <div>
                                                <span className="text-secondary pe-1">
                                                    type:
                                                </span>
                                                <span className="fw-500">
                                                    {type}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-secondary pe-1">
                                                    amount:
                                                </span>
                                                <span className="fw-500">
                                                    {amount + " " + asset}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-secondary pe-1">
                                                    fee:
                                                </span>
                                                <span className="fw-500">
                                                    {fee + " " + asset}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-secondary pe-1">
                                                    date:
                                                </span>
                                                <span className="fw-500">
                                                    {date + " " + time}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-secondary pe-1">
                                                    asset:
                                                </span>
                                                <span className="fw-500">
                                                    {asset}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-capitalize fs-12px">
                                            <div>
                                                <span className="text-secondary pe-1">
                                                    Payment-ID:
                                                </span>
                                                <span className="fw-500">
                                                    {paymentId}
                                                </span>
                                            </div>
                                            {type === "Crypto Deposit" && (
                                                <div>
                                                    <span className="text-secondary pe-1">
                                                        Address:
                                                    </span>
                                                    <span className="fw-500">
                                                        12hfi6sh...l6shi
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-secondary pe-1">
                                                    Status:
                                                </span>
                                                <span className="fw-500">
                                                    {status
                                                        ? "Success"
                                                        : "Failed"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="fs-12px">
                                            <button
                                                className="btn fs-12px p-0 text-success text-decoration-success text-decoration-underline"
                                                onClick={() =>
                                                    downloadContent(
                                                        id,
                                                        date,
                                                        time,
                                                        amount,
                                                        asset,
                                                        fee,
                                                        status,
                                                        type,
                                                        paymentId
                                                    )
                                                }
                                            >
                                                Get PDF Receipt
                                            </button>

                                            <div className="text-light text-underline">
                                                Hide this activity
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </>
                    )
                )}
            </table>
        </div>
    );
}
