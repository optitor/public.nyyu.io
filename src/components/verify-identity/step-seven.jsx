import axios from "axios"
import { Link } from "gatsby"
import { v4 as uuidv4 } from "uuid"
import Loading from "../common/Loading"
import React, { useEffect, useState } from "react"
import { useMutation } from "@apollo/client"
import { ROUTES } from "../../utilities/routes"
import { VerifyIdStep7 } from "../../utilities/imgImport"
import { INSERT_UPDATE_REFERENCE } from "./kyc-webservice"
import { getBase64 } from "../../utilities/utility-methods"
import { useVerification } from "./verification-context"

export default function StepSeven() {
    // Containers
    const verification = useVerification()
    const [reference] = useState(uuidv4())

    // Webservice
    const [insertUpdateReference] = useMutation(INSERT_UPDATE_REFERENCE)

    // Methods
    const sendShuftiRequest = async () => {
        verification.setSubmitting(true)
        insertUpdateReference({
            variables: {
                reference,
            },
        })
        const token = btoa(`${verification.clientId}:${verification.secret}`)
        const payload = {
            reference: `${reference}`,
            callback_url: verification.callbackUrl,
            redirect_url: verification.redirectUrl,
            country: verification.country.value,
            language: "EN",
            verification_mode: "any",
            manual_review: "1",
        }

        if (
            verification.shuftReferencePayload?.docStatus === false ||
            verification.shuftReferencePayload === "INVALID"
        ) {
            const documentProof = await getBase64(verification.documentProof.files[0])
            payload["document"] = {
                proof: documentProof,
                supported_types: ["id_card", "passport", "driving_license"],
                verification_instructions: {
                    allow_paper_based: "1",
                    allow_photocopy: "1",
                    allow_laminated: "1",
                    allow_screenshot: "1",
                    allow_cropped: "1",
                    allow_scanned: "1",
                },
                allow_offline: "1",
            }
        }

        if (
            verification.shuftReferencePayload?.addrStatus === false ||
            verification.shuftReferencePayload === "INVALID"
        ) {
            const addressProof = await getBase64(verification.addressProof.files[0])
            payload["address"] = {
                full_address: verification.address,
                proof: addressProof,
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
                allow_offline: "1",
            }
        }

        if (
            verification.shuftReferencePayload?.conStatus === false ||
            verification.shuftReferencePayload === "INVALID"
        ) {
            const consentProof = await getBase64(verification.consentProof.files[0])
            payload["consent"] = {
                proof: consentProof,
                text: verification.consentText,
                supported_types: ["printed", "handwritten"],
                allow_offline: "1",
            }
        }
        if (
            verification.shuftReferencePayload?.selfieStatus === false ||
            verification.shuftReferencePayload === "INVALID"
        )
            payload["face"] = {
                proof: verification.faceProof.selfieImage,
                allow_offline: "1",
            }

        axios
            .post(verification.shuftiProBaseUrl, payload, {
                headers: {
                    Authorization: `Basic ${token}`,
                },
            })
            .catch((error) => {
                console.log(error)
            })

        verification.setSubmitting(false)
    }

    useEffect(() => {
        sendShuftiRequest()
    }, [])
    // Render
    const [loading, setLoading] = useState(true)
    return (
        <>
            <div className={`${!loading && "d-none"}`}>
                <Loading />
            </div>
            <div className={`col-sm-12 col-11 mx-auto mt-3 mt-sm-0 ${loading && "d-none"}`}>
                <h4 className="text-center  mt-5 mt-sm-2 mb-4">Verify your identity</h4>
                <div className="text-center">
                    <img
                        className="d-sm-block d-none"
                        src={VerifyIdStep7}
                        onLoad={() => setLoading(false)}
                        alt="step indicator"
                    />
                </div>
                <div className="my-sm-5 py-sm-5 verify-step1">
                    <div className="text-center">
                        <p className="fs-25px fw-bold text-light d-sm-block d-none my-sm-0 my-5">
                            Thank you, your verification result will be sent to your email soon.
                        </p>
                        <p className="fs-16px fw-bold text-light d-block d-sm-none">
                            Thank you, your verification result will be sent to your email soon.
                        </p>
                        <p className="fs-14px px-sm-2 px-4 mt-3">
                            As soley the data processor, NDB acknowledges your right to request
                            access, erasure, and retention of your data.
                            <div className="d-sm-block d-none">
                                <br />
                            </div>
                            Contact out Data Compliance Officer at{" "}
                            <span className="text-success">privacy@ndb.technology</span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-center gap-3 mt-5 col-md-12">
                        <Link
                            to={ROUTES.profile}
                            className="btn btn-success rounded-0 px-3 py-2 text-uppercase fw-500 text-light col-md-6 col-12"
                        >
                            Back to Profile
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
