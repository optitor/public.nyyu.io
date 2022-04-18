import { gql } from "@apollo/client";

export const GET_UNCONFIRMED_BANKDEPOSIT_TXNS = gql`
    query {
        getUnconfirmedBankDepositTxns {
            id
            userId
            uid
            amount
            createdAt
            status
            fiatType
            usdAmount
            fee
            deposited
        }
    }
`;