import React, { createContext, useContext, useState } from "react"
import {NOTIFICATION_SUBSCRIPTION} from "../apollo/graghqls/subscriptions/notification"
import { useSubscription } from "@apollo/client"

const UserContext = createContext([[],() => {}])

export const UserProvider = ({ children }) => (
  <UserContext.Provider value={useProvideUser()}>
    {children}
  </UserContext.Provider>
)

export const useUser = () => useContext(UserContext)

const useProvideUser = () => {
  const [user, setUser] = useState({
    name: null,
    email: null,
    tempToken: null,
  })
  const { data, error } = useSubscription(NOTIFICATION_SUBSCRIPTION)
  console.log("subscription Data", data, error)

  return [
    user,
    setUser,
    data
  ]
}
