import * as React from "react"
import Header from "../header"
import CookieConsent from 'react-cookie-consent';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <section>{children}</section>
            <CookieConsent
                    location="bottom"
                    buttonText="Accept"
                    declineButtonText="Decline"
                    cookieName="gatsby-gdpr-google-analytics">
            </CookieConsent>
        </>
    )
}

export default Layout
