import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { getInMemoryAuthToken, logout } from "../utilities/auth";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// GraphQL endpoint configuration
const getGraphQLEndpoint = () => {
    const baseUrl = process.env.GATSBY_API_BASE_URL;

    if (!baseUrl) {
        console.error("❌ GATSBY_API_BASE_URL is not defined!");
        console.error("Please check your environment configuration");
        return "http://localhost:4000/graphql"; // fallback
    }

    const endpoint = `${baseUrl}/graphql`;

    if (process.env.NODE_ENV === "development") {
        console.log("🔗 GraphQL Endpoint:", endpoint);
        console.log("🌍 Environment:", process.env.NODE_ENV);
    }

    return endpoint;
};

const graphqlEndpoint = getGraphQLEndpoint();

// Create upload link for file uploads (only in browser)
const uploadLink = isBrowser
    ? createUploadLink({
          uri: graphqlEndpoint,
          headers: {
              "Apollo-Require-Preflight": "true",
          },
      })
    : null;

// HTTP link for non-upload requests
const httpLink = createHttpLink({
    uri: graphqlEndpoint,
});

// Auth link for adding authorization headers (SSR-safe)
const authLink = setContext((_, { headers }) => {
    // Only get token in browser environment
    const token = isBrowser ? getInMemoryAuthToken() : null;

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        },
    };
});

// Enhanced error handling link
const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(
                ({ message, locations, path, extensions }) => {
                    console.error(
                        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`,
                    );

                    // Handle authentication errors (only in browser)
                    if (
                        isBrowser &&
                        (extensions?.code === "UNAUTHENTICATED" ||
                            extensions?.code === "FORBIDDEN")
                    ) {
                        console.warn(
                            "Authentication error detected, logging out user",
                        );
                        logout(() => {
                            if (typeof window !== "undefined") {
                                window.location.href = "/app/signin/";
                            }
                        });
                    }
                },
            );
        }

        if (networkError) {
            console.error(
                `Network error: ${networkError.message}`,
                networkError,
            );

            // Handle specific network errors
            if (networkError.statusCode === 401) {
                console.warn("401 Unauthorized - logging out user");
                if (isBrowser) {
                    logout(() => {
                        window.location.href = "/app/signin/";
                    });
                }
            }
        }
    },
);

// Create link based on browser environment
const customLink =
    isBrowser && uploadLink
        ? from([
              setContext((operation, context) => {
                  // Check if the operation involves file upload (only in browser)
                  const hasUpload =
                      operation.variables &&
                      Object.values(operation.variables).some((value) => {
                          if (value instanceof File) return true;
                          if (value instanceof FileList) return true;
                          // Check for nested file objects
                          if (value && typeof value === "object") {
                              return Object.values(value).some(
                                  (nested) =>
                                      nested instanceof File ||
                                      nested instanceof FileList,
                              );
                          }
                          return false;
                      });

                  return {
                      ...context,
                      hasUpload,
                  };
              }).split(
                  (operation) => operation.getContext().hasUpload,
                  uploadLink,
                  httpLink,
              ),
          ])
        : httpLink;

// Combine all links in correct order
const link = from([errorLink, authLink, customLink]);

// Create cache with proper configuration
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                // Add any specific cache policies here
                me: {
                    merge(existing, incoming) {
                        return { ...existing, ...incoming };
                    },
                },
                getUser: {
                    merge(existing, incoming) {
                        return { ...existing, ...incoming };
                    },
                },
            },
        },
    },
    // Prevent cache warnings
    possibleTypes: {},
});

// Create Apollo Client with proper configuration
const client = new ApolloClient({
    link,
    cache,
    defaultOptions: {
        watchQuery: {
            errorPolicy: "all",
            notifyOnNetworkStatusChange: true,
            fetchPolicy: "cache-and-network",
        },
        query: {
            errorPolicy: "all",
            fetchPolicy: "cache-first",
        },
        mutate: {
            errorPolicy: "all",
        },
    },
    // Only enable developer tools in browser environment and development
    connectToDevTools: isBrowser && process.env.NODE_ENV === "development",
    // SSR compatibility
    ssrMode: !isBrowser,
    // Important: Properly handle SSR
    ssrForceFetchDelay: 100,
    // Prevent invariant errors
    assumeImmutableResults: true,
});

// Helper functions (SSR-safe)
export const clearApolloCache = () => {
    if (isBrowser) {
        return client.clearStore();
    }
    return Promise.resolve();
};

export const resetApolloStore = () => {
    if (isBrowser) {
        return client.resetStore();
    }
    return Promise.resolve();
};

export const refetchActiveQueries = () => {
    if (isBrowser) {
        return client.refetchQueries({
            include: "active",
        });
    }
    return Promise.resolve();
};

// Log client creation for debugging
if (process.env.NODE_ENV === "development") {
    console.log("🚀 Apollo Client created successfully");
    console.log("🌐 SSR Mode:", !isBrowser);
    console.log("🔗 GraphQL Endpoint:", graphqlEndpoint);
}

export { client };
export default client;
