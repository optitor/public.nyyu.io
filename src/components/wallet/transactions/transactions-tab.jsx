import React from "react";
import DepositTable from "./deposit-table";
import { useTransactions } from "./transactions-context";

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
                            className={`btn rounded-0 w-100 fw-bold text-uppercase ${
                                item.index === currentTab
                                    ? "btn-outline-light"
                                    : "btn-outline-secondary"
                            }`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
            {currentTab === 0 && <DepositTable />}
        </div>
    );
}
