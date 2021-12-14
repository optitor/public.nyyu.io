import React, { createContext, useContext, useEffect } from "react"
import {
  getInMemoryAuthToken,
  isLoggedOut,
  isTokenExpired,
  LOGGED_OUT_KEY,
  logout,
} from "../utilities/auth"
import { navigate } from "gatsby"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={useProvideAuth()}>
    {children}
  </AuthContext.Provider>
)

export const useAuth = () => useContext(AuthContext)

const syncLoginStatus = (event) => {
  if (event.key === LOGGED_OUT_KEY && isLoggedOut()) {
    logout(navigate("/auction/"))
  }
}

const useProvideAuth = () => {

  const isLoggedIn = () =>
    getInMemoryAuthToken() && !isTokenExpired(getInMemoryAuthToken())

  /**
   * Make sure, User is logged out on all Tabs
   */
  useEffect(() => {
    window.addEventListener("storage", syncLoginStatus)

    return () => {
      window.removeEventListener("storage", syncLoginStatus)
    }
  })

  return {
    isLoggedIn,
    // user: token ? token.user : null,
  }
}

