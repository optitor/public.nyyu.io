import React, { useCallback, useReducer } from "react"
import { Link, navigate } from "gatsby"
import { Input } from "../components/common/FormControl"
import AuthLayout from "../components/common/AuthLayout"
import Modal from "react-modal"
import { CloseIcon } from "../utilities/imgImport"
import { useSelector } from "../context/store"
import { useMutation } from "@apollo/client"
import { VERIFY_ACCOUNT } from "../services/mutations/auth"

const VerifyEmail = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        code: "",
        tfaModal: true,
    })
    const { code, tfaModal } = state

    console.log("code", code)

    const handleInput = useCallback((e) => {
        e.preventDefault()
        setState({ [e.target.name]: e.target.value })
    }, [])

    const user = useSelector(state => state.user)
    if(!user.userEmail) navigate("/signup")
    
    // possible code: [verifyAccount, { data, loading, error }]
    const [verifyAccount] = useMutation(
        VERIFY_ACCOUNT, 
        {
            onCompleted: (data) => {
                if(data.verifyAccount === "Failed") navigate("/verify-failed")
                else if(data.verifyAccount === "Success") navigate("/2fa")
                console.log("Verify result", data)                         
            }
        }
    )
    
    return (
        <AuthLayout>
            <h3 className="signup-head mb-5">Verify email</h3>
            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault()
                    verifyAccount({
                        variables: {
                            email: user.userEmail,
                            code: code,
                        },
                    })
                }}
            >
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
                    <Link
                        className="txt-green signup-link"
                        to=""
                        onClick={() => console.log("clicked")}
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
                <Link to="/signup" className="signup-link">
                    Sign up
                </Link>
            </p>
            <Modal
                isOpen={tfaModal}
                onRequestClose={() => setState({ tfaModal: false })}
                ariaHideApp={false}
                className="twoFA-modal"
                overlayClassName="2fa-modal__overlay"
            >
                <p className="tfa-modal__header">
                    <div
                        onClick={() => setState({ tfaModal: false })}
                        onKeyDown={() => setState({ tfaModal: false })}
                        role="button"
                        tabIndex="0"
                    >
                        <img width="14px" height="14px" src={CloseIcon} alt="close" />
                    </div>
                </p>
                <div className="twoFA-modal__body">
                    <div className="tfa-type">
                        <h2>Protect your account with 2-step verification</h2>
                        <p>
                            Each time you log in, in addition to your password, you will enter a
                            one-time code you receive via text message or generate using an
                            authenticator app.
                        </p>
                        <button className="btn-primary">Authenticator App</button>
                        <button className="btn-primary">SMS</button>
                        <button className="btn-primary">Email</button>
                    </div>
                </div>
                <div className="pwd-modal__footer">
                    <button className="btn-primary">Next</button>
                </div>
            </Modal>
        </AuthLayout>
    )
}

export default VerifyEmail
