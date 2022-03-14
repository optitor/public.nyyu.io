import { useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import {
    GET_ALL_PAPAL_DEPOSIT_TRANSACTIONS,
    GET_BID_LIST_BY_USER,
} from "./queries";

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
    const [depositTransactions, setDepositTransactions] = useState(null);
    const [bidList, setBidList] = useState(null);
    const loading = !(depositTransactions && bidList);

    // Methods
    const createDateFromDate = (createdTime) => {
        let month = createdTime.getMonth();
        if (month < 10) month = "0" + month;
        let day = createdTime.getDay();
        if (day < 10) day = "0" + day;

        let year = createdTime.getFullYear();
        return month + "/" + day + "/" + year;
    };

    const createTimeFromDate = (createdTime) => {
        let hours = createdTime.getHours();
        if (hours < 10) hours = "0" + hours;
        let minutes = createdTime.getMinutes();
        if (minutes < 10) minutes = "0" + minutes;
        let seconds = createdTime.getSeconds();
        if (seconds < 10) seconds = "0" + seconds;

        return hours + ":" + minutes + ":" + seconds;
    };
    // Webserver
    useQuery(GET_ALL_PAPAL_DEPOSIT_TRANSACTIONS, {
        onCompleted: (data) => {
            const fooList = data.getAllPaypalDepositTxns.map((item) => {
                const createdTime = new Date(item.createdAt);

                return {
                    id: item.id,
                    date: createDateFromDate(createdTime),
                    time: createTimeFromDate(createdTime),
                    fee: item.fee,
                    status: item.status,
                    amount: item.fiatAmount,
                    type: "Paypal Deposit",
                    paymentId: item.paypalOrderId,
                    asset: item.fiatType,
                };
            });

            setDepositTransactions(fooList);
        },
    });
    useQuery(GET_BID_LIST_BY_USER, {
        onCompleted: (data) => {
            const fooList = data.getBidListByUser
                .sort((bid1, bid2) => bid2.placedAt - bid1.placedAt)
                .map((item) => {
                    const createdTime = new Date(item.placedAt);
                    return {
                        round: item.round,
                        date: createDateFromDate(createdTime),
                        time: createTimeFromDate(createdTime),
                        amount: item.totalAmount,
                        payment: item.payType,
                        status: item.status,
                    };
                });
            setBidList(fooList);
        },
        onError: (error) => console.log(error),
    });

    // Methods

    // Binding
    const valueObject = {
        // data
        depositTransactions,
        bidList,

        currentTab,
        setCurrentTab,
        tabs,
        loading,
    };

    // Render
    return (
        <TransactionsContext.Provider value={valueObject}>
            {children}
        </TransactionsContext.Provider>
    );
};

export default TransactionsProvider;

// Here is the status of the bid:
// NOT_CONFIRMED : 0
// WINNER        : 1
// FAILED        : 2

// Payment Methods
// 	CREDIT: 1
// 	CRYPTO: 2
// 	WALLET: 3
