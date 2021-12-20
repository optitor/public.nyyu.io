import { Link } from "gatsby"
import validator from "validator"
import Select from "react-select"
import AuthLayout from "../common/AuthLayout"
import CustomSpinner from "../common/custom-spinner"
import { FormInput, CheckBox } from "../common/FormControl"
import { useSignupMutation } from "../../apollo/network/auth"
import React, { useCallback, useReducer, useState } from "react"
import { countries, social_links } from "../../utilities/staticData"

const SingupPage = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        email: { value: "", error: "" },
        pwd: { value: "", error: "" },
        pwd_confirm: { value: "", error: "" },
        remember: false,
    })
    const { email, pwd, pwd_confirm, remember } = state
    const [country, setCountry] = useState(countries[0])

    const [emailError, setEmailError] = useState("")
    const [pwdError, setPwdError] = useState("")
    const [pwdConfirmError, setPwdConfirmError] = useState("")

    const [signupMutation, signupMutationResults] = useSignupMutation()

    const pending = signupMutationResults.loading

    return (
        <AuthLayout>
            <h3 className="signup-head">Create an Account</h3>
            <p className="signup-subhead">
                Create an account to participate in the auction and to start bidding!
            </p>
            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault()
                    signupMutation(email.value, pwd.value, country.value)
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
                <div className="row">
                    <div className="form-group col-md-6">
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
                    <div className="form-group col-md-6">
                        <FormInput
                            name="pwd_confirm"
                            type="password"
                            label="Password Confirmation"
                            value={pwd_confirm.value}
                            onChange={handlePwdConfirmChange}
                            placeholder="Enter password"
                            error={pwd_confirm.error}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <p className="form-label">Country of residence</p>
                    <Select
                        options={countries}
                        value={country}
                        id="signup-country-dropdown"
                        onChange={(v) => setCountry(v)}
                        placeholder="Choose country"
                        className="text-left"
                    />
                </div>
                <div className="form-group">
                    <CheckBox
                        name="remember"
                        type="checkbox"
                        value={remember}
                        onChange={handleRememberChange}
                    >
                        Agree to{" "}
                        <Link to="/" className="text-info terms-link">
                            Terms & Conditions
                        </Link>
                    </CheckBox>
                </div>
                <button
                    type="submit"
                    className="btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center py-2 mt-3"
                    disabled={pending}
                >
                    <div className={`${pending ? "opacity-1" : "opacity-0"}`}>
                        <CustomSpinner />
                    </div>
                    <div className={`${pending ? "ms-3" : "pe-4"}`}>sign up with email</div>
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
                Already have an account?{" "}
                <Link to="/app/signin" className="signup-link">
                    Sign In
                </Link>
            </p>
        </AuthLayout>
    )
}

export default SingupPage
