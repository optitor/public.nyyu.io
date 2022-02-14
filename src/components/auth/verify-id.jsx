import Loading from "../common/Loading"
import SimpleHeader from "../header/simple-header"
import { useMutation, useQuery } from "@apollo/client"
import { GET_USER } from "../../apollo/graghqls/querys/Auth"
import React, { useState, useEffect } from "react"
import { GET_SHUFTI_REF_PAYLOAD, INSERT_UPDATE_REFERENCE } from "../verify-identity/kyc-webservice"
import VerificationProvider from "../verify-identity/verification-context"
import VerificationSwitch from "../verify-identity/verification-switch"
import { v4 as uuidv4 } from "uuid"
const VerificationPage = () => {
    // Containers
    const [reference, setReference] = useState(uuidv4())
    const [userEmail, setUserEmail] = useState("")
    const [shuftReferencePayload, setShuftReferencePayload] = useState(null)
    const loadingData = !(userEmail && reference && shuftReferencePayload)

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
    const [insertUpdateReference] = useMutation(INSERT_UPDATE_REFERENCE)

    // Methods
    useEffect(() => {
        insertUpdateReference({
            variables: {
                reference,
            },
        })
    }, [])

    if (loadingData) return <Loading />
    else
        return (
            <main className="verify-page">
                <SimpleHeader />
                <section className="d-flex justify-content-center align-items-start align-items-xl-center">
                    {shuftReferencePayload.pending === false ? (
                        <VerificationProvider>
                            <VerificationSwitch
                                shuftReferencePayload={shuftReferencePayload}
                                reference={reference}
                            />
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
