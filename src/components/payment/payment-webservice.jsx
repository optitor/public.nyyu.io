import { gql } from "@apollo/client"

export const GET_STRIPE_PUB_KEY = gql`
    {
        getStripePubKey
    }
`
