import React, { useCallback, useState } from "react"
import { Link } from "gatsby"
import { Input } from "../components/common/FormControl"
import AuthLayout from "../components/common/AuthLayout"
import { useAuthEmail, useAuthTempToken } from "../config/auth-config"
import { useSignIn2FA } from "../apollo/network/auth"

const OnetimePassword = () => {
    const [code, setCode] = useState("")

    const [token] = useAuthTempToken()

    const [email] = useAuthEmail()

    const handleCodeChange = useCallback((e) => {
        setCode(e.target.value)
    }, [])

    const [signin2faMutation, signin2faMutationResults] = useSignIn2FA();

    const disableForm = signin2faMutationResults.loading;

    return (
        <AuthLayout>
            <h3 className="signup-head mb-5">One-Time Password</h3>
            <form 
                className="form"
                onSubmit={(e) => {
                    e.preventDefault()
                    signin2faMutation(email, token, code)
                }}
            >
                <div className="form-group">
                    <Input
                        name="code"
                        type="text"
                        value={code}
                        onChange={handleCodeChange}
                        placeholder="Enter code"
                    />
                </div>
                <div className="form-group text-white">
                    Didn’t receive your code?{" "}
                    <Link className="signup-link" to="/verify-email">
                        Send again
                    </Link>
                </div>
                <button type="submit" className="btn-primary w-100 text-uppercase my-5" disabled={disableForm}>
                    Confirm Code
                </button>
            </form>
            <p className="text-white text-center">
                Return to{" "}
                <Link to="/signup" className="signup-link">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    )
}

export default OnetimePassword
