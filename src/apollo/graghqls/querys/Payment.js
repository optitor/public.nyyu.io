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

export const GET_PAYPAL_DEPOSIT_TXN_BY_USER = gql` {
	query {
        getPaypalDepositTxnsByUser {
		    id
            deposited
            fee
        }
    }
}
`