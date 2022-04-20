import { gql } from '@apollo/client';

export const CONFIRM_BANK_DEPOSIT = gql`
    mutation ConfirmBankDeposit(
        $id: Int
        $currencyCode: String
        $amount: Float
        $cryptoType: String
    ) {
        confirmBankDeposit(
            id: $id
            currencyCode: $currencyCode
            amount: $amount
            cryptoType: $cryptoType
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