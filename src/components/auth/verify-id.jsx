import React, { useEffect, useState } from "react"
import Loading from "../common/Loading"
import { useQuery } from "@apollo/client"
import SimpleHeader from "../header/simple-header"
import { GET_USER } from "../../apollo/graghqls/querys/Auth"
import VerificationSwitch from "../verify-identity/verification-switch"
import { GET_SHUFT_REFERENCE } from "../verify-identity/kyc-webservice"
import VerificationProvider from "../verify-identity/verification-context"
import { getShuftiStatusByReference } from "../../utilities/utility-methods"
const VerificationPage = () => {
    // Containers
    const [userEmail, setUserEmail] = useState("")
    const [shuftReference, setShuftReference] = useState(null)
    const [shuftiStatus, setShuftiStatus] = useState(null)
    const [shuftiReferenceLoading, setShuftiReferenceLoading] = useState(true)
    const loadingData = !(userEmail && shuftReference && shuftiStatus)

    // WebService
    useQuery(GET_USER, {
        onCompleted: (res) => {
            setUserEmail(res.getUser?.email)
        },
        fetchPolicy: "network-only",
        errorpolicy: "ignore",
    })
    useQuery(GET_SHUFT_REFERENCE, {
        onCompleted: (data) => {
            console.log(data)
            setShuftReference(data.getShuftiReference)
            return setShuftiReferenceLoading(false)
        },
        fetchPolicy: "network-only",
        errorpolicy: "ignore",
    })

    // Methods
    useEffect(async () => {
        if (!shuftiReferenceLoading) {
            const response = await getShuftiStatusByReference(shuftReference?.reference)
            return setShuftiStatus(response)
        }
    }, [shuftiReferenceLoading])

    if (loadingData) return <Loading />
    else
        return (
            <main className="verify-page">
                <SimpleHeader />
                <section className="d-flex justify-content-center align-items-start align-items-xl-center">
                    <VerificationProvider>
                        <VerificationSwitch shuftReferencePayload={shuftiStatus} />
                    </VerificationProvider>
                </section>
            </main>
        )
}

export default VerificationPage
