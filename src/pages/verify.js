import { Link } from "gatsby"
import React, { useState, useReducer, useCallback } from "react"
import Header from "../components/common/header"
import Select from "react-select"
import { CheckBox } from "../components/common/FormControl"
import { QRCode2, Trees } from "../utilities/imgImport"
import { countries } from "../utilities/staticData"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

const content = `Before we start, please prepare your identity document and make sure it is valid.

We also require you to accept our Terms and conditions, and to agree to our processing of your personal data.
`
const doc_types = [
    {
        label: "Passports",
        value: "passport",
    },
    {
        label: "National Identification Cards",
        value: "id_card",
    },
    {
        label: "Driving License",
        value: "driver_license",
    },
]

const VerificationPage = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        agree: false,
        accept: false,
        step: -1,
        country: countries[0],
        doc_type: doc_types[0],
        phoneModal: false,
    })
    const { agree, accept, step, country, doc_type, phoneModal } = state
    const handleAgreeOption = useCallback(
        (e) => {
            setState({ agree: !agree })
        },
        [agree]
    )
    const handleAcceptOption = useCallback(
        (e) => {
            setState({ accept: !accept })
        },
        [accept]
    )
    return (
        <main className="verify-page">
            <Header />
            <section className="container position-relative h-100">
                <h4 className="text-center">Verify your identity</h4>
                {step !== -1 && (
                    <div className="d-flex mt-4">
                        <div className="step-bar">
                            <div className="left-circle bg-green"></div>
                            <div className="step-progress" style={{ width: step * 50 + "%" }}></div>
                            <div className="right-circle bg-white"></div>
                        </div>
                    </div>
                )}
                {step === -1 && (
                    <div className="verify-step0">
                        <p className="pre-wrap">{content}</p>
                        <div className="form-group">
                            <CheckBox
                                name="agree"
                                type="checkbox"
                                value={agree}
                                onChange={handleAgreeOption}
                            >
                                I agree to the processing of my personal data, as described in&nbsp;
                                <Link to="/" className="txt-green">
                                    the Consent to Personal Data Processing.
                                </Link>
                            </CheckBox>
                            <CheckBox
                                name="accept"
                                type="checkbox"
                                value={accept}
                                onChange={handleAcceptOption}
                            >
                                By clicking Next, I accept the&nbsp;
                                <Link to="/" className="txt-green">
                                    Terms and Conditions.
                                </Link>
                            </CheckBox>
                        </div>
                    </div>
                )}
                {step === 0 && (
                    <div className="verify-step1">
                        <h5 className="text-center mb-4">Identity document</h5>
                        <Select
                            options={countries}
                            value={country}
                            onChange={(v) => setState({ country: v })}
                            placeholder="Choose country"
                        />
                        <p className="form-label mt-4">Document type</p>
                        <Select
                            options={doc_types}
                            value={doc_type}
                            onChange={(v) => setState({ doc_type: v })}
                            placeholder="Document type"
                        />
                    </div>
                )}
                <div className="text-center">
                    <button className="btn-link" onClick={() => setState({ phoneModal: true })}>
                        Continue on a phone
                    </button>
                </div>
                <div className="btn-group">
                    {step > 0 && (
                        <button
                            className="btn-primary me-3"
                            onClick={() => setState({ step: step - 1 })}
                        >
                            Back
                        </button>
                    )}
                    <button className="btn-primary" onClick={() => setState({ step: step + 1 })}>
                        Next
                    </button>
                </div>
            </section>
            <Modal
                isOpen={phoneModal}
                onRequestClose={() => setState({ phoneModal: false })}
                ariaHideApp={false}
                className="phone-modal"
                overlayClassName="phone-modal__overlay"
            >
                <p className="phone-modal__header">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-white modal-close"
                        onClick={() => setState({ phoneModal: false })}
                        onKeyDown={() => setState({ phoneModal: false })}
                        role="button"
                        tabIndex="0"
                    />
                </p>
                <h4 className="mt-4">Continue verification on your phone</h4>
                <p className="my-5">Copy a link to your mobile phone</p>
                <button className="btn-green">Copy Link</button>
                <p className="my-5">Or scan the QR code with your phone</p>
                <img src={QRCode2} alt="qr code" />
            </Modal>
            {step !== 0 && <img src={Trees} alt="trees" className="trees-img w-100" />}
        </main>
    )
}

export default VerificationPage
