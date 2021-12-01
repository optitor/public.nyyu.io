import React, { useCallback, useReducer, useState } from "react"
import { Link } from "gatsby"
import Select from "react-select"
import { countries, social_links } from "../utilities/staticData"
import { FormInput, CheckBox } from "../components/common/FormControl"
import validator from "validator"
import AuthLayout from "../components/common/AuthLayout"
// import { useMutation } from "@apollo/client"
// import { SIGNUP } from "../services/mutations/auth"

const SingupPage = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        email: { value: "", error: "" },
        pwd: { value: "", error: "" },
        pwd_confirm: { value: "", error: "" },
        remember: false,
    })
    const { email, pwd, pwd_confirm, remember } = state
    const [country, setCountry] = useState(countries[0])

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
    const handlePwdConfirmChange = useCallback((e) => {
        setState({
            pwd_confirm: {
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
    

    // const [signup, { data, loading, error }] = useMutation(SIGNUP)
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
                    // signup({
                    //     variables: {
                    //         email: email.value,
                    //         password: pwd.value,
                    //         country: country.label,
                    //     },
                    // })
                }}
            >
                <div className="form-group">
                    <FormInput
                        name="email"
                        type="text"
                        label="Email"
                        value={email.value}
                        onChange={handleEmailChange}
                        placeholder="Email"
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
                        onChange={(v) => setCountry(v)}
                        placeholder="Choose country"
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
                <button type="submit" className="btn-primary w-100 text-uppercase">
                    sign up with email
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
                <Link to="/signin" className="signup-link">
                    Sign In
                </Link>
            </p>
        </AuthLayout>
    )
}

export default SingupPage
