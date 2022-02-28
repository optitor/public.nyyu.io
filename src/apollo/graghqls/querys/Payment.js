import { gql } from "@apollo/client"

export const GET_EXCHANGE_RATE = gql`
    query {
        getExchangeRate
    }
`

export const GET_ALL_FEES = gql`
    query {
        getAllFees {
            id
            tierLevel
            fee
        }
    }
`