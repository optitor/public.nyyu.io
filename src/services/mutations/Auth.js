import { gql } from "@apollo/client"

export const SIGNUP = gql`
    mutation signup($email: String!, $password: String!, $country: String!) {
        signup(email: $email, password: $password, country: $country) 
    }
`;

export const VERIFY_ACCOUNT = gql`
    mutation verifyAccount($email: String!, $code: String!) {
        verifyAccount(email: $email, code: $code) 
    }
`;
