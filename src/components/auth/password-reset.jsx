import React, { useCallback, useReducer, useEffect } from "react"
import { Link, navigate } from "gatsby"
import { FormInput } from "../common/FormControl"
import validator from "validator"
import AuthLayout from "../common/AuthLayout"
import { useForgotPassword } from "../../apollo/network/auth"
import { useAuth } from "../../hooks/useAuth"

const ForgetPassword = () => {
    const auth = useAuth();

    useEffect(() => {
        if(auth?.isLoggedIn())
            navigate("/app/profile")
    }, [])

    
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        email: { value: "", error: "" },
    })
    const { email } = state
    const handleEmailChange = useCallback((e) => {
        setState({
            email: {
                value: e.target.value,
                error: validator.isEmail(e.target.value) ? "" : "Invalid email address",
            },
        })
    }, [])

    const [forgotPwdMutation, forgotPwdMutationResults] = useForgotPassword();

    return (
        <AuthLayout>
            <h3 className="signup-head mb-5">Forgot password</h3>
            <form 
                className="form"
                onSubmit={(e) => {
                    e.preventDefault()
                    forgotPwdMutation(email.value)
                }}
            >
                <div className="form-group">
                    <FormInput
                        name="email"
                        type="text"
                        value={email.value}
                        onChange={handleEmailChange}
                        placeholder="Enter email"
                        error={email.error}
                    />
                </div>
                <div className="form-group text-white">
                    <span className="signup-text-link">Didn't receive an email? </span>
                    <Link className="signup-link" to="#">
                        Send again
                    </Link>
                </div>
                <button type="submit" className="btn-primary w-100 text-uppercase my-5">
                    Reset password
                </button>
            </form>
            <p className="text-white text-center">
                Return to{" "}
                <Link to="/signin" className="signup-link">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    )
}

export default ForgetPassword
