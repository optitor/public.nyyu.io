import { gql } from "@apollo/client"

export const GET_STRIPE_PUB_KEY = gql`
    {
        getStripePubKey
    }
`

export const STRIPE_PAYMENT = gql`
    mutation (
        $roundId: String
        $amount: Float
        $paymentIntentId: String
        $paymentMethodId: String
    ) {
        stripePayment(
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
