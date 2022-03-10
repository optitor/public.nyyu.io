import React, { useContext, useState } from "react";
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

    // Webserver
    // useQuery()

    // Methods

    // Binding
    const valueObject = { currentTab, setCurrentTab, tabs };

    // Render
    return (
        <TransactionsContext.Provider value={valueObject}>
            {children}
        </TransactionsContext.Provider>
    );
};

export default TransactionsProvider;
