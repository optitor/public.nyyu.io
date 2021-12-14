import fetch from "isomorphic-fetch"
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"
import { setContext } from '@apollo/client/link/context';
import { getInMemoryAuthToken } from "../utilities/auth"

/*
uri: `http://auction.us-east-1.elasticbeanstalk.com/graphql`,
uri: `http://localhost:5000/graphql`,
*/

const API_URL = "https://auction.us-east-1.elasticbeanstalk.com/graphql";

const httpLink = createHttpLink({
    uri: API_URL,
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getInMemoryAuthToken()
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    fetch: fetch,
    fetchOptions: {
        "Access-Control-Allow-Origin": "*",
        mode: "no-cors",
    },
    cache: new InMemoryCache()
});

