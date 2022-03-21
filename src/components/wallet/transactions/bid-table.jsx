import { Link } from "gatsby";
import React, { useState } from "react";
import { BTCGrayIcon, Credit, NdbWallet } from "../../../utilities/imgImport";
import { useTransactions } from "./transactions-context";
import { ROUTES } from "../../../utilities/routes";
import Pagination from "react-js-pagination";

export default function BidTable() {
    // Containers
    const { bidList: list, itemsCountPerPage } = useTransactions();
    const [activePage, setActivePage] = useState(1);

    // Render
    return (
        <div className="px-4 table-responsive transaction-section-tables mb-5 mb-sm-0">
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
                {list?.length === 0 && (
                    <tr className="py-4 text-center">
                        <td
                            colSpan={5}
                            className="text-light fs-16px text-uppercase fw-500"
                        >
                            no records found
                        </td>
                    </tr>
                )}
                {list
                    ?.slice(
                        (activePage - 1) * itemsCountPerPage,
                        activePage * itemsCountPerPage
                    )
                    ?.map(({ round, date, time, amount, payment, status }) => (
                        <>
                            <tr className="border-bottom-2-dark-gray">
                                <td className="text-light pe-5 pe-sm-0 fw-light fs-16px ">
                                    <div className="fw-500">Round {round}</div>
                                </td>
                                <td className="text-light pe-5 pe-sm-0 fw-light">
                                    <div className="fs-16px">{date}</div>
                                    <div className="text-secondary fs-12px mt-1 fw-500">
                                        {time}
                                    </div>
                                </td>
                                <td className="pe-5 pe-sm-0 white-space-nowrap text-uppercase">
                                    <div className="text-sm-end fs-16px">
                                        {amount} USD
                                    </div>
                                </td>
                                <td className="text-end pe-5 pe-sm-0">
                                    <img
                                        src={
                                            payment === 1
                                                ? Credit
                                                : payment === 2
                                                ? BTCGrayIcon
                                                : NdbWallet
                                        }
                                        alt=""
                                    />
                                </td>
                                {status === 0 ? (
                                    <td className="d-flex flex-column align-items-end">
                                        <div className="d-flex align-items-center justify-content-end">
                                            <div className="gray-bullet me-2"></div>
                                            <div>Processing</div>
                                        </div>
                                        {status === 0 && (
                                            <Link
                                                to={ROUTES.auction}
                                                className="text-success mt-1 fw-500 text-decoration-underline text-decoration-success white-space-nowrap fs-14px"
                                            >
                                                Increase bid
                                            </Link>
                                        )}
                                    </td>
                                ) : status === 1 ? (
                                    <td className="d-flex align-items-center justify-content-end">
                                        <div className="green-bullet me-2"></div>
                                        <div>Won</div>
                                    </td>
                                ) : (
                                    <td className="d-flex align-items-center justify-content-end">
                                        <div className="red-bullet me-2"></div>
                                        <div>Lost</div>
                                    </td>
                                )}
                            </tr>
                        </>
                    ))}
            </table>
            <Pagination
                activePage={activePage}
                itemsCountPerPage={itemsCountPerPage}
                totalItemsCount={list.length}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => setActivePage(pageNumber)}
            />
        </div>
    );
}
