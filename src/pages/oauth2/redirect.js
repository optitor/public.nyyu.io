/* eslint-disable */

import React, { useEffect, useMemo } from "react"
import { navigate } from "gatsby"
import { 
    setUser,
    getUser,
    getEmailfromTempToken
} from "../../utilities/auth"

const OAuth2RedirectHandler = (props) => {
    const getUrlParameter = (name) => {
        name = name.replace(/\[]/, "\\[").replace(/[\]]/, "\\]")
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)")

        var results = regex.exec(props.location.search)
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
    }

    const token = useMemo(() => getUrlParameter("token"), [])

    useEffect(() => {
        if (token) {
            setUser({
                ...getUser(),
                email: getEmailfromTempToken(token),
                tempToken: token,
            })
            navigate("/app/onetime-pwd")
        } else {
            navigate("/app/signin")
        }
    }, [token])

    return <></>
}

export default OAuth2RedirectHandler
