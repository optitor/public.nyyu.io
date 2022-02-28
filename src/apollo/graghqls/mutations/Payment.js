import { gql } from "@apollo/client"

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
`

export const GET_DEPOSIT_ADDRESS = gql`
    mutation GetDepositAddress(
        $currency: String!
    ) {
        getDepositAddress (
            currency: $currency
        )
    }
`