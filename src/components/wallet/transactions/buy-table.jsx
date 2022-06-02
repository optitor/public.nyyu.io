import React, { useEffect, useState } from "react";
import { BTCGrayIcon, Credit, NdbWallet } from "../../../utilities/imgImport";
import { useTransactions } from "./transactions-context";
import Pagination from "react-js-pagination";
import { Icons } from "../../../utilities/Icons";

export default function BuyTable() {
    // Containers
    const { presaleList, itemsCountPerPage } = useTransactions();
    const [list, setList] = useState(presaleList);
    const [sortType, setSortType] = useState(null);
    const [activePage, setActivePage] = useState(1);

    // Methods
    const headerTitle = ({ title, up, down }) => (
        <th scope="col">
            <div
                className="d-flex align-items-center gap-1 noselect cursor-pointer"
                onClick={() =>
                    sortType === down
                        ? setSortType(up)
                        : sortType === up
                        ? setSortType(down)
                        : setSortType(up)
                }
            >
                <div>{title}</div>
                <div
                    className={`${
                        (sortType === up || sortType === down) && "text-success"
                    }`}
                >
                    {sortType === down
                        ? Icons.down()
                        : sortType === up
                        ? Icons.up()
                        : Icons.up()}
                </div>
            </div>
        </th>
    );

    useEffect(() => {
        if (sortType === null) return setList(presaleList);
        if (sortType === "date_down")
            return setList(
                presaleList.sort(
                    (item2, item1) =>
                        new Date(item1.date).getTime() -
                        new Date(item2.date).getTime()
                )
            );
        if (sortType === "date_up")
            return setList(
                presaleList.sort(
                    (item2, item1) =>
                        new Date(item2.date).getTime() -
                        new Date(item1.date).getTime()
                )
            );
        if (sortType === "amount_down")
            return setList(
                presaleList.sort((item2, item1) => item1.amount - item2.amount)
            );
        if (sortType === "amount_up")
            return setList(
                presaleList.sort((item2, item1) => item2.amount - item1.amount)
            );
        if (sortType === "transaction_down")
            return setList(
                presaleList.sort(
                    (item2, item1) => item1.transaction - item2.transaction
                )
            );
        if (sortType === "transaction_up")
            return setList(
                presaleList.sort(
                    (item2, item1) => item2.transaction - item1.transaction
                )
            );
    }, [sortType]);

    // Render
    return (
        <>
            <div className="px-4 table-responsive transaction-section-tables mb-5 mb-sm-0">
                <table className="wallet-transaction-table w-100">
                    <tr className="border-bottom-2-dark-gray py-3">
                        {headerTitle({
                            title: "Transaction",
                            up: "transaction_up",
                            down: "transaction_down",
                        })}
                        {headerTitle({
                            title: "Date",
                            up: "date_up",
                            down: "date_down",
                        })}
                        {headerTitle({
                            title: "Amount",
                            up: "amount_up",
                            down: "amount_down",
                        })}
                        <th scope="col" className="text-sm-end">
                            Payment
                        </th>
                        <th scope="col" className="text-end">
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
                        ?.map(
                            ({
                                transaction,
                                date,
                                time,
                                amount,
                                payment,
                                status,
                            }) => (
                                <>
                                    <tr className="border-bottom-2-dark-gray">
                                        <td className="text-light pe-5 pe-sm-0 fw-light fs-16px">
                                            <div className="fw-500 white-space-nowrap">
                                                {transaction + " #"}
                                            </div>
                                        </td>
                                        <td className="text-light pe-5 pe-sm-0 fw-light">
                                            <div className="fs-16px">
                                                {date}
                                            </div>
                                            <div className="text-secondary fs-12px mt-1 fw-500">
                                                {time}
                                            </div>
                                        </td>
                                        <td className="pe-5 pe-sm-0 white-space-nowrap text-uppercase">
                                            <div className="text-sm-start fs-16px">
                                                {Number(amount).toFixed(2) + " " + "USD"}
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
                                                alt="Payment icon"
                                            />
                                        </td>
                                        {status === 0 ? (
                                            <td className="d-flex flex-column align-items-end">
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <div className="gray-bullet me-2"></div>
                                                    <div>Processing</div>
                                                </div>
                                                <div className="text-secondary text-decoration-underline text-decoration-secondary fs-14px">
                                                    Cancel
                                                </div>
                                            </td>
                                        ) : status === 1 ? (
                                            <td className="d-flex align-items-center justify-content-end">
                                                <div className="green-bullet me-2"></div>
                                                <div>Success</div>
                                            </td>
                                        ) : (
                                            <td className="d-flex align-items-center justify-content-end">
                                                <div className="red-bullet me-2"></div>
                                                <div>Fail</div>
                                            </td>
                                        )}
                                    </tr>
                                </>
                            )
                        )}
                </table>
            </div>
            {list?.length > 3 && (
                <div className="px-4">
                    <Pagination
                        activePage={activePage}
                        itemsCountPerPage={itemsCountPerPage}
                        totalItemsCount={list.length}
                        pageRangeDisplayed={5}
                        onChange={(pageNumber) => setActivePage(pageNumber)}
                    />
                </div>
            )}
        </>
    );
}
