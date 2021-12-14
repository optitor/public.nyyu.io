import React, { useCallback, useReducer, useEffect } from "react"
import { Link, navigate } from "gatsby"
import validator from "validator"
import { social_links } from "../../utilities/staticData"
import { FormInput, CheckBox } from "../common/FormControl"
import AuthLayout from "../common/AuthLayout"
import { useSigninMutation } from "../../apollo/network/auth"
import { useAuth } from "../../hooks/useAuth"

const Signin = () => {
    const auth = useAuth();

    useEffect(() => {
        if(auth?.isLoggedIn())
            navigate("/app/profile")
    }, [])

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        email: { value: "", error: "" },
        pwd: { value: "", error: "" },
        remember: false,
    })
    const { email, pwd, remember } = state
    const handleEmailChange = useCallback((e) => {
        setState({
            email: {
                value: e.target.value,
                error: validator.isEmail(e.target.value) ? "" : "Invalid email address",
            },
        })
    }, [])
    const handlePasswordChange = useCallback((e) => {
        setState({
            pwd: {
                value: e.target.value,
                error: e.target.value.length >= 6 ? "" : "Password length must be at least 6",
            },
        })
    }, [])

    const handleRememberChange = useCallback(
        (e) => {
            setState({ remember: !remember })
        },
        [remember]
    )

    const [signinMutation, signinMutationResults] = useSigninMutation();

    const disableForm = signinMutationResults.loading;

    return (
        <AuthLayout>
            <h3 className="signup-head">Sign in</h3>
            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault()
                    signinMutation(email.value, pwd.value)
                }}
            >
                <div className="form-group">
                    <FormInput
                        name="email"
                        type="text"
                        label="Email"
                        value={email.value}
                        onChange={handleEmailChange}
                        placeholder="Enter email"
                        error={email.error}
                    />
                </div>
                <div className="form-group ">
                    <FormInput
                        name="password"
                        type="password"
                        label="Password"
                        value={pwd.value}
                        onChange={handlePasswordChange}
                        placeholder="Enter password"
                        error={pwd.error}
                    />
                </div>
                <div className="form-group d-flex justify-content-between align-items-center mb-5">
                    <CheckBox
                        name="remember"
                        type="checkbox"
                        value={remember}
                        onChange={handleRememberChange}
                    >
                        Keep me signed in in this device
                    </CheckBox>
                    <Link className="txt-green forget-pwd" to="/app/password-reset">
                        Forgot password?
                    </Link>
                </div>
                <button type="submit" className="btn-primary w-100 text-uppercase" disabled={disableForm}>
                    sign In
                </button>
            </form>
            <ul className="social-links">
                {social_links.map((item, idx) => (
                    <li key={idx}>
                        <a href={item.to}>
                            <img src={item.icon} alt="icon" />
                        </a>
                    </li>
                ))}
            </ul>
            <p className="text-white text-center">
                Do not have an account?{" "}
                <Link to="/app/signup" className="signup-link">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    )
}

export default Signin
