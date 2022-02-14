import Loading from "../common/Loading"
import SimpleHeader from "../header/simple-header"

import { useMutation, useQuery } from "@apollo/client"
import { GET_USER } from "../../apollo/graghqls/querys/Auth"
import React, { useState, useEffect } from "react"
import { CREATE_NEW_REFERENCE } from "../../apollo/graghqls/mutations/Auth"
import { GET_SHUFTI_REF_PAYLOAD } from "../verify-identity/kyc-webservice"
import VerificationProvider from "../verify-identity/verification-context"
import VerificationSwitch from "../verify-identity/verification-switch"

const VerificationPage = () => {
    // Containers
    const [reference, setReference] = useState(null)
    const [userEmail, setUserEmail] = useState("")
    const [shuftReference, setShuftReference] = useState(null)
    const loadingData = !(userEmail && reference && shuftReference)

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
            setShuftReference(data.getShuftiRefPayload)
        },
        fetchPolicy: "network-only",
        errorpolicy: "ignore",
    })
    const [createNewReference] = useMutation(CREATE_NEW_REFERENCE, {
        onCompleted: (data) => {
            setReference(data.createNewReference)
        },
    })

    // Methods
    useEffect(() => {
        createNewReference()
    }, [])

    if (loadingData) return <Loading />
    else
        return (
            <main className="verify-page">
                <SimpleHeader />
                <section className="d-flex justify-content-center align-items-start align-items-xl-center">
                    {shuftReference.pending === false ? (
                        <VerificationProvider>
                            <VerificationSwitch reference={reference} />
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
