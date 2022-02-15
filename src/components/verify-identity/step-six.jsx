import axios from "axios"
import Webcam from "react-webcam"
import Loading from "../common/Loading"
import React, { useRef, useState } from "react"
import CustomSpinner from "../common/custom-spinner"
import { useVerification } from "./verification-context"
import { getBase64 } from "../../utilities/utility-methods"
import { SelfieImg, VerifyIdStep6 } from "../../utilities/imgImport"
import { useMutation } from "@apollo/client"
import { INSERT_UPDATE_REFERENCE } from "./kyc-webservice"
import { v4 as uuidv4 } from "uuid"

export default function StepSix() {
    // Containers
    const verification = useVerification()
    const webcamRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const [selfieImage, setSelfieImage] = useState()
    const [openWebcam, setOpenWebcam] = useState(false)
    const [reference, setReference] = useState(uuidv4())

    // Webservice
    const [insertUpdateReference] = useMutation(INSERT_UPDATE_REFERENCE)

    // Methods
    const capture = () => {
        const fooImage = webcamRef.current.getScreenshot()
        setSelfieImage(fooImage)
        return setOpenWebcam(false)
    }
    const sendShuftiRequest = async () => {
        verification.setSubmitting(true)
        insertUpdateReference({
            variables: {
                reference,
            },
        })
        const documentProof = await getBase64(verification.documentProof.files[0])
        const addressProof = await getBase64(verification.addressProof.files[0])
        const consentProof = await getBase64(verification.consentProof.files[0])
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

        if (verification.shuftReferencePayload?.docStatus === false)
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

        if (verification.shuftReferencePayload?.addrStatus === false)
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

        if (verification.shuftReferencePayload?.conStatus === false)
            payload["consent"] = {
                proof: consentProof,
                text: verification.consentText,
                supported_types: ["printed", "handwritten"],
                allow_offline: "1",
            }
        if (verification.shuftReferencePayload?.selfieStatus === false)
            payload["face"] = {
                proof: selfieImage,
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
        verification.nextStep()
    }

    // Render
    verification.shuftReferencePayload?.selfieStatus === true && verification.nextStep()
    return (
        <>
            <div className={`${!loading && "d-none"}`}>
                <Loading />
            </div>
            <div className={`col-sm-12 col-11 mx-auto mt-3 mt-sm-0 ${loading && "d-none"}`}>
                <h4 className="text-center  mt-5 mt-sm-2 mb-4">Verify your identity</h4>
                <div className="text-center">
                    <div className="d-block d-sm-none">
                        <div className="txt-green text-uppercase fw-bold fs-18px mb-3">step 4</div>
                        <div className="text-light fs-14px fw-bold">Face verification</div>
                    </div>
                    <img
                        className="d-sm-block d-none"
                        src={VerifyIdStep6}
                        onLoad={() => setLoading(false)}
                        alt="step indicator"
                    />
                </div>
                <div className="my-sm-5 verify-step1">
                    <div className="text-center mt-3 mt-sm-0">
                        <p className="fs-16px">
                            Face the camera. Make sure your face is visible including the ears.
                            <div className="d-sm-block d-none"></div>
                            Have good lightening and face the camera straight on.
                        </p>
                        {openWebcam ? (
                            <div className="mx-auto col-sm-8 col-12">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="mt-4"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                />
                            </div>
                        ) : (
                            <img
                                className="selfie-img mt-4"
                                src={selfieImage ? selfieImage : SelfieImg}
                                alt="seflie"
                            />
                        )}
                    </div>
                    <div className="d-flex justify-content-center gap-2 mt-5 col-md-12">
                        {!selfieImage && (
                            <button
                                className="btn btn-outline-light rounded-0 px-3 py-2 text-uppercase fw-500 col-sm-3 col-6"
                                onClick={() => verification.previousStep()}
                            >
                                back
                            </button>
                        )}
                        {openWebcam ? (
                            <button
                                className="btn btn-success rounded-0 px-3 py-2 text-uppercase fw-500 text-light col-sm-3 col-6"
                                onClick={capture}
                            >
                                take photo
                            </button>
                        ) : (
                            <button
                                className="btn btn-success rounded-0 px-3 py-2 text-uppercase fw-500 text-light col-sm-3 col-6"
                                onClick={() => {
                                    setOpenWebcam(true)
                                    setSelfieImage(null)
                                }}
                            >
                                {selfieImage ? "retake" : "open camera"}
                            </button>
                        )}
                        {selfieImage && !openWebcam && (
                            <button
                                disabled={verification.submitting}
                                className="btn btn-outline-light rounded-0 px-3 py-2 text-uppercase fw-500 col-sm-3 col-6"
                                onClick={sendShuftiRequest}
                            >
                                {verification.submitting ? (
                                    <div className="mt-3px">
                                        <CustomSpinner />
                                    </div>
                                ) : (
                                    "complete"
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
