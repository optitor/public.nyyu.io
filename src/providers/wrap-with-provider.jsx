import React from "react";
import { AuthProvider } from "../hooks/useAuth";
import { ApolloProvider } from "@apollo/client";
import { Provider as ReduxProvider } from "react-redux";
import { WagmiProvider, createConfig, http } from "wagmi";
import LoadCurrencyRates from "../components/header/LoadCurrencyRates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    sepolia,
    polygonMumbai,
    bsc,
    bscTestnet,
} from "wagmi/chains";
import { walletConnect, coinbaseWallet, metaMask } from "wagmi/connectors";

import { client } from "../apollo/client";
import store from "../store/store"; // Keep your original store path

// Create React Query client (required for Wagmi v2)
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
            retry: 3,
            refetchOnWindowFocus: false,
        },
    },
});

// Custom BSC chains configuration (matching your original setup)
const customBscChain = {
    ...bsc,
    id: 56,
    name: "Binance Smart Chain",
    nativeCurrency: {
        name: "Binance",
        symbol: "BNB",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ["https://bsc-dataseed.binance.org/"],
        },
    },
    blockExplorers: {
        default: { name: "Bscscan", url: "https://bscscan.com" },
    },
};

const customBscTestChain = {
    ...bscTestnet,
    id: 97,
    name: "Smart Chain - Testnet",
    nativeCurrency: {
        name: "Binance",
        symbol: "BNB",
        decimals: 18, // Fixed: was 12 in original, should be 18
    },
    rpcUrls: {
        default: {
            http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        },
    },
    blockExplorers: {
        default: { name: "Bsctestscan", url: "https://testnet.bscscan.com" },
    },
};

<LoadCurrencyRates />;

// Wagmi v2 configuration
const config = createConfig({
    chains: [
        mainnet,
        customBscChain,
        polygon,
        optimism,
        arbitrum,
        ...(process.env.NODE_ENV === "development"
            ? [sepolia, polygonMumbai, customBscTestChain]
            : [customBscTestChain]),
    ],
    connectors: [
        metaMask({
            dappMetadata: {
                name: "Nyyu",
                description: "NDB Token Pre-sale Platform",
                url:
                    typeof window !== "undefined"
                        ? window.location.origin
                        : "https://nyyu.io",
                icons: ["https://nyyu.io/favicon.png"],
            },
        }),
        coinbaseWallet({
            appName: "Nyyu",
            appLogoUrl: "https://nyyu.io/favicon.png",
        }),
        walletConnect({
            projectId:
                process.env.GATSBY_WALLET_CONNECT_PROJECT_ID ||
                "your-wallet-connect-project-id",
            metadata: {
                name: "Nyyu",
                description: "NDB Token Pre-sale Platform",
                url:
                    typeof window !== "undefined"
                        ? window.location.origin
                        : "https://nyyu.io",
                icons: ["https://nyyu.io/favicon.png"],
            },
        }),
    ],
    transports: {
        [mainnet.id]: http(),
        [customBscChain.id]: http("https://bsc-dataseed.binance.org/"),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [sepolia.id]: http(),
        [polygonMumbai.id]: http(),
        [customBscTestChain.id]: http(
            "https://data-seed-prebsc-1-s1.binance.org:8545/",
        ),
    },
    ssr: true, // Enable SSR support for Gatsby
});

// Buffer polyfill (matching your original setup)
if (typeof window !== `undefined`) {
    window.Buffer = window.Buffer || require("buffer").Buffer;
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Provider Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        padding: "20px",
                        textAlign: "center",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                        margin: "20px",
                    }}
                >
                    <h2>Something went wrong</h2>
                    <p>Please refresh the page and try again.</p>
                    <button
                        onClick={() => {
                            if (typeof window !== "undefined") {
                                window.location.reload();
                            }
                        }}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Main provider wrapper - SAME ORDER AS YOUR ORIGINAL
export const wrapRootElement = ({ element }) => {
    return (
        <ErrorBoundary>
            <ReduxProvider store={store}>
                <ApolloProvider client={client}>
                    <AuthProvider>
                        <QueryClientProvider client={queryClient}>
                            <WagmiProvider config={config}>
                                {element}
                            </WagmiProvider>
                        </QueryClientProvider>
                    </AuthProvider>
                </ApolloProvider>
            </ReduxProvider>
        </ErrorBoundary>
    );
};

// For Gatsby SSR compatibility
export const wrapPageElement = ({ element, props }) => {
    return element;
};

// Export config for external use if needed
export { config as wagmiConfig, queryClient };
