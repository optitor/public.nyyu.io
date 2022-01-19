import { gql } from "@apollo/client"

export const GET_NOTICATION_TYPES = gql`
    {
        getNotificationTypes {
            type
            index
        }
    }
`

export const GET_NOTIFICATIONS = gql`
    query getNotifications($stamp: Float, $limit: Int!) {
        getNotifications(stamp: $stamp, limit: $limit) {
            userId
            timeStamp
            nType
            read
            title
            msg
        }
    }
`
