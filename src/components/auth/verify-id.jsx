import { useMutation } from "@apollo/client"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { CREATE_NEW_REFERENCE } from "../../apollo/graghqls/mutations/Auth"
import Loading from "../common/Loading"

const VerificationPage = () => {
    // WebService
    const [createNewReference] = useMutation(CREATE_NEW_REFERENCE, {
        onCompleted: (data) => {
            setReference(data.createNewReference)
        },
    })

    // Containers
    const [reference, setReference] = useState(null)
    const [KYCPageUrl, setKYCPageUrl] = useState(null)
    const callbackUrl = "https://saledev.ndb.money/app/profile"
    const redirectUrl = "https://saledev.ndb.money/app/profile"
    // const callbackUrl = "http://localhost:8000/app/profile/"
    // const redirectUrl = "http://localhost:8000/app/profile/"
    const shuftiProBaseUrl = "https://api.shuftipro.com"

    const clientId =
        "wiKW623AK8inO2Uq7w1Hg2j3vOxGdEFDgigTByjxzA4Xl47pLJ1641498266"
    const secret =
        "$2y$10$vPNtAL2q8rRxhWU4fNKQDeLv09AhIQfd9zRFsmXF6AkL.sWkPpTj2"

    // Methods
    const sendShuftiRequest = async () => {
        const token = btoa(`${clientId}:${secret}`)
        await axios
            .post(
                shuftiProBaseUrl,
                {
                    reference,
                    callback_url: callbackUrl,
                    redirect_url: redirectUrl,
                    country: "GB",
                    language: "EN",
                    verification_mode: "any",
                    document: {
                        proof: "",
                        supported_types: ["id_card", "passport"],
                    },
                    background_checks: {
                        name: {
                            first_name: "",
                            middle_name: "",
                            last_name: "",
                        },
                    },
                    address: {
                        full_address: "",
                        supported_types: [
                            "utility_bill",
                            "passport",
                            "bank_statement",
                        ],
                    },
                    consent: {
                        proof: "",
                        text: "I & NDB",
                    },
                    face: {
                        proof: "",
                    },
                    ttl: 120,
                },
                {
                    headers: {
                        Authorization: `Basic ${token}`,
                    },
                }
            )
            .then((response) => setKYCPageUrl(response.data.verification_url))
    }
    useEffect(() => createNewReference(), [])

    useEffect(() => {
        if (reference) sendShuftiRequest()
    }, [reference])
    if (!KYCPageUrl) return <Loading />
    else {
        const a = document.createElement("a")
        a.href = `${KYCPageUrl}`
        a.click()
        return <></>
    }
}

export default VerificationPage
