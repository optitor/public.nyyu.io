import { Link } from "gatsby"
import React, { useReducer, useCallback, useRef } from "react"
import Header from "../components/common/header"
import Select from "react-select"
import useFileUpload from "react-use-file-upload"
import { CheckBox } from "../components/common/FormControl"
import { NewDoc, Pass, PhotoIcon, QRCode2, Trees, Unpass1, Unpass2 } from "../utilities/imgImport"
import { countries } from "../utilities/staticData"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { formatBytes } from "../utilities/number"

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
    const inputRef = useRef()
    const { files, handleDragDropEvent, setFiles, removeFile } = useFileUpload()
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
    const FileList = ({ data }) => {
        return (
            <li className="file-item">
                <div className="file-item__info">
                    <div>
                        <img className="mb-2" src={PhotoIcon} alt="file img" />
                        <div>
                            <p className="file-name">{data.name}</p>
                            <p className="file-size">{formatBytes(data.size)}</p>
                        </div>
                    </div>
                    <p
                        className="remove-file"
                        onClick={() => removeFile(data.name)}
                        onKeyDown={() => removeFile(data.name)}
                        role="presentation"
                    >
                        <span></span>
                    </p>
                </div>
                <p className="file-item__name">{data.name}</p>
            </li>
        )
    }

    return (
        <main className="verify-page">
            <Header />
            <section className="d-flex align-items-center h-100">
                <div className="container">
                    <h4 className="text-center mt-2 mb-4">Verify your identity</h4>
                    {step !== -1 && (
                        <div className="d-flex mt-4">
                            <div className="step-bar">
                                <div className="left-circle bg-green"></div>
                                <div
                                    className="step-progress"
                                    style={{ width: step * 50 + "%" }}
                                ></div>
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
                                    I agree to the processing of my personal data, as described
                                    in&nbsp;
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
                    {step === 1 && (
                        <div className="verify-step2">
                            <h5 className="text-center">Identity document</h5>
                            <div className="d-flex flex-wrap justify-content-around">
                                <div className="upload-doc">
                                    <div className="mb-3">
                                        <div
                                            className={`file-upload ${
                                                files.length > 0 && "uploaded"
                                            }`}
                                            onDragEnter={handleDragDropEvent}
                                            onDragOver={handleDragDropEvent}
                                            onDrop={(e) => {
                                                handleDragDropEvent(e)
                                                setFiles(e, "a")
                                            }}
                                            role="presentation"
                                        >
                                            <div className="new-doc">
                                                <img src={NewDoc} alt="new doc" />
                                            </div>
                                            <p className="file-browse">
                                                Drag & drop files here or{" "}
                                                <span
                                                    onClick={() => inputRef.current.click()}
                                                    onKeyDown={() => inputRef.current.click()}
                                                    role="presentation"
                                                >
                                                    browse
                                                </span>
                                            </p>

                                            <input
                                                ref={inputRef}
                                                type="file"
                                                multiple
                                                style={{ display: "none" }}
                                                onChange={(e) => setFiles(e, "a")}
                                            />
                                        </div>
                                    </div>
                                    <ul className="file-list">
                                        {files?.map((item, idx) => (
                                            <FileList key={idx} data={item} />
                                        ))}
                                    </ul>
                                </div>
                                <div className="uploaded-list">
                                    <p className="uploaded-list__text">You uploaded:</p>
                                    <ul className="file-list">
                                        {files?.map((item, idx) => (
                                            <FileList key={idx} data={item} />
                                        ))}
                                    </ul>
                                    {files.length > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={() => inputRef.current.click()}
                                        >
                                            <span></span>Add more files
                                        </button>
                                    )}
                                </div>
                                <div className="upload-rule">
                                    <p>Take a photo of your document. </p>
                                    <p>The photo should be:</p>
                                    <ul>
                                        <li>
                                            <strong>bright and clear</strong> (good quality);
                                        </li>
                                        <li>
                                            <strong>uncut</strong> (all corners of the document
                                            should be visible).
                                        </li>
                                    </ul>
                                    <div className="upload-rule__img mt-3">
                                        <img src={Pass} alt="pass" />
                                        <img className="mx-3" src={Unpass1} alt="pass" />
                                        <img src={Unpass2} alt="pass" />
                                    </div>
                                </div>
                            </div>
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
                        <button
                            className="btn-primary btn-next"
                            onClick={() => setState({ step: step + 1 })}
                        >
                            Next
                        </button>
                        {/* <button
                            className="btn-green btn-upload"
                            onClick={() => setState({ step: step + 1 })}
                        >
                            Upload
                        </button> */}
                    </div>
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
            {step !== -1 && <img src={Trees} alt="trees" className="trees-img w-100" />}
        </main>
    )
}

export default VerificationPage
