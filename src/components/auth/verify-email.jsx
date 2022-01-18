import React, { useState } from "react"
import { Link, navigate } from "gatsby"
import { Input } from "../common/FormControl"
import { useMutation } from "@apollo/client"
import { VERIFY_ACCOUNT, RESEND_VERIFY_CODE } from "../../apollo/graghqls/mutations/Auth"
import { ROUTES } from "../../utilities/routes"

const VerifyEmail = ({ email, onResult }) => {
    const [code, setCode] = useState("")

    const [verifyAccount] = useMutation(VERIFY_ACCOUNT, {
        onCompleted: (data) => {
            if (data.verifyAccount === "Failed") onResult(false)
            else if (data.verifyAccount === "Success") onResult(true)
        },
    })

    const [resendVerifyCode] = useMutation(RESEND_VERIFY_CODE, {
        onCompleted: (data) => {
            if (data.resendVerifyCode === "Already verified") {
                navigate(ROUTES.signIn + "error.Already verified")
            }
        },
    })

    return (
        <>
            <h3 className="signup-head mb-5">Verify email</h3>
            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault()
                    verifyAccount({
                        variables: {
                            email,
                            code,
                        },
                    })
                }}
            >
                <div className="form-group">
                    <Input
                        type="text"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter code"
                    />
                </div>
                <div className="form-group text-white">
                    Didn’t receive your code?{" "}
                    <Link
                        className="txt-green signup-link"
                        to="#"
                        onClick={() =>
                            resendVerifyCode({
                                variables: {
                                    email,
                                },
                            })
                        }
                    >
                        Send again
                    </Link>
                </div>
                <button type="submit" className="btn-primary w-100 text-uppercase my-5">
                    Confirm code
                </button>
            </form>
            <p className="text-white text-center">
                Return to{" "}
                <Link to="/app/signup" className="signup-link">
                    Sign up
                </Link>
            </p>
        </>
    )
}

export default VerifyEmail
