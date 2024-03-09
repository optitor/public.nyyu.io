import fetch from "isomorphic-fetch";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { setContext } from "@apollo/client/link/context";
import { getInMemoryAuthToken } from "../utilities/auth"; // Added import statement

const httpLink = createUploadLink({
    uri: process.env.GATSBY_API_BASE_URL + "/graphql",
});

const splitLink = httpLink

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

const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        // errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
};

export const client = new ApolloClient({
    link: authLink.concat(splitLink),
    fetch: fetch,
    fetchOptions: {
        "Access-Control-Allow-Origin": "*",
        mode: "no-cors",
    },
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
});

