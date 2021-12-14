import React from "react"
import { Router } from "@reach/router"
// import Layout from "../../components/common/layout"
import Profile from "../../components/Profile"
import PrivateRoute from "../../components/common/PrivateRoute"

const App = () => {
  return (
    <Router basepath="/app">
      <PrivateRoute path="/profile" component={Profile} />
    </Router>
  )
}
export default App