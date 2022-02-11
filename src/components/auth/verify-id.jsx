import Loading from "../common/Loading"
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
import { GET_SHUFT_REFERENCE, SEND_VERIFY_REQUEST } from "../verify-identity/kyc-webservice"

const VerificationPage = () => {
    // Containers
    const [reference, setReference] = useState(null)
    const [userEmail, setUserEmail] = useState("")

    const [country, setCountry] = useState(VerificationCountriesList[0])
    const [firstName, setFirstName] = useState("")
    const [surname, setSurname] = useState("")
    const [address, setAddress] = useState("")

    const [shuftReference, setShuftReference] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const loadingData = !(userEmail && reference && shuftReference)

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
    useQuery(GET_SHUFT_REFERENCE, {
        onCompleted: (data) => {
            setShuftReference(data.getShuftReference)
        },
        fetchPolicy: "network-only",
        errorpolicy: "ignore",
    })
    const [createNewReference] = useMutation(CREATE_NEW_REFERENCE, {
        onCompleted: (data) => {
            setReference(data.createNewReference)
        },
    })
    const [sendVerifyRequest] = useMutation(SEND_VERIFY_REQUEST, {
        onCompleted: (data) => {
            console.log(data)
            setSubmitting(false)
            setState({ step: step + 1 })
        },
        onError: (err) => {
            if (err) setSubmitting(false)
        },
    })

    // Methods
    const submitKYCData = () => {
        setSubmitting(true)
        sendVerifyRequest({
            variables: {
                country: country.value,
                fullAddr: address,
                firstName: firstName,
                middleName: "",
                lastName: surname,
            },
        })
    }
    const nextStep = () => setState({ step: step + 1 })
    const previousStep = () => setState({ step: step - 1 })

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
                        <div>
                            {step === -1 &&
                                (shuftReference.reference !== null ? (
                                    nextStep()
                                ) : (
                                    <PrimaryStep step={step} setState={setState} />
                                ))}
                            {step === 0 &&
                                (shuftReference.docStatus ? (
                                    nextStep()
                                ) : (
                                    <StepOne
                                        country={country}
                                        setCountry={setCountry}
                                        step={step}
                                        setState={setState}
                                    />
                                ))}
                            {step === 1 &&
                                (shuftReference.docStatus ? (
                                    nextStep()
                                ) : (
                                    <StepTwo
                                        firstName={firstName}
                                        setFirstName={setFirstName}
                                        surname={surname}
                                        setSurname={setSurname}
                                        step={step}
                                        setState={setState}
                                    />
                                ))}
                            {step === 2 &&
                                (shuftReference.addrStatus ? (
                                    nextStep()
                                ) : (
                                    <StepThree
                                        country={country}
                                        setCountry={setCountry}
                                        step={step}
                                        setState={setState}
                                    />
                                ))}
                            {step === 3 &&
                                (shuftReference.addrStatus ? (
                                    nextStep()
                                ) : (
                                    <StepFour
                                        address={address}
                                        setAddress={setAddress}
                                        step={step}
                                        setState={setState}
                                    />
                                ))}
                            {step === 4 &&
                                (shuftReference.conStatus ? (
                                    nextStep()
                                ) : (
                                    <StepFive step={step} setState={setState} />
                                ))}
                            {step === 5 &&
                                (shuftReference.selfieStatus ? (
                                    nextStep()
                                ) : (
                                    <StepSix
                                        step={step}
                                        setState={setState}
                                        submitting={submitting}
                                        submitKYCData={submitKYCData}
                                    />
                                ))}
                            {step === 6 && <StepSeven step={step} setState={setState} />}
                        </div>
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
