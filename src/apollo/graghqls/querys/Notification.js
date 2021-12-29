import { gql } from "@apollo/client"

export const GET_NOTICATION_TYPES = gql`
query {
    getNotificationTypes2 {
        nType
        tName
        broadcast
    }
}
`