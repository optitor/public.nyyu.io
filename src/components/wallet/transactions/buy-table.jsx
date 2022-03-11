import React from "react";
import { BTCGrayIcon } from "../../../utilities/imgImport";

export default function BuyTable() {
    // Containers

    // Render
    return (
        <div className="px-4 table-responsive transaction-section-tables">
            <table className="wallet-transaction-table w-100">
                <tr className="border-bottom-2-dark-gray py-3">
                    <th scope="col">Auction</th>
                    <th scope="col">Date</th>
                    <th scope="col" className="text-sm-end">
                        Amount
                    </th>
                    <th scope="col" className="text-sm-end">
                        Payment
                    </th>
                    <th scope="col" className="text-sm-end">
                        Status
                    </th>
                </tr>
                <tr className="border-bottom-2-dark-gray">
                    <td className="text-light pe-5 pe-sm-0 fw-light fs-16px ">
                        <div className="fw-500">123456789 #</div>
                    </td>
                    <td className="text-light pe-5 pe-sm-0 fw-light">
                        <div className="fs-16px">12/27/2021</div>
                        <div className="text-secondary fs-12px mt-1 fw-500">
                            21:31:12
                        </div>
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
                    <td className="text-end pe-5 pe-sm-0">
                        <img src={BTCGrayIcon} alt="" />
                    </td>
                    <td className="d-flex flex-column align-items-end">
                        <div className="d-flex align-items-center justify-content-end pe-5 pe-sm-0">
                            <div className="gray-bullet me-2"></div>
                            <div>Processing</div>
                        </div>
                        <div className="text-secondary text-decoration-underline text-decoration-secondary fs-14px">
                            Cancel
                        </div>
                    </td>
                </tr>
                {[...Array(10).keys()].map((item) => (
                    <>
                        <tr className="border-bottom-2-dark-gray">
                            <td className="text-light pe-5 pe-sm-0 fw-light fs-16px ">
                                <div className="fw-500">Round 7</div>
                            </td>
                            <td className="text-light pe-5 pe-sm-0 fw-light">
                                <div className="fs-16px">12/27/2021</div>
                                <div className="text-secondary fs-12px mt-1 fw-500">
                                    21:31:12
                                </div>
                            </td>
                            <td className="pe-5 pe-sm-0 white-space-nowrap text-uppercase">
                                <div className="text-sm-end fs-16px">
                                    2,497,5000
                                    <br />
                                    <div className="text-secondary fs-12px mt-1 fw-bold">
                                        NDB
                                    </div>
                                </div>
                            </td>
                            <td className="text-end pe-5 pe-sm-0">
                                <img src={BTCGrayIcon} alt="" />
                            </td>
                            <td className="d-flex align-items-center justify-content-end pe-5 pe-sm-0">
                                <div className="red-bullet me-2"></div>
                                <div>Fail</div>
                            </td>
                        </tr>
                        <tr className="border-bottom-2-dark-gray">
                            <td className="text-light pe-5 pe-sm-0 fw-light fs-16px ">
                                <div className="fw-500">Round 7</div>
                            </td>
                            <td className="text-light pe-5 pe-sm-0 fw-light">
                                <div className="fs-16px">12/27/2021</div>
                                <div className="text-secondary fs-12px mt-1 fw-500">
                                    21:31:12
                                </div>
                            </td>
                            <td className="pe-5 pe-sm-0 white-space-nowrap text-uppercase">
                                <div className="text-sm-end fs-16px">
                                    2,497,5000
                                    <br />
                                    <div className="text-secondary fs-12px mt-1 fw-bold">
                                        NDB
                                    </div>
                                </div>
                            </td>
                            <td className="text-end pe-5 pe-sm-0">
                                <img src={BTCGrayIcon} alt="" />
                            </td>
                            <td className="d-flex align-items-center justify-content-end pe-5 pe-sm-0">
                                <div className="green-bullet me-2"></div>
                                <div>Success</div>
                            </td>
                        </tr>
                    </>
                ))}
            </table>
        </div>
    );
}
