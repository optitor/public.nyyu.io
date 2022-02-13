import useFileUpload from "react-use-file-upload"
import React, { useContext, useState } from "react"
import { VerificationCountriesList } from "../../utilities/countries-list"

export const VerificationContext = React.createContext()

export const useVerification = () => useContext(VerificationContext)

const VerificationProvider = ({ children }) => {
    // Containers
    const [address, setAddress] = useState("")
    const [firstName, setFirstName] = useState("")
    const [surname, setSurname] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [country, setCountry] = useState(VerificationCountriesList[0])
    const [step, setStep] = useState(-1) // --> initial value is -1
    const {
        files: documentFiles,
        handleDragDropEvent: documentHandleDragDropEvent,
        setFiles: documentSetFiles,
    } = useFileUpload()
    const {
        files: addressFiles,
        handleDragDropEvent: addressHandleDragDropEvent,
        setFiles: addressSetFiles,
    } = useFileUpload()
    const {
        files: consentFiles,
        handleDragDropEvent: consentHandleDragDropEvent,
        setFiles: consentSetFiles,
    } = useFileUpload()

    // Methods
    const nextStep = () => {
        return setStep(step + 1)
    }
    const previousStep = () => {
        return setStep(step - 1)
    }

    const providerValue = {
        nextStep,
        previousStep,
        step,
        setStep,
        submitting,
        setSubmitting,
        address,
        setAddress,
        firstName,
        setFirstName,
        surname,
        setSurname,
        country,
        setCountry,
        documentProof: {
            files: documentFiles,
            handleDragDropEvent: documentHandleDragDropEvent,
            setFiles: documentSetFiles,
        },
        addressProof: {
            files: addressFiles,
            handleDragDropEvent: addressHandleDragDropEvent,
            setFiles: addressSetFiles,
        },
        consent: {
            files: consentFiles,
            handleDragDropEvent: consentHandleDragDropEvent,
            setFiles: consentSetFiles,
        },
    }
    return (
        <VerificationContext.Provider value={providerValue}>
            <div>{children}</div>
        </VerificationContext.Provider>
    )
}

export default VerificationProvider
