import { gql } from "@apollo/client";

export const GET_STRIPE_PUB_KEY = gql`
    {
        getStripePubKey
    }
`;

export const STRIPE_PAYMENT = gql`
    mutation (
        $roundId: Int
        $amount: Float
        $paymentIntentId: String
        $paymentMethodId: String
        $isSaveCard: Boolean
    ) {
        payStripeForAuction(
            roundId: $roundId
            amount: $amount
            paymentIntentId: $paymentIntentId
            paymentMethodId: $paymentMethodId
            isSaveCard: $isSaveCard
        ) {
            clientSecret
            paymentIntentId
            requiresAction
            error
        }
    }
`;

export const PAY_STRIPE_FOR_PRESALE = gql`
    mutation (
        $presaleId: Int
        $orderId: Int
        $amount: Float
        $paymentIntentId: String
        $paymentMethodId: String
        $isSaveCard: Boolean
    ) {
        payStripeForPreSale(
            presaleId: $presaleId
            orderId: $orderId
            amount: $amount
            paymentIntentId: $paymentIntentId
            paymentMethodId: $paymentMethodId
            isSaveCard: $isSaveCard
        ) {
            clientSecret
            paymentIntentId
            requiresAction
            error
        }
    }
`;

export const PAY_WALLLET_FOR_AUCTION = gql`
    mutation ($roundId: Int, $cryptoType: String) {
        payWalletForAuction(roundId: $roundId, cryptoType: $cryptoType)
    }
`;

export const PAY_WALLET_FOR_PRESALE = gql`
    mutation ($presaleId: Int, $orderId: Int, $cryptoType: String) {
        payWalletForPresale(
            presaleId: $presaleId
            orderId: $orderId
            cryptoType: $cryptoType
        )
    }
`;

export const GET_SAVED_CARDS = gql`
    {
        getSavedCards {
            id
            userId
            customerId
            brand
            country
            expMonth
            expYear
            last4
        }
    }
`;

export const DELETE_CARD = gql`
    mutation deleteCard($id: Int) {
        deleteCard(id: $id)
    }
`;

export const STRIPE_FOR_DEPOSIT = gql`
    mutation stripeForDeposit(
        $amount: Float
        $cryptoType: String
        $paymentMethodId: String
        $paymentIntentId: String
        $isSaveCard: Boolean
    ) {
        stripeForDeposit(
            amount: $amount
            cryptoType: $cryptoType
            paymentMethodId: $paymentMethodId
            paymentIntentId: $paymentIntentId
            isSaveCard: $isSaveCard
        ) {
            clientSecret
            paymentIntentId
            requiresAction
            error
        }
    }
`;

export const STRIPE_FOR_DEPOSIT_WITH_SAVED_CARD = gql`
    mutation stripeForDepositWithSavedCard(
        $amount: Float
        $cryptoType: String
        $cardId: Int
        $paymentIntentId: String
    ) {
        stripeForDepositWithSavedCard(
            amount: $amount
            cryptoType: $cryptoType
            cardId: $cardId
            paymentIntentId: $paymentIntentId
        ) {
            clientSecret
            paymentIntentId
            requiresAction
            error
        }
    }
`;

export const PAY_STRIPE_FOR_AUCTION_WITH_SAVED_CARD = gql`
    mutation payStripeForAuctionWithSavedCard(
        $roundId: Int
        $amount: Float
        $cardId: Int
        $paymentIntentId: String
    ) {
        payStripeForAuctionWithSavedCard(
            roundId: $roundId
            amount: $amount
            cardId: $cardId
            paymentIntentId: $paymentIntentId
        ) {
            clientSecret
            paymentIntentId
            requiresAction
            error
        }
    }
`;

export const PAY_STRIPE_FOR_PRESALE_WITH_SAVED_CARD = gql`
    mutation payStripeForPreSaleWithSavedCard(
        $presaleId: Int
        $orderId: Int
        $amount: Float
        $cardId: Int
        $paymentIntentId: String
    ) {
        payStripeForPreSaleWithSavedCard(
            presaleId: $presaleId
            orderId: $orderId
            amount: $amount
            cardId: $cardId
            paymentIntentId: $paymentIntentId
        ) {
            clientSecret
            paymentIntentId
            requiresAction
            error
        }
    }
`;
