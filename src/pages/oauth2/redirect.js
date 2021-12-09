/* eslint-disable */

import React, { useEffect, useMemo } from "react"
import { navigate } from "gatsby"
import { useAuthTempToken } from "../../config/auth-config"

const OAuth2RedirectHandler = (props) => {
    const getUrlParameter = (name) => {
        name = name.replace(/\[]/, "\\[").replace(/[\]]/, "\\]")
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)")

        var results = regex.exec(props.location.search)
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
    }

    const userData = useSelector((state) => state?.user)
    const token = useMemo(() => getUrlParameter("token"), [])
    const [, setAuthTempToken] = useAuthTempToken()

    console.log("user: ", userData)
    useEffect(() => {
        if (token) {
            setAuthTempToken(token)
            navigate("/onetime-pwd")
        } else {
            navigate("/signin")
        }
    }, [token])

    return <></>
}

export default OAuth2RedirectHandler
