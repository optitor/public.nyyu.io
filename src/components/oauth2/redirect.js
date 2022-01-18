import React, { useState } from "react"
import { navigate } from "gatsby"
import AuthLayout from "../common/AuthLayout"
import VerifyMutliFA from "../auth/verify-multiFA"
import TwoFactorModal from "../profile/two-factor-modal"
import { ROUTES } from "../../utilities/routes"
const OAuth2RedirectHandler = ({ type, dataType, data }) => {

    const [tfaOpen, setTfaOpen] = useState(false)
    const [success, setSuccess] = useState(false)

    let email
    let twoStep = []

    if (type === "success") {
        if (data) {
            for (let i in data.split("*")) {
                const d = data.split("*")[i]
                if (i === "0") email = d
                else twoStep.push({ key: d, value: true })
            }
        } else {
            navigate("/app/signin")
        }
    } else {
        if (dataType === "No2FA") {
            setTfaOpen(true)
            email = data
        }
        else {
            navigate(`/app/signin/${dataType}.${data}`)
        }
    }

    return (
        <div>
            {success &&
                <VerifyMutliFA
                    twoStep={twoStep}
                    email={email}
                    tempToken={tempToken}
                    returnToSignIn={() => navigate(ROUTES.signIn)}
                />}
            <TwoFactorModal
                is2FAModalOpen={tfaOpen}
                setIs2FAModalOpen={(res) => {
                    setTfaOpen(res)
                    if (!res) navigate(ROUTES.signIn)

                }}
                email={email}
                twoStep={twoStep}
                onResult={(r) => {
                    if (r) {
                        setTfaOpen(false)
                        navigate(ROUTES.signIn)
                    }
                    else
                        navigate(ROUTES.verifyFailed)
                }}
            />
        </div>
    )
}

export default OAuth2RedirectHandler
