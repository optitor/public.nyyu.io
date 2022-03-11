import { useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { GET_ALL_PAPAL_DEPOSIT_TRANSACTIONS } from "./queries";

export const TransactionsContext = React.createContext();
export const useTransactions = () => useContext(TransactionsContext);

// static data
const tabs = [
    {
        index: 0,
        label: "deposit",
    },
    {
        index: 1,
        label: "withdraw",
    },
    {
        index: 2,
        label: "bid",
    },
    {
        index: 3,
        label: "buy",
    },
    {
        index: 4,
        label: "statements",
    },
];

const TransactionsProvider = ({ children }) => {
    // Containers
    const [currentTab, setCurrentTab] = useState(0);
    const [depositTransactions, setDepositTransactions] = useState([]);
    const loading = !depositTransactions.length;

    // Methods
    const createDateFromDate = (createdTime) => {
        return createdTime.getMonth().length === 1
            ? "0" + createdTime.getMonth()
            : createdTime.getMonth() + "/" + createdTime.getDay().length === 1
            ? "0" + createdTime.getDay()
            : createdTime.getDay() + "/" + createdTime.getFullYear();
    };

    // Webserver
    useQuery(GET_ALL_PAPAL_DEPOSIT_TRANSACTIONS, {
        onCompleted: (data) => {
            const fooList = data.getAllPaypalDepositTxns.map((item) => {
                const createdTime = new Date(item.createdAt);
                const date = createDateFromDate(createdTime);
                const time =
                    createdTime.getHours() +
                    ":" +
                    createdTime.getMinutes() +
                    ":" +
                    createdTime.getSeconds();

                return {
                    date,
                    time,
                };
            });

            console.log([...depositTransactions, ...fooList]);
            setDepositTransactions([...depositTransactions, ...fooList]);
        },
    });

    // Methods

    // Binding
    const valueObject = {
        currentTab,
        setCurrentTab,
        tabs,
        loading,
        depositTransactions,
    };

    // Render
    return (
        <TransactionsContext.Provider value={valueObject}>
            {children}
        </TransactionsContext.Provider>
    );
};

export default TransactionsProvider;
