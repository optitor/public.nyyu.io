import Loading from "../common/Loading"
import SimpleHeader from "../header/simple-header"
import { useQuery } from "@apollo/client"
import { GET_USER } from "../../apollo/graghqls/querys/Auth"
import React, { useState } from "react"
import { GET_SHUFTI_REF_PAYLOAD } from "../verify-identity/kyc-webservice"
import VerificationProvider from "../verify-identity/verification-context"
import VerificationSwitch from "../verify-identity/verification-switch"
const VerificationPage = () => {
    // Containers
    const [userEmail, setUserEmail] = useState("")
    const [shuftReferencePayload, setShuftReferencePayload] = useState(null)
    const loadingData = !(userEmail && shuftReferencePayload)

    // WebService
    useQuery(GET_USER, {
        onCompleted: (res) => {
            setUserEmail(res.getUser?.email)
        },
        fetchPolicy: "network-only",
        errorpolicy: "ignore",
    })
    useQuery(GET_SHUFTI_REF_PAYLOAD, {
        onCompleted: (data) => {
            setShuftReferencePayload(data.getShuftiRefPayload)
        },
        fetchPolicy: "network-only",
        errorpolicy: "ignore",
    })

    if (loadingData) return <Loading />
    else
        return (
            <main className="verify-page">
                <SimpleHeader />
                <section className="d-flex justify-content-center align-items-start align-items-xl-center">
                    {shuftReferencePayload.pending === false ? (
                        <VerificationProvider>
                            <VerificationSwitch shuftReferencePayload={shuftReferencePayload} />
                        </VerificationProvider>
                    ) : (
                        <div className="text-light h4 fw-500 text-center px-4 px-sm-0 mt-5 mt-sm-0">
                            Please wait while your request is being verified...
                        </div>
                    )}
                </section>
            </main>
        )
}

export default VerificationPage
