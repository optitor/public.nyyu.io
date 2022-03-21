import { useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import { GET_ALL_FEES } from "../../../apollo/graghqls/querys/Payment";
import {
    GET_BID_LIST_BY_USER,
    GET_COINPAYMENT_DEPOSIT_TX_BY_USER,
    GET_PAPAL_DEPOSIT_TRANSACTIONS,
    GET_PRESALE_ORDERS_BY_USER,
    GET_STRIPE_DEPOSIT_TX_BY_USER,
    GET_PAYPAL_WITHDRAW_TRANSACTIONS,
    GET_CRYPTO_WITHDRAW_BY_USER,
    GET_BANK_DEPOSIT_TRANSACTIONS_BY_USER,
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

    const [paypalDepositTransactions, setPaypalDepositTransactions] =
        useState(null);
    const [paypalWithdrawTransactions, setPaypalWithdrawTransactions] =
        useState(null);

    const [coinDepositTransactions, setCoinDepositTransactions] =
        useState(null);
    const [coinWithdrawTransactions, setCoinWithdrawTransactions] =
        useState(null);

    const [stripeDepositTransactions, setStripeDepositTransactions] =
        useState(null);
    const [bankDepositTransactions, setBankDepositTransactions] =
        useState(null);
    const [bidList, setBidList] = useState(null);
    const [presaleList, setPresaleList] = useState(null);
    const loading = !(
        paypalDepositTransactions &&
        paypalWithdrawTransactions &&
        coinDepositTransactions &&
        coinWithdrawTransactions &&
        stripeDepositTransactions &&
        bankDepositTransactions &&
        bidList &&
        presaleList
    );

    // Methods
    const createDateFromDate = (createdTime) => {
        let month = createdTime.getMonth() + 1;
        if (month < 10) month = "0" + month;
        let day = createdTime.getDate();
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
    useQuery(GET_PAPAL_DEPOSIT_TRANSACTIONS, {
        onCompleted: (data) => {
            const fooList = data.getPaypalDepositTxnsByUser
                .sort((tx1, tx2) => tx2.createdAt - tx1.createdAt)
                .map((item) => {
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

            setPaypalDepositTransactions(fooList);
        },
    });
    useQuery(GET_PAYPAL_WITHDRAW_TRANSACTIONS, {
        onCompleted: (data) => {
            const fooList = data.getPaypalWithdrawByUser
                .sort((tx1, tx2) => tx2.confirmedAt - tx1.confirmedAt)
                .map((item) => {
                    const createdTime = new Date(item.confirmedAt);

                    return {
                        id: item.id,
                        date: createDateFromDate(createdTime),
                        time: createTimeFromDate(createdTime),
                        fee: item.fee,
                        status: item.status,
                        amount: item.withdrawAmount,
                        type: "Paypal Withdraw",
                        paymentId: item.senderBatchId,
                        asset: item.targetCurrency,
                    };
                });

            setPaypalWithdrawTransactions(fooList);
        },
        onError: (error) => console.log(error),
    });

    useQuery(GET_STRIPE_DEPOSIT_TX_BY_USER, {
        onCompleted: (data) => {
            const fooList = data.getStripeDepositTxByUser
                .sort((tx1, tx2) => tx2.createdAt - tx1.createdAt)
                .map((item) => {
                    const createdTime = new Date(item.createdAt);

                    return {
                        id: item.id,
                        date: createDateFromDate(createdTime),
                        time: createTimeFromDate(createdTime),
                        fee: item.fee,
                        status: item.status,
                        amount: item.amount,
                        type: "Credit Card Deposit",
                        paymentId: item.paymentIntentId,
                        asset: "USD",
                    };
                });
            setStripeDepositTransactions(fooList);
        },
        onError: (error) => console.log(error),
    });
    useQuery(GET_BANK_DEPOSIT_TRANSACTIONS_BY_USER, {
        onCompleted: (data) => {
            const fooList = data.getBankDepositTxnsByUser
                .sort((tx1, tx2) => tx2.createdAt - tx1.createdAt)
                .map((item) => {
                    const createdTime = new Date(item.createdAt);

                    return {
                        id: item.id,
                        date: createDateFromDate(createdTime),
                        time: createTimeFromDate(createdTime),
                        fee: item.fee,
                        status: item.status,
                        amount: item.deposited,
                        type: "Bank Deposit",
                        paymentId: "---",
                        asset: item.cryptoType,
                    };
                });
            setBankDepositTransactions(fooList);
        },
        onError: (error) => console.log(error),
    });

    useQuery(GET_COINPAYMENT_DEPOSIT_TX_BY_USER, {
        onCompleted: (data) => {
            const fooList = data.getCoinpaymentDepositTxByUser
                .sort((tx1, tx2) => tx2.createdAt - tx1.createdAt)
                .map((item) => {
                    const createdTime = new Date(item.createdAt);

                    return {
                        id: item.id,
                        date: createDateFromDate(createdTime),
                        time: createTimeFromDate(createdTime),
                        fee: 0.0,
                        status: item.status,
                        amount: item.amount,
                        type: "Crypto Deposit",
                        paymentId: "---",
                        asset: item.cryptoType,
                    };
                });
            setCoinDepositTransactions(fooList);
        },
        onError: (error) => console.log(error),
    });

    useQuery(GET_CRYPTO_WITHDRAW_BY_USER, {
        onCompleted: (data) => {
            const fooList = data.getCryptoWithdrawByUser
                .sort((tx1, tx2) => tx2.confirmedAt - tx1.confirmedAt)
                .map((item) => {
                    const createdTime = new Date(item.confirmedAt);
                    return {
                        id: item.id,
                        date: createDateFromDate(createdTime),
                        time: createTimeFromDate(createdTime),
                        fee: item.fee,
                        status: item.status,
                        amount: item.withdrawAmount,
                        type: "Crypto Withdraw",
                        paymentId: "---",
                        asset: item.sourceToken,
                    };
                });
            setCoinWithdrawTransactions(fooList);
        },
        onError: (error) => console.log(error),
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

    useQuery(GET_PRESALE_ORDERS_BY_USER, {
        onCompleted: (data) => {
            const fooList = data.getPresaleOrdersByUser
                .sort(
                    (presale1, presale2) =>
                        presale2.createdAt - presale1.createdAt
                )
                .map((item) => {
                    const createdTime = new Date(item.createdAt);
                    return {
                        transaction: "123456789 #",
                        date: createDateFromDate(createdTime),
                        time: createTimeFromDate(createdTime),
                        amount: item.ndbAmount * item.ndbPrice,
                        payment: 1,
                        status: item.status,
                    };
                });
            setPresaleList(fooList);
        },
        onError: (error) => console.log(error),
    });

    // Methods

    // Binding
    const valueObject = {
        // data
        paypalDepositTransactions,
        coinDepositTransactions,
        coinWithdrawTransactions,
        stripeDepositTransactions,
        paypalWithdrawTransactions,
        bankDepositTransactions,
        bidList,
        presaleList,

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
