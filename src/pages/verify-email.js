import React, { useCallback, useReducer } from "react"
import { Link, navigate } from "gatsby"
import { Input } from "../components/common/FormControl"
import AuthLayout from "../components/common/AuthLayout"
import Modal from "react-modal"
import { CloseIcon, QRCode2 } from "../utilities/imgImport"
import { useSelector } from "../context/store"
import { useMutation } from "@apollo/client"
import { VERIFY_ACCOUNT, RESEND_VERIFY_CODE, REQUEST_2FA } from "../services/mutations/auth"

const two_factors = [
    {label: "Authenticator App", method: "app"}, 
    {label:"SMS", method: "phone"}, 
    {label:"Email", method: "email"}
]

const VerifyEmail = () => {
    const user = useSelector((state) => state.user)
    
    if(!user.userEmail) navigate("/signup")

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        code: "",
        tfaModal: false,
        auth_code: "",
        sms_code: "",
        email_code: "",
        choose_type: 0,
        set_type: -1,
    })
    const { code, tfaModal, auth_code, sms_code, email_code, choose_type, set_type } = state

    const handleInput = useCallback((e) => {
        e.preventDefault()
        setState({ [e.target.name]: e.target.value })
    }, [])


    // possible code: [verifyAccount, { data, loading, error }]
    const [verifyAccount] = useMutation(VERIFY_ACCOUNT, {
        onCompleted: (data) => {
            console.log("Verify result", data)
            if (data.verifyAccount === "Failed") navigate("/verify-failed")
            else if (data.verifyAccount === "Success") setState({tfaModal: true})
        },
    })

    const [resendVerifyCode] = useMutation(RESEND_VERIFY_CODE, {
        onCompleted: (data) => {
            console.log("Resend Result", data)
            // do something here to show resend email result.
        },
    })

    const [request2FA] = useMutation(REQUEST_2FA, {
        onCompleted: (data) => {
            console.log("request2FA Result", data)
            setState({ set_type: choose_type })
        },
    })

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
                        to="#send-again"
                        onClick={() => 
                            resendVerifyCode({
                                variables: {
                                    email: user.userEmail,
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
                <div className="tfa-modal__header">
                    <div
                        onClick={() => setState({ tfaModal: false })}
                        onKeyDown={() => setState({ tfaModal: false })}
                        role="button"
                        tabIndex="0"
                    >
                        <img width="14px" height="14px" src={CloseIcon} alt="close" />
                    </div>
                </div>
                <div className="twoFA-modal__body">
                    {set_type === -1 && (
                        <div className="tfa-select">
                            <h3>Protect your account with 2-step verification</h3>
                            <p className="mt-4 mb-5">
                                Each time you log in, in addition to your password, you will enter a
                                one-time code you receive via text message or generate using an
                                authenticator app.
                            </p>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                {two_factors.map((item, idx) => (
                                    <button
                                        key={idx}
                                        className={`btn-primary mb-2 select-tfa ${
                                            choose_type === idx && "active"
                                        }`}
                                        onClick={() => setState({ choose_type: idx })}
                                    >
                                        {item.label}
                                    </button>
                                ))}

                                <button
                                    className="btn-primary next-step mt-4"
                                    onClick={() => 
                                        request2FA({
                                            variables: {
                                                email: user.userEmail,
                                                method: two_factors[choose_type],
                                                phone: "123456789"
                                            },
                                        })
                                    }
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                    {set_type === 0 && (
                        <div className="get-code">
                            <h3>Get codes from authenticator app</h3>
                            <div className="mt-3">
                                <p className="fw-bolder">STEP 1</p>
                                <p className="step1-label">
                                    Scan the QR code below or mannually type the secret key into
                                    your authenticator app.
                                </p>
                                <img src={QRCode2} alt="qr code" />
                                <p>
                                    <small className="fw-bold">123456xxxx</small>
                                </p>
                            </div>
                            <div className="mt-3">
                                <p className="fw-bolder">STEP 2</p>
                                <p className="mt-2 mb-3">
                                    Enter 6-digit code you see in your authentificator app
                                </p>
                                <Input
                                    type="text"
                                    name="auth_code"
                                    value={auth_code}
                                    onChange={handleInput}
                                    placeholder="000-000"
                                />
                                <button className="btn-primary next-step">Confirm</button>
                            </div>
                        </div>
                    )}

                    {set_type === 1 && (
                        <div className="get-code">
                            <h3>Get codes via SMS</h3>
                            <p className="mt-3 pb-3">
                                Enter 6-digit code you got via text messages
                            </p>
                            <div className="mt-5">
                                <Input
                                    type="text"
                                    name="sms_code"
                                    value={sms_code}
                                    onChange={handleInput}
                                    placeholder="000-000"
                                />
                                <button className="btn-primary next-step">Confirm</button>
                            </div>
                        </div>
                    )}

                    {set_type === 2 && (
                        <div className="get-code">
                            <h3>Get codes via Email</h3>
                            <p className="mt-3 pb-3">Enter 6-digit code you got via email</p>
                            <div className="mt-5">
                                <Input
                                    type="text"
                                    name="email_code"
                                    value={email_code}
                                    onChange={handleInput}
                                    placeholder="000-000"
                                />
                                <button className="btn-primary next-step">Confirm</button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthLayout>
    )
}

export default VerifyEmail
