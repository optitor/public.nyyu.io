<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import {
    AccordionDownIcon,
    AccordionUpIcon,
} from "../../../utilities/imgImport";
import { receiptTemplate } from "./receiptTemplate";
import { useTransactions } from "./transactions-context";
import Pagination from "react-js-pagination";
import { Icons } from "../../../utilities/Icons";

const withdrawOptions = [
    { value: "paypal", label: "Paypal" },
    { value: "crypto", label: "Crypto" },
];

export default function WithdrawTable() {
    // Containers
    const user = useSelector((state) => state.auth.user);
    const {
        tabs,
        paypalWithdrawTransactions,
        coinWithdrawTransactions,
        itemsCountPerPage,
    } = useTransactions();
    const [list, setList] = useState(paypalWithdrawTransactions);
    const [sortType, setSortType] = useState(null);
    const [currentRowOpen, setCurrentRowOpen] = useState(-1);
    const [currentWithdrawType, setCurrentWithdrawType] = useState(
        withdrawOptions[0]
    );
    const [activePage, setActivePage] = useState(1);

    // Methods
    const headerTitle = ({ title, up, down, end }) => (
        <th scope="col">
            <div
                className={`d-flex align-items-center gap-1 noselect cursor-pointer ${
                    end && "justify-content-center justify-content-sm-end"
                }`}
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

    const toggleDetails = (index) => {
        const previousItem = document.getElementById(
            `transaction-details-${currentRowOpen}`
        );
        if (previousItem) previousItem.classList.toggle("d-none");

        setCurrentRowOpen(index);
        const item = document.getElementById(`transaction-details-${index}`);
        if (item) item.classList.toggle("d-none");
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
        setActivePage(1);
        toggleDetails(-1);
        setCurrentWithdrawType(type);
        if (type.value === "paypal") setList(paypalWithdrawTransactions);
        if (type.value === "crypto") setList(coinWithdrawTransactions);
    };

    useEffect(() => {
        if (sortType === null) return changeDepositType(currentWithdrawType);
        if (sortType === "date_down")
            return setList(
                list.sort(
                    (item2, item1) =>
                        new Date(item1.date).getTime() -
                        new Date(item2.date).getTime()
                )
            );
        if (sortType === "date_up")
            return setList(
                list.sort(
                    (item2, item1) =>
                        new Date(item2.date).getTime() -
                        new Date(item1.date).getTime()
                )
            );

        if (sortType === "amount_down")
            return setList(
                list.sort((item2, item1) => item1.amount - item2.amount)
            );

        if (sortType === "amount_up")
            return setList(
                list.sort((item2, item1) => item2.amount - item1.amount)
            );
        if (sortType === "fee_down")
            return setList(list.sort((item2, item1) => item1.fee - item2.fee));

        if (sortType === "fee_up")
            return setList(list.sort((item2, item1) => item2.fee - item1.fee));
    }, [sortType]);

    // Render
    return (
        <>
            <div className="mt-4 px-md-4 d-inline-block">
                <Select
                    isSearchable={false}
                    options={withdrawOptions}
                    defaultValue={withdrawOptions[0]}
                    value={currentWithdrawType}
                    onChange={changeDepositType}
                />
            </div>
            <div className="px-sm-4 px-3 table-responsive transaction-section-tables mb-5 mb-sm-0">
                <table className="wallet-transaction-table w-100">
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
                            {headerTitle({
                                title: "Date",
                                up: "date_up",
                                down: "date_down",
                            })}
                            {headerTitle({
                                title: "FIAT/Crypto",
                                up: "amount_up",
                                down: "amount_down",
                                end: true,
                            })}
                            {headerTitle({
                                title: "Fee",
                                up: "fee_up",
                                down: "fee_down",
                                end: true,
                            })}
                            <th scope="col" className="text-center text-sm-end">
                                Status
                            </th>
                        </tr>
                    )}
                    {list
                        ?.slice(
                            (activePage - 1) * itemsCountPerPage,
                            activePage * itemsCountPerPage
                        )
                        ?.map(
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
                                        onClick={() =>
                                            toggleDetails(
                                                id === currentRowOpen ? -1 : id
                                            )
                                        }
                                    >
                                        <td className="text-light pe-5 pe-sm-0 fw-light">
                                            <div className="fs-16px">
                                                {date}
                                            </div>
                                            <div className="text-secondary fs-12px mt-1 fw-500">
                                                {time}
                                            </div>
                                        </td>
                                        <td className="pe-5 pe-sm-0 white-space-nowrap text-uppercase">
                                            <div className="text-sm-end fs-16px">                                        
                                                {currentWithdrawType.value === 'paypal' && Number(amount).toFixed(2) + ' ' + asset}
                                                {currentWithdrawType.value === 'crypto' && (amount).toFixed(8) + ' ' + asset}
                                            </div>
                                        </td>
                                        <td className="text-end pe-5 pe-sm-0 white-space-nowrap">
                                            {currentWithdrawType.value === 'crypto'? Number(fee).toFixed(8) + " " + asset: Number(fee).toFixed(2) + ' ' + asset}
                                        </td>
                                        <td className="d-flex align-items-center justify-content-end">
                                            <div
                                                className={`
                                                ${status === 0 ? "gray-bullet" : ""}
                                                ${status === 1 ? "green-bullet" : ""}
                                                ${status === 2 ? "red-bullet" : ""}
                                                    me-2`}
                                            ></div>
                                            <div>
                                                {status === 0 && "Pending"}
                                                {status === 1 && "Completed"}
                                                {status === 2 && "Denied"}
                                            </div>
                                            <button className="btn text-light border-0">
                                                {id === currentRowOpen ? (
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
                                                            {currentWithdrawType.value === 'paypal' && Number(amount).toFixed(2) + ' ' + asset}
                                                            {currentWithdrawType.value === 'crypto' && (amount).toFixed(8) + ' ' + asset}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-secondary pe-1">
                                                            fee:
                                                        </span>
                                                        <span className="fw-500">
                                                            {currentWithdrawType.value === 'crypto'? Number(fee).toFixed(8) + " " + asset: Number(fee).toFixed(2) + ' ' + asset}
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
                                                    {type ===
                                                        "Crypto Deposit" && (
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
                                                            {status === 0 && "Pending"}
                                                            {status === 1 && "Success"}
                                                            {status === 2 && "Denied"}
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
            {list?.length > 5 && (
                <div className="px-4">
                    <Pagination
                        activePage={activePage}
                        itemsCountPerPage={itemsCountPerPage}
                        totalItemsCount={list.length}
                        pageRangeDisplayed={5}
                        onChange={(pageNumber) => {
                            toggleDetails(-1);
                            setActivePage(pageNumber);
                        }}
                    />
                </div>
            )}
        </>
    );
}
=======
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import {
    AccordionDownIcon,
    AccordionUpIcon,
} from "../../../utilities/imgImport";
import { receiptTemplate } from "./receiptTemplate";
import { useTransactions } from "./transactions-context";
import Pagination from "react-js-pagination";
import { Icons } from "../../../utilities/Icons";

const withdrawOptions = [
    { value: "paypal", label: "Paypal" },
    { value: "crypto", label: "Crypto" },
];

export default function WithdrawTable() {
    // Containers
    const user = useSelector((state) => state.auth.user);
    const {
        tabs,
        paypalWithdrawTransactions,
        coinWithdrawTransactions,
        itemsCountPerPage,
    } = useTransactions();
    const [list, setList] = useState(paypalWithdrawTransactions);
    const [sortType, setSortType] = useState(null);
    const [currentRowOpen, setCurrentRowOpen] = useState(-1);
    const [currentWithdrawType, setCurrentWithdrawType] = useState(
        withdrawOptions[0]
    );
    const [activePage, setActivePage] = useState(1);

    // Methods
    const headerTitle = ({ title, up, down, end }) => (
        <th scope="col">
            <div
                className={`d-flex align-items-center gap-1 noselect cursor-pointer ${
                    end && "justify-content-center justify-content-sm-end"
                }`}
                onClick={() =>
                    sortType === down
                        ? setSortType(up)
                        : sortType === up
                        ? setSortType(down)
                        : setSortType(up)
                }
                onKeyDown={() =>
                    sortType === down
                        ? setSortType(up)
                        : sortType === up
                        ? setSortType(down)
                        : setSortType(up)
                }
                role="tab"
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

    const toggleDetails = (index) => {
        const previousItem = document.getElementById(
            `transaction-details-${currentRowOpen}`
        );
        if (previousItem) previousItem.classList.toggle("d-none");

        setCurrentRowOpen(index);
        const item = document.getElementById(`transaction-details-${index}`);
        if (item) item.classList.toggle("d-none");
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
        setActivePage(1);
        toggleDetails(-1);
        setCurrentWithdrawType(type);
        if (type.value === "paypal") setList(paypalWithdrawTransactions);
        if (type.value === "crypto") setList(coinWithdrawTransactions);
    };

    useEffect(() => {
        if (sortType === null) return changeDepositType(currentWithdrawType);
        if (sortType === "date_down")
            return setList(
                list.sort(
                    (item2, item1) =>
                        new Date(item1.date).getTime() -
                        new Date(item2.date).getTime()
                )
            );
        if (sortType === "date_up")
            return setList(
                list.sort(
                    (item2, item1) =>
                        new Date(item2.date).getTime() -
                        new Date(item1.date).getTime()
                )
            );

        if (sortType === "amount_down")
            return setList(
                list.sort((item2, item1) => item1.amount - item2.amount)
            );

        if (sortType === "amount_up")
            return setList(
                list.sort((item2, item1) => item2.amount - item1.amount)
            );
        if (sortType === "fee_down")
            return setList(list.sort((item2, item1) => item1.fee - item2.fee));

        if (sortType === "fee_up")
            return setList(list.sort((item2, item1) => item2.fee - item1.fee));
    }, [sortType, currentWithdrawType, list]);

    // Render
    return (
        <>
            <div className="mt-4 px-md-4 d-inline-block">
                <Select
                    isSearchable={false}
                    options={withdrawOptions}
                    defaultValue={withdrawOptions[0]}
                    value={currentWithdrawType}
                    onChange={changeDepositType}
                />
            </div>
            <div className="px-sm-4 px-3 table-responsive transaction-section-tables mb-5 mb-sm-0">
                <table className="wallet-transaction-table w-100">
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
                            {headerTitle({
                                title: "Date",
                                up: "date_up",
                                down: "date_down",
                            })}
                            {headerTitle({
                                title: "FIAT/Crypto",
                                up: "amount_up",
                                down: "amount_down",
                                end: true,
                            })}
                            {headerTitle({
                                title: "Fee",
                                up: "fee_up",
                                down: "fee_down",
                                end: true,
                            })}
                            <th scope="col" className="text-center text-sm-end">
                                Status
                            </th>
                        </tr>
                    )}
                    {list
                        ?.slice(
                            (activePage - 1) * itemsCountPerPage,
                            activePage * itemsCountPerPage
                        )
                        ?.map(
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
                                        onClick={() =>
                                            toggleDetails(
                                                id === currentRowOpen ? -1 : id
                                            )
                                        }
                                    >
                                        <td className="text-light pe-5 pe-sm-0 fw-light">
                                            <div className="fs-16px">
                                                {date}
                                            </div>
                                            <div className="text-secondary fs-12px mt-1 fw-500">
                                                {time}
                                            </div>
                                        </td>
                                        <td className="pe-5 pe-sm-0 white-space-nowrap text-uppercase">
                                            <div className="text-sm-end fs-16px">                                        
                                                {currentWithdrawType.value === 'paypal' && Number(amount).toFixed(2) + ' ' + asset}
                                                {currentWithdrawType.value === 'crypto' && (amount).toFixed(8) + ' ' + asset}
                                            </div>
                                        </td>
                                        <td className="text-end pe-5 pe-sm-0 white-space-nowrap">
                                            {currentWithdrawType.value === 'crypto'? Number(fee).toFixed(8) + " " + asset: Number(fee).toFixed(2) + ' ' + asset}
                                        </td>
                                        <td className="d-flex align-items-center justify-content-end">
                                            <div
                                                className={`
                                                ${status === 0 ? "gray-bullet" : ""}
                                                ${status === 1 ? "green-bullet" : ""}
                                                ${status === 2 ? "red-bullet" : ""}
                                                    me-2`}
                                            ></div>
                                            <div>
                                                {status === 0 && "Pending"}
                                                {status === 1 && "Completed"}
                                                {status === 2 && "Denied"}
                                            </div>
                                            <button className="btn text-light border-0">
                                                {id === currentRowOpen ? (
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
                                                            {currentWithdrawType.value === 'paypal' && Number(amount).toFixed(2) + ' ' + asset}
                                                            {currentWithdrawType.value === 'crypto' && (amount).toFixed(8) + ' ' + asset}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-secondary pe-1">
                                                            fee:
                                                        </span>
                                                        <span className="fw-500">
                                                            {currentWithdrawType.value === 'crypto'? Number(fee).toFixed(8) + " " + asset: Number(fee).toFixed(2) + ' ' + asset}
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
                                                    {type ===
                                                        "Crypto Deposit" && (
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
                                                            {status === 0 && "Pending"}
                                                            {status === 1 && "Success"}
                                                            {status === 2 && "Denied"}
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
            {list?.length > 5 && (
                <div className="px-4">
                    <Pagination
                        activePage={activePage}
                        itemsCountPerPage={itemsCountPerPage}
                        totalItemsCount={list.length}
                        pageRangeDisplayed={5}
                        onChange={(pageNumber) => {
                            toggleDetails(-1);
                            setActivePage(pageNumber);
                        }}
                    />
                </div>
            )}
        </>
    );
}
>>>>>>> 34e88146a677b222e9639614901f57f31dbf7ba3
