import { gql } from "@apollo/client";

export const GET_UNCONFIRMED_BANKDEPOSIT_TXNS = gql`
    query {
        getUnconfirmedBankDepositTxns {
            id
            userId
            email
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

export const GET_ALL_BANKDEPOSIT_TXNS = gql`
    query {
        getAllBankDepositTxns(
            orderBy: null
        ) {
            id
            userId
            email
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

export const GET_ALL_CRYPTO_WITHDRAWS = gql`
    query {
        getAllCryptoWithdraws {
            id
            email
            sourceToken
            withdrawAmount
            status
            requestedAt
        }
    }
`;

export const GET_ALL_PAYPAL_WITHDRAWS = gql`
    query {
        getAllPaypalWithdraws {
            id
            email
            sourceToken
            withdrawAmount
            status
            requestedAt
        }
    }
`;