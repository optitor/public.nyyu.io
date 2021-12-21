import React, { useCallback, useState } from "react"
import { Link, navigate } from "gatsby"
import { Input } from "../common/FormControl"
import AuthLayout from "../common/AuthLayout"
import { useSignIn2FA } from "../../apollo/network/auth"
import { useUser } from "../../hooks/useUser"

const OnetimePassword = () => {
    const [code, setCode] = useState("")
    const [user] = useUser()

    if(!user.tempToken || !user.email)
        navigate("/app/signin")

    const handleCodeChange = useCallback((e) => {
        setCode(e.target.value)
    }, [])

    const [signin2faMutation, signin2faMutationResults] = useSignIn2FA()

    const disableForm = signin2faMutationResults.loading

    return (
        <AuthLayout>
            <h3 className="signup-head mb-5">One-Time Password</h3>
            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault()
                    signin2faMutation(user.email, user.tempToken, code)
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
                    <Link className="signup-link" to="#">
                        Send again
                    </Link>
                </div>
                <button
                    type="submit"
                    className="btn-primary w-100 text-uppercase my-5"
                    disabled={disableForm}
                >
                    Confirm Code
                </button>
            </form>
            <p className="text-white text-center">
                Return to{" "}
                <Link to="/app/signup" className="signup-link">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    )
}

export default OnetimePassword
