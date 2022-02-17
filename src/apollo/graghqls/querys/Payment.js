import { gql } from "@apollo/client"

export const GET_EXCHANGE_RATE = gql`
    query {
        getExchangeRate
    }
`