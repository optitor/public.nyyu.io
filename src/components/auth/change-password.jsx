import React from "react"
import { Link, navigate } from "gatsby"
import { FormInput } from "../common/FormControl"
import AuthLayout from "../common/AuthLayout"
import CustomSpinner from "../common/custom-spinner"
import { ROUTES } from "../../utilities/routes"

const ForgetPassword = () => {
    const pending = false
    return (
        <AuthLayout>
            <h3 className="signup-head mb-0">Change password</h3>
            <form className="form">
                <div className="form-group">
                    <FormInput name="text" type="text" placeholder="Activation Code" />
                    <FormInput name="password" type="text" placeholder="Enter New Password" />
                    <FormInput name="password" type="text" placeholder="Confirm Password" />
                </div>
                <button
                    type="submit"
                    className="btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center py-2 mb-3 mt-5"
                    disabled={pending}
                >
                    <div className={`${pending ? "opacity-1" : "opacity-0"}`}>
                        <CustomSpinner />
                    </div>
                    <div className={`${pending ? "ms-3" : "pe-4"}`}>Confirm</div>
                </button>
                <div className="form-group text-white mb-3">
                    <span className="signup-text-link">Didn't receive an email? </span>
                    <Link className="signup-link" to={ROUTES.forgotPassword}>
                        Send again
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}

export default ForgetPassword
