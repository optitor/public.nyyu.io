import fetch from "isomorphic-fetch"
import { ApolloClient, InMemoryCache } from "@apollo/client"

export const client = new ApolloClient({
    uri: `https://ndb-auction.herokuapp.com/graphql`,
    fetch: fetch,
    fetchOptions: {
        "Access-Control-Allow-Origin": "*",
        mode: "no-cors",
    },
    cache: new InMemoryCache(),
})
