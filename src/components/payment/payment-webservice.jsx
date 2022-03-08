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

export const PAY_WALLLET_FOR_AUCTION = gql`
    mutation ($roundId: Int, $cryptoType: String) {
        payWalletForAuction(roundId: $roundId, cryptoType: $cryptoType)
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
