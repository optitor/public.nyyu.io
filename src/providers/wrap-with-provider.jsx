import React from "react";
import { ApolloProvider } from "@apollo/client";
import { Provider as ReduxProvider } from "react-redux";
import { createConfig, http } from '@wagmi/core'
import { mainnet, bsc, bscTestnet } from '@wagmi/core/chains'
import { metaMask } from "@wagmi/connectors";
import { coinbaseWallet } from "@wagmi/connectors";
import { walletConnect } from "@wagmi/connectors";
import { WagmiProvider } from 'wagmi';

import { client } from "../apollo/client";
import store from "../redux/store";

export const config = createConfig({
  chains: [mainnet, bsc, bscTestnet],
  connectors: [
    coinbaseWallet({
      appName: 'NYYU PAY',
    }),
    walletConnect({ 
      appName: 'NYYU PAY'
    }),
    metaMask({ 
      appName: 'NYYU PAY'
    }),
  ],
  transports: {
    1: http(`https://mainnet.infura.io/v3/${process.env.GATSBY_APP_INFURA_ID}`),
    56: http(`https://bsc-dataseed.binance.org`),
    97: http(`https://data-seed-prebsc-1-s1.binance.org:8545/`),
  },
})

// eslint-disable-next-line react/display-name,react/prop-types
export const wrapRootElement = ({ element }) => {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <WagmiProvider   
            config={config}
            reconnectOnMount={true}>
          {element}
        </WagmiProvider>
      </ApolloProvider>
    </ReduxProvider>
  );
};