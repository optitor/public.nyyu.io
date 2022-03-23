import React, { useState } from "react";
import Pagination from "react-js-pagination";
import Select from "react-select";
import {
    AccordionDownIcon,
    AccordionUpIcon,
    DownloadIcon,
} from "../../../utilities/imgImport";
import { createDateFromDateObject } from "../../../utilities/utility-methods";
import { useTransactions } from "./transactions-context";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

export default function StatementsTable() {
    // Containers
    // Other variables.
    const { tabs, itemsCountPerPage } = useTransactions();
    const [currentRowOpen, setCurrentRowOpen] = useState(-1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(createDateFromDateObject());
    const [activePage, setActivePage] = useState(1);
    const [list, setList] = useState([...Array(15).keys()]);
    const depositOptions = [
        { value: "deposit", label: "Deposit" },
        { value: "withdraw", label: "Withdraw" },
        { value: "bid", label: "Bid" },
        { value: "buy", label: "Buy" },
    ];

    const periodOptions = [
        { index: 0, value: "weekly", label: "Weekly" },
        { index: 1, value: "monthly", label: "Monthly" },
        { index: 2, value: "quarterly", label: "Quarterly" },
        { index: 3, value: "semi_annually", label: "Semi Annually" },
        { index: 4, value: "annually", label: "Annually" },
        { index: 5, value: "all_time", label: "All Time" },
        { index: 6, value: "custom", label: "Custom" },
    ];
    const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
    const [selectedPeriodOption, setSelectedPeriodOption] = useState(
        periodOptions[selectedPeriodIndex]
    );
    const [selectedDepositOption, setSelectedDepositOption] = useState(
        depositOptions[0]
    );

    // Utility variables.
    const now = new Date();
    const lastWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7
    );
    const lastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
    );
    const last4Month = new Date(
        now.getFullYear(),
        now.getMonth() - 4,
        now.getDate()
    );
    const last6Month = new Date(
        now.getFullYear(),
        now.getMonth() - 6,
        now.getDate()
    );
    const lastYear = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
    );
    const allTime = new Date(0);
    const timeFrames = [
        lastWeek,
        lastMonth,
        last4Month,
        last6Month,
        lastYear,
        allTime,
    ];
    const [from, setFrom] = useState(timeFrames[selectedPeriodIndex]);
    const [to, setTo] = useState(now);

    // Methods
    const toggleDetails = (index) => {
        const previousItem = document.getElementById(
            `transaction-details-${currentRowOpen}`
        );
        if (previousItem) previousItem.classList.toggle("d-none");

        setCurrentRowOpen(index);
        const item = document.getElementById(`transaction-details-${index}`);
        if (item) item.classList.toggle("d-none");
    };

    // Render
    return (
        <>
            <div className="text-capitalize text-light pt-4 px-4">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <Select
                            isSearchable={false}
                            options={depositOptions}
                            value={selectedDepositOption}
                            onChange={(option) =>
                                setSelectedDepositOption(option)
                            }
                        />
                    </div>
                    <div>
                        <Select
                            isSearchable={false}
                            options={periodOptions}
                            value={selectedPeriodOption}
                            onChange={(option) => {
                                setSelectedPeriodOption(option);
                                setSelectedPeriodIndex(option.index);
                                if (option.value === "custom") {
                                    setFrom(now);
                                    setTo(now);
                                } else setFrom(timeFrames[option.index]);
                            }}
                        />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <div className="date-title">start date:</div>
                        {selectedPeriodOption.value === "custom" ? (
                            <DayPickerInput
                                placeholder="DD/MM/YYYY"
                                format="DD/MM/YYYY"
                                className="start-date-picker"
                                value={new Date(from)}
                                onDayChange={(day) => setStartDate(day)}
                            />
                        ) : (
                            <input
                                type="text"
                                disabled
                                value={createDateFromDateObject(new Date(from))}
                                className="start-date-picker disabled text-secondary"
                            />
                        )}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <div className="date-title">end date:</div>
                        {selectedPeriodOption.value === "custom" ? (
                            <DayPickerInput
                                placeholder="DD/MM/YYYY"
                                format="DD/MM/YYYY"
                                className="start-date-picker"
                                value={new Date(to)}
                                onDayChange={(day) => setEndDate(day)}
                            />
                        ) : (
                            <input
                                type="text"
                                disabled
                                value={createDateFromDateObject(new Date(to))}
                                className="start-date-picker disabled text-secondary"
                            />
                        )}
                    </div>
                    <div>
                        <img src={DownloadIcon} alt="Download icon" />
                    </div>
                </div>
            </div>
            <div className="px-sm-4 px-3 table-responsive transaction-section-tables mt-3">
                <table className="wallet-transaction-table w-100">
                    <tr className="border-bottom-2-dark-gray py-3">
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
                    {list
                        ?.slice(
                            (activePage - 1) * itemsCountPerPage,
                            activePage * itemsCountPerPage
                        )
                        ?.map((item) => (
                            <>
                                <tr className="border-bottom-2-dark-gray">
                                    <td
                                        scope="row"
                                        className="text-light pe-5 pe-sm-0 fw-light"
                                    >
                                        <label className="d-flex align-items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="form-check-input bg-transparent border border-light mt-0"
                                            />
                                            <div className="fs-16px">
                                                12 / 27 / 21
                                            </div>
                                        </label>
                                    </td>
                                    <td className="pe-5 pe-sm-0 white-space-nowrap text-uppercase">
                                        <div className="text-sm-end fs-16px">
                                            10 BTC
                                            <br />
                                            <div className="text-secondary fs-12px mt-1 fw-500">
                                                500,000 USDT
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-end pe-5 pe-sm-0 white-space-nowrap">
                                        1.08 USDT
                                    </td>
                                    <td className="d-flex align-items-center justify-content-end">
                                        <div className="green-bullet me-2"></div>
                                        <div>Completed</div>
                                        <button
                                            className="btn text-light border-0"
                                            onClick={() =>
                                                toggleDetails(
                                                    item === currentRowOpen
                                                        ? -1
                                                        : item
                                                )
                                            }
                                        >
                                            {item === currentRowOpen ? (
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
                                    id={`transaction-details-${item}`}
                                >
                                    <td colSpan={tabs.length}>
                                        <div className="d-flex align-items-start justify-content-between">
                                            <div className="text-capitalize fs-12px">
                                                <div>
                                                    <span className="text-secondary pe-1">
                                                        type:
                                                    </span>
                                                    <span className="fw-500">
                                                        Crypto Deposit
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-secondary pe-1">
                                                        amount:
                                                    </span>
                                                    <span className="fw-500">
                                                        10 BTC
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-secondary pe-1">
                                                        fee:
                                                    </span>
                                                    <span className="fw-500">
                                                        1.08 USDT
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-secondary pe-1">
                                                        date:
                                                    </span>
                                                    <span className="fw-500">
                                                        12 / 27 / 21
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-secondary pe-1">
                                                        asset:
                                                    </span>
                                                    <span className="fw-500">
                                                        BTC
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-capitalize fs-12px">
                                                <div>
                                                    <span className="text-secondary pe-1">
                                                        Payment-ID:
                                                    </span>
                                                    <span className="fw-500">
                                                        XXXX-XXXX-XXXX-XXXX
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-secondary pe-1">
                                                        Address:
                                                    </span>
                                                    <span className="fw-500">
                                                        12hfi6sh...l6shi
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-secondary pe-1">
                                                        Status:
                                                    </span>
                                                    <span className="fw-500">
                                                        Success
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
                        ))}
                </table>
            </div>
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
        </>
    );
}
