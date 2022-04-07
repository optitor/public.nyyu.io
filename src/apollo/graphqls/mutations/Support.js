import { gql } from "@apollo/client";

export const GET_ZENDESK_JWT = gql`
    mutation {
        getZendeskJwt {
            status
            token
            twoStep
        }
    }
`;