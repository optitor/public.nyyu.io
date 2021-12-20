import React, { useReducer } from "react"
import { Link, navigate } from "gatsby"
import validator from "validator"
import { social_links } from "../../utilities/staticData"
import { FormInput } from "../common/FormControl"
import AuthLayout from "../common/AuthLayout"
import { useSigninMutation } from "../../apollo/network/auth"
import { useAuth } from "../../hooks/useAuth"
import CustomSpinner from "../common/custom-spinner"

const Signin = () => {
    // Auth Check
    const auth = useAuth()
    if (auth?.isLoggedIn()) navigate("/app/profile")

    // Containers
    const [signinMutation, signinMutationResults] = useSigninMutation()
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        email: { value: "", error: "" },
        pwd: { value: "", error: "" },
        remember: false,
    })
    const { email, pwd, remember } = state

    // Methods
    const signUserIn = (e) => {
        e.preventDefault()
        let error = false
        if (!email.value || !validator.isEmail(email.value)) {
            setState({
                email: {
                    error: "Invalid email address",
                },
            })
            error = true
        }
        if (!pwd.value || pwd.value?.length < 6) {
            setState({
                pwd: {
                    error: "Password length must be at least 6",
                },
            })
            error = true
        }

        if (!error) signinMutation(email.value, pwd.value)
    }

    const pending = signinMutationResults.loading

    return (
        <AuthLayout>
            <h3 className="signup-head">Sign in</h3>
            <form className="form">
                <div className="form-group">
                    <FormInput
                        name="email"
                        type="text"
                        label="Email"
                        value={email.value}
                        onChange={(e) => {
                            setState({
                                email: {
                                    value: e.target.value,
                                },
                            })
                        }}
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
                        onChange={(e) => {
                            setState({
                                pwd: {
                                    value: e.target.value,
                                },
                            })
                        }}
                        placeholder="Enter password"
                        error={pwd.error}
                    />
                </div>
                <div className="form-group d-flex justify-content-between align-items-center mb-5">
                    <label className="d-flex align-items-center gap-2">
                        <input
                            type="checkbox"
                            name="remember"
                            value={remember}
                            className="form-check-input"
                            onChange={() => setState({ remember: !remember })}
                        />
                        <div className="keep-me-signed-in-text">
                            Keep me signed in in this device
                        </div>
                    </label>
                    <Link className="txt-green forget-pwd" to="/app/password-reset">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center py-2"
                    disabled={pending}
                    onClick={signUserIn}
                >
                    <div className={`${pending ? "opacity-1" : "opacity-0"}`}>
                        <CustomSpinner />
                    </div>
                    <div className={`${pending ? "ms-3" : "pe-4"}`}>sign in</div>
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
