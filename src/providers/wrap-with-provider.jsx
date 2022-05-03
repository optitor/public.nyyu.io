import React from "react"
import { AuthProvider } from "../hooks/useAuth"
import { ApolloProvider } from "@apollo/client"
import { Provider as ReduxProvider } from "react-redux";
import { Provider as WalletProvider, chain, defaultChains, createClient } from 'wagmi'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import { client } from "../apollo/client"
import store from '../redux/store';
import { INFURA_ID } from "../utilities/staticData"

// API key for Ethereum node
// Two popular services are Infura (infura.io) and Alchemy (alchemy.com)
// const infuraId = process.env.INFURA_ID
const infuraId = INFURA_ID
// Chains for connectors to support
const chains = defaultChains;

// Set up connectors
const defaultChain = chain.mainnet;
if(window !== undefined) {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}
const connectors = createClient({
    autoConnect: true,
    connectors({chainId}) {
        const chain = defaultChain;
        console.log('chain: ', chain);
        const rpcUrl = chain.rpcUrls.default;
        return [
            new MetaMaskConnector({chains}),
            new CoinbaseWalletConnector({
                chains,
                options: {
                    appName: 'Nyyu',
                    chainId: chain.id,
                    jsonRpcUrl: rpcUrl
                }
            }),
            new WalletConnectConnector({
                chains,
                options: {
                    qrcode: true,
                    rpc: { [chain.id]: rpcUrl },
                },
            }),
            // new InjectedConnector({
            //     chains,
            //     options: { name: 'Injected' },
            // }),
        ]
    }
})


// eslint-disable-next-line react/display-name,react/prop-types
export const wrapRootElement = ({ element }) => {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <WalletProvider client={connectors}>
            {element}
          </WalletProvider>
        </AuthProvider>
      </ApolloProvider>
    </ReduxProvider>
  )
}
