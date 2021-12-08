import React, { useCallback, useReducer } from "react"
import { Link } from "gatsby"
import { Input } from "../components/common/FormControl"
import AuthLayout from "../components/common/AuthLayout"
import Modal from "react-modal"
import { CloseIcon } from "../utilities/imgImport"

const ForgetPassword = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        code: "",
        tfaModal: true,
    })
    const { code, tfaModal } = state
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
            <Modal
                isOpen={tfaModal}
                onRequestClose={() => setState({ tfaModal: false })}
                ariaHideApp={false}
                className="2fa-modal"
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

                <div className="pwd-modal__footer">
                    <button className="btn-primary">Next</button>
                </div>
            </Modal>
        </AuthLayout>
    )
}

export default ForgetPassword
