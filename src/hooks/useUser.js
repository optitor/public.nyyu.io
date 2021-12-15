import React, { createContext, useContext, useState } from "react"

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
    tempToken: null
  })

  return [
    user,
    setUser,
  ]
}
