import React, { useContext, useState } from "react";
export const TransactionsContext = React.createContext();
export const useTransactions = () => useContext(TransactionsContext);

const TransactionsProvider = ({ children }) => {
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
    const [currentTab, setCurrentTab] = useState(0);
    const valueObject = { currentTab, setCurrentTab, tabs };
    return (
        <TransactionsContext.Provider value={valueObject}>
            {children}
        </TransactionsContext.Provider>
    );
};

export default TransactionsProvider;
