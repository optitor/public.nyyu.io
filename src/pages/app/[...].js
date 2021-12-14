import React from "react"
import { Router } from "@reach/router"
// import Layout from "../../components/common/layout"
import Profile from "../../components/Profile"
import PrivateRoute from "../../components/common/PrivateRoute"
import PageNotFound from "../../components/common/PageNotFound"
import SignIn from "../../components/auth/signin"
import SignUp from "../../components/auth/signup"
import VerifyEmail from "../../components/auth/verify-email"
import VerifyFailed from "../../components/auth/verify-failed"
import OneTimePassword from "../../components/auth/onetime-pwd"

const App = () => {
  return (
    <Router basepath="app">
      <PageNotFound default />
      <PrivateRoute path="/profile" component={Profile} />
      <SignIn path="signin" />
      <SignUp path="signup" />
      <VerifyEmail path="verify-email" />
      <VerifyFailed path="verify-failed" />
      <OneTimePassword path="onetime-pwd" />
    </Router>
  )
}
export default App