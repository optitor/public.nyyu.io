import { gql } from "@apollo/client";

export const GET_ALL_PAPAL_DEPOSIT_TRANSACTIONS = gql`
    query {
        getAllPaypalDepositTxns {
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
