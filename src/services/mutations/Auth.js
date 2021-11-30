import { gql } from "@apollo/client"

export const SIGNUP = gql`
    mutation signup($email: String!, $password: String!, $country: String!) {
        Signup(email: $email, password: $password, country: $country) {
            id
            email
            password
            country
        }
    }
`
