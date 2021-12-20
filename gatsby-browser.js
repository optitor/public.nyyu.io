import React from "react"
import "./src/styles/sass/app.scss"
import "jquery/dist/jquery.min.js"
import "popper.js/dist/popper.min"
import "bootstrap/dist/js/bootstrap.min.js"
import "react-tabs/style/react-tabs.css"
import "rc-slider/assets/index.css"

import { AuthProvider } from "./src/hooks/useAuth"
import { ApolloProvider } from "@apollo/client"
import { client } from "./src/apollo/client"
import { UserProvider } from "./src/hooks/useUser"
import { Provider as ReduxProvider } from "react-redux";
import store from './src/redux/store';

export const wrapRootElement = ({ element }) => {
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <UserProvider>
            {element}
          </UserProvider>
        </AuthProvider>
      </ApolloProvider>
    </ReduxProvider>    
  )
}
