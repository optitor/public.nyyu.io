import React, { useState } from "react";
import { useTransactions } from "./transactions-context";

export default function DepositTable() {
    // Containers
    const { tabs, depositTransactions } = useTransactions();
    const [currentRowsOpen, setCurrentRowsOpen] = useState([]);

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

    // Render
    return (
        <div className="px-4 table-responsive transaction-section-tables">
            <table className="wallet-transaction-table w-100">
                <tr className="border-bottom-2-dark-gray py-3">
                    <th scope="col">Date</th>
                    <th scope="col" className="text-sm-end">
                        FIAT/Crypto
                    </th>
                    <th scope="col" className="text-sm-end">
                        Fee
                    </th>
                    <th scope="col" className="text-sm-end">
                        Status
                    </th>
                </tr>
                {depositTransactions.map(
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
                                <td
                                    scope="row"
                                    className="text-light pe-5 pe-sm-0 fw-light"
                                >
                                    <div className="fs-16px">{date}</div>
                                    <div className="text-secondary fs-12px mt-1 fw-500">
                                        {time}
                                    </div>
                                </td>
                                <td className="pe-5 pe-sm-0 white-space-nowrap text-uppercase">
                                    <div className="text-sm-end fs-16px">
                                        {amount + "" + asset}
                                        <br />
                                        <div className="text-secondary fs-12px mt-1 fw-500">
                                            121 USDT
                                        </div>
                                    </div>
                                </td>
                                <td className="text-end pe-5 pe-sm-0">
                                    {fee + " " + asset}
                                </td>
                                <td className="d-flex align-items-center justify-content-end pe-5 pe-sm-0">
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
                                            <svg
                                                className="icon-25px ms-2 cursor-pointer"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="icon-25px ms-2 cursor-pointer"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
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
                                                    {fee}
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
                                            <div className="text-success text-decoration-success text-decoration-underline">
                                                Get PDF Receipt
                                            </div>
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
