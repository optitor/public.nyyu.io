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

export const CONFIRM_CRYPTO_WITHDRAW = gql`    
    mutation ConfirmCryptoWithdraw(
        $id: Int
        $status: Int
        $deniedReason: String
    ) {
        confirmCryptoWithdraw(
            id: $id
            status: $status
            deniedReason: $deniedReason
        )
    }
`;

export const CONFIRM_PAYPAL_WITHDRAW = gql`
    mutation ConfirmPaypalWithdraw(
        $id: Int
        $status: Int
        $deniedReason: String
    ) {
        confirmPaypalWithdraw(
            id: $id
            status: $status
            deniedReason: $deniedReason
        )
    }
`;

export const APPROVE_BANK_WITHDRAW_REQUEST = gql`
    mutation ApproveBankWithdrawRequest(
        $id: Int
    ) {
        approveBankWithdrawRequest(
            id: $id
        )
    }
`;

export const DENY_BANK_WITHDRAW_REQUEST = gql`
    mutation DenyBankWithdrawRequest(
        $id: Int
        $reason: String
    ) {
        denyBankWithdrawRequest(
            id: $id
            reason: $reason
        )
    }
`;