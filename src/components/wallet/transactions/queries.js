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
