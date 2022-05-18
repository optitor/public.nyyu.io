import { gql } from "@apollo/client"

export const GET_PRESALE_LIST_BY_ROUND = gql`
    query getPresaleOrders($presaleId: Int!) {
        getPresaleOrders(presaleId: $presaleId) {
            id
            userId
            name
            prefix
            presaleId
            destination
            extAddr
            ndbAmount
            ndbPrice
            status
            createdAt
            updatedAt
        }
    }
`


