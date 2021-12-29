import { gql } from "@apollo/client"

export const USER_NOTIFICATION_SETTING = gql`
    mutation changeNotifySetting(
        $nType: Int!
        $status: Boolean!
    ) {
        changeNotifySetting(
            nType: $nType
            status: $status
        )  
    }
`
