import { gql } from "@apollo/client";

export const CREATE_CRYPTO_PAYMENT = gql`
    mutation CreateCryptoPaymentForAuction(
        $roundId: Int!
        $amount: Float!
        $cryptoType: String
        $network: String
        $coin: String!
    ) {
        createCryptoPaymentForAuction(
            roundId: $roundId
            amount: $amount
            cryptoType: $cryptoType
            network: $network
            coin: $coin
        ) {
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
            auctionId
            bidId
        }
    }
`;

export const GET_DEPOSIT_ADDRESS = gql`
    mutation GetDepositAddress($currency: String!) {
        getDepositAddress(currency: $currency)
    }
`;

export const CREATE_CHARGE_FOR_DEPOSIT = gql`
    mutation CreateChargeForDeposit(
        $coin: String
        $network: String
        $cryptoType: String
    ) {
        createChargeForDeposit(
            coin: $coin
            network: $network
            cryptoType: $cryptoType
        ) {
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

export const PAYPAL_FOR_AUCTION = gql`
    mutation PaypalForAuction(
        $roundId: Int
        $currencyCode: String
    ) {
        paypalForAuction(
            roundId: $roundId,
            currencyCode: $currencyCode
        ) {
            id
            status
            links {
                href
                rel
                method
            }
        }
    }
`;

export const CAPTURE_ORDER_FOR_AUCTION = gql`
    mutation CaptureOrderForAuction(
        $orderId: String
    ) {
        captureOrderForAuction(
            orderId: $orderId
        )
    }
`;