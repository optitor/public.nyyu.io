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
    const callbackUrl = "https://api.ndb.money/shufti"
    const shuftiProBaseUrl = "https://api.shuftipro.com"

    // Production
    // const clientId =
    //     "wiKW623AK8inO2Uq7w1Hg2j3vOxGdEFDgigTByjxzA4Xl47pLJ1641498266"
    // const secret =
    //     "$2y$10$vPNtAL2q8rRxhWU4fNKQDeLv09AhIQfd9zRFsmXF6AkL.sWkPpTj2"

    // Test
    const redirectUrl = "https://saledev.ndb.money/app/profile"
    // const redirectUrl = "http://localhost:8000/app/profile/"
    const clientId =
        "sWPA9CtQUI09MRpvQtxCPKK1hN6CU8qqngge3jHjAYptWsm9Ab1643819657"
    const secret =
        "$2y$10$O1V4dOxzCYFbNBswBwEdX.ZnDkqf5VvKQWOLElLEacTEx../zHC3O"

    // Methods
    const sendShuftiRequest = async () => {
        const token = btoa(`${clientId}:${secret}`)
        const data = {
            reference,
            callback_url: callbackUrl,
            redirect_url: redirectUrl,
            verification_mode: "any",
            document: {
                proof: "",
                supported_types: ["id_card", "passport", "driving_license"],
                verification_instructions: {
                    allow_paper_based: "1",
                    allow_photocopy: "1",
                    allow_laminated: "1",
                    allow_screenshot: "1",
                    allow_cropped: "1",
                    allow_scanned: "1",
                },
            },
            address: {
                full_address: "",
                supported_types: [
                    "utility_bill",
                    "bank_statement",
                    "driving_license",
                    "rent_agreement",
                    "employer_letter",
                    "tax_bill",
                ],
                verification_instructions: {
                    allow_paper_based: "1",
                    allow_photocopy: "1",
                    allow_laminated: "1",
                    allow_screenshot: "1",
                    allow_cropped: "1",
                    allow_scanned: "1",
                },
            },
            consent: {
                proof: "",
                text: "I & NDB",
            },
            face: {
                proof: "",
            },
            ttl: 120,
            decline_on_single_step: "0",
        }
        await axios
            .post(shuftiProBaseUrl, data, {
                headers: {
                    Authorization: `Basic ${token}`,
                },
            })
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
