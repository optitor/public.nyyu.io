import { gql } from "@apollo/client"

export const GET_STRIPE_PUB_KEY = gql`
    {
        getStripePubKey
    }
`

export const STRIPE_PAYMENT = gql`
    mutation (
        $roundId: Int
        $amount: Float
        $paymentIntentId: String
        $paymentMethodId: String
    ) {
        payStripeForAuction(
            roundId: $roundId
            amount: $amount
            paymentIntentId: $paymentIntentId
            paymentMethodId: $paymentMethodId
        ) {
            clientSecret
            paymentIntentId
            requiresAction
            error
        }
    }
`
