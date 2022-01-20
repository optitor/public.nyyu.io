import React, { useReducer, useCallback, useRef } from "react"
import useFileUpload from "react-use-file-upload"
import Modal from "react-modal"
import Webcam from "react-webcam"
import { formatBytes } from "../../utilities/number"
import {
    NewDoc,
    Pass,
    PhotoIcon,
    QRCode,
    SelfieImg,
    Unpass1,
    Unpass2,
    CloseIcon,
} from "../../utilities/imgImport"
import SimpleHeader from "../header/simple-header"
import PrimaryStep from "../verify-identity/primary-step"
import StepOne from "../verify-identity/step-one"

const VerificationPage = () => {
    const inputRef = useRef()
    const webcamRef = useRef(null)

    const { files, handleDragDropEvent, setFiles, removeFile } = useFileUpload()
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        agree: false,
        accept: false,
        step: 0, // --> initial value: -1;
        phoneModal: false,
        file: null,
        fileOpen: false,
        selfieModal: false,
        selfieImg: "",
    })
    const { step, phoneModal, file, fileOpen, selfieModal, selfieImg } = state

    const capture = useCallback(() => {
        setState({ selfieImg: webcamRef.current.getScreenshot() })
    }, [webcamRef])

    console.log(selfieImg)

    const FileList = ({ data }) => {
        return (
            <li className="file-item">
                <div className="file-item__info">
                    <div
                        onClick={() => {
                            setState({ fileOpen: true })
                            setState({ file: data })
                        }}
                        onKeyDown={() => setState({ fileOpen: true })}
                        role="presentation"
                    >
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
            <SimpleHeader />
            <section className="d-flex justify-content-center align-items-start align-items-xl-center">
                <div>
                    {step < 3 && <h4 className="text-center mt-2 mb-4">Verify your identity</h4>}
                    {/* {step !== -1 && step < 3 && (
                        <div className="d-flex mt-4">
                            <div className="step-bar">
                                <div className="left-circle bg-green"></div>
                                <div
                                    className="step-progress"
                                    style={{ width: step * 50 + "%" }}
                                ></div>
                                <div
                                    className={`right-circle ${
                                        step === 2 ? "bg-green" : "bg-white"
                                    }`}
                                ></div>
                            </div>
                        </div>
                    )} */}
                    {step === -1 && <PrimaryStep step={step} setState={setState} />}
                    {step === 0 && <StepOne step={step} setState={setState} />}
                    {step === 1 && (
                        <div className="verify-step2">
                            <h5 className="text-center">Identity document</h5>
                            <div className="d-flex flex-wrap justify-content-center my-0 my-xxl-5">
                                <div className="upload-doc me-lg-5">
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
                                {files.length > 0 && (
                                    <div className="uploaded-list">
                                        <p className="uploaded-list__text">You uploaded:</p>
                                        <ul className="file-list">
                                            {files?.map((item, idx) => (
                                                <FileList key={idx} data={item} />
                                            ))}
                                        </ul>

                                        <button
                                            className="btn-add"
                                            onClick={() => inputRef.current.click()}
                                        >
                                            <span></span>Add more files
                                        </button>
                                    </div>
                                )}
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
                                    <div className="upload-rule__img">
                                        <img src={Pass} alt="pass" />
                                        <img className="mx-3" src={Unpass1} alt="pass" />
                                        <img src={Unpass2} alt="pass" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="verify-step3">
                            <h6 className="verify-step3__heading">Selfie</h6>
                            <p className="verify-step3__text">
                                Face the camera.
                                <br /> Make sure your face is visible and fits in the frame.
                                <br /> Then, slowly turn your head around in a circle.
                            </p>
                            <img className="selfie-img" src={SelfieImg} alt="seflie" />
                        </div>
                    )}
                    {step === 3 && (
                        <div className="verify-step4">
                            <div className="selfie-modal__body">
                                <div className="selfie-content">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </div>
                                <div className="btn-group">
                                    <button
                                        className="btn-primary me-3"
                                        onClick={() => setState({ selfieImg: "" })}
                                    >
                                        Retake
                                    </button>
                                    <button className="btn-primary btn-green" onClick={capture}>
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {step < 3 && (
                        <div className="btn-group">
                            {step > 0 && (
                                <button
                                    className="btn-primary me-3"
                                    onClick={() => setState({ step: step - 1 })}
                                >
                                    Back
                                </button>
                            )}
                            {step === 1 ? (
                                files.length === 0 ? (
                                    <>
                                        <button
                                            className="btn-green btn-upload"
                                            onClick={() => inputRef.current.click()}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            className="btn-primary btn-next"
                                            onClick={() => setState({ step: step + 1 })}
                                        >
                                            Next
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn-green"
                                            onClick={() => setState({ step: step + 1 })}
                                        >
                                            Next
                                        </button>
                                        <button
                                            className="btn-primary btn-next"
                                            onClick={() => setState({ step: step + 1 })}
                                        >
                                            Next
                                        </button>
                                    </>
                                )
                            ) : step === 2 ? (
                                <>
                                    <button
                                        className="btn-ready"
                                        onClick={() => setState({ selfieModal: true })}
                                    >
                                        I'm Ready
                                    </button>
                                    <button
                                        className="btn-primary btn-take"
                                        onClick={() => setState({ step: step + 1 })}
                                    >
                                        Take photo
                                    </button>
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    )}
                </div>
            </section>
            <Modal
                isOpen={phoneModal}
                onRequestClose={() => setState({ phoneModal: false })}
                ariaHideApp={false}
                className="phone-modal"
                overlayClassName="phone-modal__overlay"
            >
                <div className="phone-modal__header">
                    <div
                        onClick={() => setState({ phoneModal: false })}
                        onKeyDown={() => setState({ phoneModal: false })}
                        role="button"
                        tabIndex="0"
                    >
                        <img width="14px" height="14px" src={CloseIcon} alt="close" />
                    </div>
                </div>
                <h4 className="mt-4">Continue verification on your phone</h4>
                <p className="my-5">Copy a link to your mobile phone</p>
                <button className="btn-green">Copy Link</button>
                <p className="my-5">Or scan the QR code with your phone</p>
                <img src={QRCode} alt="qr code" />
            </Modal>
            <Modal
                isOpen={fileOpen}
                onRequestClose={() => setState({ fileOpen: false })}
                ariaHideApp={false}
                className="file-modal"
                overlayClassName="file-modal__overlay"
            >
                <div className="phone-modal__header">
                    <div
                        onClick={() => setState({ fileOpen: false })}
                        onKeyDown={() => setState({ fileOpen: false })}
                        role="button"
                        tabIndex="0"
                    >
                        <img width="14px" height="14px" src={CloseIcon} alt="close" />
                    </div>
                </div>
                {file && (
                    <div className="file-modal__body">
                        <img src={URL.createObjectURL(file)} alt="file" />
                        <p>{file.name}</p>
                    </div>
                )}
                <button
                    className="btn-primary"
                    onClick={() => {
                        removeFile(file.name)
                        setState({ fileOpen: false })
                    }}
                    onKeyDown={() => {
                        removeFile(file.name)
                        setState({ fileOpen: false })
                    }}
                >
                    Delete
                </button>
            </Modal>
            <Modal
                isOpen={selfieModal}
                onRequestClose={() => setState({ selfieModal: false })}
                ariaHideApp={false}
                className="selfie-modal"
                overlayClassName="phone-modal__overlay"
            >
                <div className="phone-modal__header">
                    <div
                        onClick={() => setState({ selfieModal: false })}
                        onKeyDown={() => setState({ selfieModal: false })}
                        role="button"
                        tabIndex="0"
                    >
                        <img width="14px" height="14px" src={CloseIcon} alt="close" />
                    </div>
                </div>
                <div className="selfie-modal__body">
                    <div className="selfie-content">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </div>
                    <div className="btn-group">
                        <button
                            className="btn-primary me-3"
                            onClick={() => setState({ selfieImg: "" })}
                        >
                            Retake
                        </button>
                        <button className="btn-primary btn-green" onClick={capture}>
                            Upload
                        </button>
                    </div>
                </div>
            </Modal>
        </main>
    )
}

export default VerificationPage
