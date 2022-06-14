import { gql } from "@apollo/client";

export const GET_REFERRAL = gql`
    query GetReferral {
        getReferral {
            referralCode
            rate
        }
    }
`

export const GET_EARNING = gql`
    query GetEarning {
        getEarning {
            name
            amount
        }
    }
`