import React from "react"
import { Router } from "@reach/router"
// import Layout from "../../components/common/layout"
import Profile from "../../components/Profile"
import PrivateRoute from "../../components/common/PrivateRoute"
import PageNotFound from "../../components/common/PageNotFound"
import SignIn from "../../components/auth/signin"
import OneTimePassword from "../../components/auth/onetime-pwd"

const App = () => {
  return (
    <Router basepath="app">
      <PageNotFound default />
      <PrivateRoute path="/profile" component={Profile} />
      <SignIn path="signin" />
      <OneTimePassword path="onetime-pwd" />
    </Router>
  )
}
export default App