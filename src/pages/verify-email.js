import React, { useCallback, useReducer } from "react"
import { Link } from "gatsby"
import { Input } from "../components/common/FormControl"
import AuthLayout from "../components/common/AuthLayout"

const ForgetPassword = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        code: "",
    })
    const { code } = state
    const handleInput = useCallback((e) => {
        e.preventDefault()
        setState({ [e.target.name]: e.target.value })
    }, [])
    return (
        <AuthLayout>
            <h3 className="signup-head mb-5">Verify email</h3>
            <form className="form">
                <div className="form-group">
                    <Input
                        type="text"
                        name="code"
                        value={code}
                        onChange={handleInput}
                        placeholder="Enter code"
                    />
                </div>
                <div className="form-group text-white">
                    Didn’t receive your code?{" "}
                    <Link className="txt-green signup-link" to="/verify-failed">
                        Send again
                    </Link>
                </div>
                <button type="submit" className="btn-primary w-100 text-uppercase my-5">
                    Confirm code
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

export default ForgetPassword
