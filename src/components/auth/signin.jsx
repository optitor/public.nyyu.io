import React, { useState } from "react"
import { Link, navigate } from "gatsby"
import validator from "validator"
import { passwordValidatorOptions, social_links } from "../../utilities/staticData"
import { FormInput } from "../common/FormControl"
import AuthLayout from "../common/AuthLayout"
import { useSigninMutation } from "../../apollo/model/auth"
import { useAuth } from "../../hooks/useAuth"
import CustomSpinner from "../common/custom-spinner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { ROUTES } from "../../utilities/routes"

const Signin = (props) => {
    // Auth Check
    const auth = useAuth()
    if (auth?.isLoggedIn()) navigate(ROUTES.profile)

    // Containers
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const [remember, setRemember] = useState(false)

    const [emailError, setEmailError] = useState("")
    const [pwdError, setPwdError] = useState("")

    const [passwordVisible, setPasswordVisible] = useState(false)

    const [signinMutation, signinMutationResults] = useSigninMutation()

    // Methods
    const signUserIn = (e) => {
        e.preventDefault()
        setEmailError("")
        setPwdError("")
        let error = false
        if (!email || !validator.isEmail(email)) {
            setEmailError("Invalid email address")
            error = true
        }
        if (!pwd || !validator.isStrongPassword(pwd, passwordValidatorOptions)) {
            setPwdError(
                "Password must contain at least 8 characters, including UPPER/lowercase and numbers!"
            )
            error = true
        }

        if (!error) signinMutation(email, pwd)
    }

    const pending = signinMutationResults?.loading
    const webserviceError = signinMutationResults?.data?.signin.status === "Failed"

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
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        error={emailError}
                    />
                </div>
                <div className="form-group position-relative">
                    <FormInput
                        type={passwordVisible ? "text" : "password"}
                        label="Password"
                        value={pwd.value}
                        onChange={(e) => setPwd(e.target.value)}
                        placeholder="Enter password"
                        error={pwdError}
                    />
                    {passwordVisible ? (
                        <svg
                            className="password-eye-icon"
                            onClick={() => setPasswordVisible(false)}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            className="password-eye-icon"
                            onClick={() => setPasswordVisible(true)}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            ></path>
                        </svg>
                    )}
                </div>
                <div className="form-group d-flex justify-content-between align-items-center mb-5">
                    <label className="d-flex align-items-center gap-2">
                        <input
                            type="checkbox"
                            name="remember"
                            value={remember}
                            className="form-check-input"
                            onChange={() => setRemember(!remember)}
                        />
                        <div className="keep-me-signed-in-text">
                            Keep me signed in in this device
                        </div>
                    </label>
                    <Link className="txt-green forget-pwd" to={ROUTES.forgotPassword}>
                        Forgot password?
                    </Link>
                </div>
                {webserviceError && (
                    <span className="errorsapn">
                        <FontAwesomeIcon icon={faExclamationCircle} />{" "}
                        {signinMutationResults?.data?.signin.token}
                    </span>
                )}
                {props.error && props.error.split(".")[0] === "InvalidProvider" && (
                    <span className="errorsapn">
                        <FontAwesomeIcon icon={faExclamationCircle} /> Your are already signed up
                        with{" "}
                        <span className="text-uppercase errorsapn">
                            {props.error.split(".")[1]}
                        </span>
                        . Please use it.
                    </span>
                )}
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
