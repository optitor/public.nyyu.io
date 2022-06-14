// activate referrer address and code
import { gql } from "@apollo/client";

export const ACTIVATE_REFERRER = gql`
    mutation ActivateReferralCode(
        $wallet: String!
    ) {
        activateReferralCode(
            wallet: $wallet
        ) 
    }
`

export const CHANGE_COMMISSION_WALLET = gql`
    mutation ChangeReferralCommissionWallet(
        $wallet: String!
    ) {
        changeReferralCommissionWallet(
            wallet: $wallet
        )
    }
`

