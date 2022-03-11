import React from "react";
import DepositTable from "./deposit-table";
import { useTransactions } from "./transactions-context";
import WithdrawTable from "./withdraw-table";

export default function Transactions() {
    const { currentTab, setCurrentTab, tabs } = useTransactions();
    return (
        <div className="overflow-x-auto">
            <div className="d-flex align-items-center justify-content-between">
                {tabs.map((item) => {
                    return (
                        <button
                            key={item.index}
                            onClick={() => setCurrentTab(item.index)}
                            className={`btn rounded-0 w-100 fw-bold text-uppercase bg-transparent ${
                                item.index === currentTab
                                    ? "btn-outline-light text-light"
                                    : "btn-outline-secondary"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
            {currentTab === 0 && <DepositTable />}
            {currentTab === 1 && <WithdrawTable />}
        </div>
    );
}
