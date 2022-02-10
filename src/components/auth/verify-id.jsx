import Loading from "../common/Loading"
import useFileUpload from "react-use-file-upload"
import SimpleHeader from "../header/simple-header"
import StepOne from "../verify-identity/step-one"
import StepTwo from "../verify-identity/step-two"
import StepThree from "../verify-identity/step-three"
import StepFour from "../verify-identity/step-four"
import StepFive from "../verify-identity/step-five"
import StepSix from "../verify-identity/step-six"
import StepSeven from "../verify-identity/step-seven"
import { useMutation, useQuery } from "@apollo/client"
import PrimaryStep from "../verify-identity/primary-step"
import { GET_USER } from "../../apollo/graghqls/querys/Auth"
import React, { useReducer, useState, useEffect } from "react"
import { VerificationCountriesList } from "../../utilities/countries-list"
import { CREATE_NEW_REFERENCE } from "../../apollo/graghqls/mutations/Auth"

const VerificationPage = () => {
    // Containers
    const [reference, setReference] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [accept, setAccept] = useState(false)
    const [country, setCountry] = useState(VerificationCountriesList[0])
    const loadingData = !(userEmail && reference)
    const [firstName, setFirstName] = useState("")
    const [surname, setSurname] = useState("")
    const [stepThreeCountry, setStepThreeCountry] = useState(VerificationCountriesList[0])

    const [address, setAddress] = useState("")
    const {
        files: stepFourFiles,
        handleDragDropEvent: stepFourHandleDragDropEvent,
        setFiles: stepFourSetFiles,
        removeFile: stepFourRemoveFile,
    } = useFileUpload()
    const [selfieImage, setSelfieImage] = useState()
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        step: -1, // --> initial value: -1;
    })
    const { step } = state

    // WebService
    useQuery(GET_USER, {
        onCompleted: (res) => {
            setUserEmail(res.getUser?.email)
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
                    <div>
                        {step === -1 && (
                            <PrimaryStep
                                accept={accept}
                                setAccept={setAccept}
                                step={step}
                                setState={setState}
                            />
                        )}
                        {step === 0 && (
                            <StepOne
                                country={country}
                                setCountry={setCountry}
                                step={step}
                                setState={setState}
                            />
                        )}
                        {step === 1 && (
                            <StepTwo
                                firstName={firstName}
                                setFirstName={setFirstName}
                                surname={surname}
                                setSurname={setSurname}
                                step={step}
                                setState={setState}
                            />
                        )}
                        {step === 2 && (
                            <StepThree
                                country={stepThreeCountry}
                                setCountry={setStepThreeCountry}
                                step={step}
                                setState={setState}
                            />
                        )}
                        {step === 3 && (
                            <StepFour
                                address={address}
                                setAddress={setAddress}
                                step={step}
                                setState={setState}
                            />
                        )}
                        {step === 4 && (
                            <StepFive
                                step={step}
                                setState={setState}
                                files={stepFourFiles}
                                setFiles={stepFourSetFiles}
                                handleDragDropEvent={stepFourHandleDragDropEvent}
                                removeFile={stepFourRemoveFile}
                            />
                        )}
                        {step === 5 && (
                            <StepSix
                                step={step}
                                setState={setState}
                                selfieImage={selfieImage}
                                setSelfieImage={setSelfieImage}
                                submitting={submitting}
                                submitKYCData={() => {}}
                            />
                        )}
                        {step === 6 && <StepSeven step={step} setState={setState} />}
                    </div>
                </section>
            </main>
        )
}

export default VerificationPage
