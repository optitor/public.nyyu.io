import { gql } from "@apollo/client";

export const GET_ALL_PAPAL_DEPOSIT_TRANSACTIONS = gql`
    query {
        getPaypalDepositTxnsByUser {
            id
            userId
            amount
            createdAt
            confirmedAt
            status
            fiatType
            fiatAmount
            paypalOrderId
            paypalOrderStatus
            cryptoType
            fee
            deposited
        }
    }
`;

export const GET_BID_LIST_BY_USER = gql`
    query {
        getBidListByUser {
            roundId
            round
            tokenAmount
            totalAmount
            paidAmount
            tokenPrice
            pendingIncrease
            payType
            cryptoType
            status
            placedAt
        }
    }
`;

export const GET_PRESALE_ORDERS_BY_USER = gql`
    query {
        getPresaleOrdersByUser {
            id
            userId
            presaleId
            prefix
            name
            destination
            extAddr
            ndbAmount
            ndbPrice
            status
            createdAt
            updatedAt
        }
    }
`;
export const GET_COINPAYMENT_DEPOSIT_TX_BY_USER = gql`
    query {
        getCoinpaymentDepositTxByUser {
            id
            userId
            amount
            createdAt
            status
            cryptoType
            network
            cryptoAmount
            confirmedAt
            depositAddress
            coin
        }
    }
`;

export const GET_STRIPE_DEPOSIT_TX_BY_USER = gql`
    query {
        getStripeDepositTxByUser {
            id
            userId
            amount
            createdAt
            confirmedAt
            status
            fiatType
            fiatAmount
            paymentIntentId
            paymentMethodId
            cryptoType
            cryptoPrice
            fee
            deposited
        }
    }
`;
