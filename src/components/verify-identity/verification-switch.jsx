import React from "react"
import StepSix from "../verify-identity/step-six"
import StepOne from "../verify-identity/step-one"
import StepTwo from "../verify-identity/step-two"
import StepFour from "../verify-identity/step-four"
import StepFive from "../verify-identity/step-five"
import StepThree from "../verify-identity/step-three"
import StepSeven from "../verify-identity/step-seven"
import PrimaryStep from "../verify-identity/primary-step"
import { useVerification } from "./verification-context"

export default function VerificationSwitch() {
    const verification = useVerification()
    return (
        <>
            {verification.step === -1 && <PrimaryStep />}
            {verification.step === 0 && <StepOne />}
            {verification.step === 1 && <StepTwo />}
            {verification.step === 2 && <StepThree />}
            {verification.step === 3 && <StepFour />}
            {verification.step === 4 && <StepFive />}
            {verification.step === 5 && <StepSix submitKYCData={() => {}} />}
            {verification.step === 6 && <StepSeven />}
        </>
    )
}
