import React from "react";

export default function Transactions() {
    return (
        <div className="overflow-x-auto">
            <div className="d-flex align-items-center justify-content-between">
                <div className="btn btn-outline-light rounded-0 w-100 fw-bold text-uppercase">
                    deposit
                </div>
                <div className="btn btn-outline-secondary rounded-0 w-100 fw-bold text-uppercase">
                    withdraw
                </div>
                <div className="btn btn-outline-secondary rounded-0 w-100 fw-bold text-uppercase">
                    bid
                </div>
                <div className="btn btn-outline-secondary rounded-0 w-100 fw-bold text-uppercase">
                    buy
                </div>
                <div className="btn btn-outline-secondary rounded-0 w-100 fw-bold text-uppercase">
                    statements
                </div>
            </div>
            <div className="px-4">
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
                    {[...Array(5).keys()].map((item) => (
                        <tr className="border-bottom-2-dark-gray my-5">
                            <td scope="row" className="text-light pe-5 pe-sm-0 fw-light">
                                <div className="fs-16px">12/27/2021</div>
                                <div className="text-secondary fs-12px mt-1 fw-500">21:31:12</div>
                            </td>
                            <td className="pe-5 pe-sm-0 white-space-nowrap text-uppercase">
                                <div className="text-sm-end fs-16px">
                                    120 USD
                                    <br />
                                    <div className="text-secondary fs-12px mt-1 fw-500">
                                        121 USDT
                                    </div>
                                </div>
                            </td>
                            <td className="text-end pe-5 pe-sm-0">1.08 USDT</td>
                            <td className="d-flex align-items-center justify-content-end pe-5 pe-sm-0">
                                <div className="green-bullet me-2"></div>
                                <div>Completed</div>
                                <div>
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
                                </div>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
        </div>
    );
}
