import Select from "react-select"
import Loading from "../common/Loading"
import React, { useState } from "react"
import useFileUpload from "react-use-file-upload"
import { VerificationCountriesList } from "../../utilities/countries-list"
import { NewDoc, Pass, Unpass1, Unpass2, VerifyIdStep1 } from "../../utilities/imgImport"
import { VerificationDocumentTypes } from "../../utilities/staticData"
import { useMutation } from "@apollo/client"
import { UPLOAD_DOCUMENT } from "./kyc-webservice"

export default function StepOne({ step, setState, country, setCountry }) {
    // Containers
    const [loading, setLoading] = useState(true)
    const { files, handleDragDropEvent, setFiles, removeFile } = useFileUpload()
    const [docType, setDocType] = useState(VerificationDocumentTypes[0])
    const [requestPending, setRequestPending] = useState(false)
    const [error, setError] = useState("")

    // Webservice
    const [uploadDocument] = useMutation(UPLOAD_DOCUMENT, {
        onCompleted: (data) => {
            setRequestPending(false)
            if (data.uploadDocument === true) setState({ step: step + 1 })
            else setError("Unable to upload the file!")
        },
        onError: (err) => {
            if (err) {
                setRequestPending(false)
                setError("Unable to upload the file!")
            }
        },
    })

    // Methods
    const onUserDropFile = (e) => {
        handleDragDropEvent(e)
        setFiles(e, "w")
    }
    const uploadDocumentMethod = (e) => {
        e.preventDefault()
        setRequestPending(true)
        uploadDocument({
            variables: {
                document: files[0],
            },
        })
    }

    // Render
    return (
        <>
            <div className={`${!loading && "d-none"}`}>
                <Loading />
            </div>
            <div className={`col-sm-12 col-10 mx-auto mt-3 mt-sm-0 ${loading && "d-none"}`}>
                <h4 className="text-center  mt-5 mt-sm-2 mb-4">Verify your identity</h4>
                <div className="text-center">
                    <div className="d-block d-sm-none">
                        <div className="txt-green text-uppercase fw-bold fs-18px mb-3">step 1</div>
                        <div className="text-light fs-14px">Identity document</div>
                    </div>
                    <img
                        className="d-sm-block d-none"
                        src={VerifyIdStep1}
                        onLoad={() => setLoading(false)}
                        alt="step indicator"
                    />
                </div>
                <div className="my-sm-5 verify-step1">
                    {error && <div className="text-danger fw-500">{error}</div>}
                    <div className="col-12 d-flex flex-sm-row flex-column gap-sm-5 gap-0">
                        <div className="col-md-6 col-12">
                            <p className="form-label mt-4">Document type</p>
                            <Select
                                options={VerificationDocumentTypes}
                                value={docType}
                                onChange={(v) => setDocType(v)}
                                placeholder="Document type"
                            />
                            <p className="form-label mt-4">Country issuing</p>
                            <Select
                                options={VerificationCountriesList}
                                value={country}
                                onChange={(v) => setCountry(v)}
                                placeholder="Choose country"
                            />
                            <div className="requirements">
                                <p className="fs-14px">Photo requirements:</p>
                                <p className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <div>Upload entire document clearly</div>
                                </p>
                                <p className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <div>Don`t fold the document</div>
                                </p>
                                <p className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <div>No image from another image or device</div>
                                </p>
                                <p className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <div>No paper-base document</div>
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="my-0 mt-lg-4">
                                <div className="upload-doc">
                                    <div className="my-5 mb-sm-3 mt-sm-0" id="file-upload-wrapper">
                                        <label
                                            htmlFor="file-upload-input"
                                            className="file-upload cursor-pointer"
                                            onDragEnter={handleDragDropEvent}
                                            onDragOver={handleDragDropEvent}
                                            onDrop={onUserDropFile}
                                        >
                                            <input
                                                type="file"
                                                id="file-upload-input"
                                                className="d-none"
                                                onChange={(e) => setFiles(e, "w")}
                                            />
                                            <div className="py-3 px-0">
                                                <div className="new-doc mx-auto">
                                                    <img
                                                        src={NewDoc}
                                                        className="w-50"
                                                        alt="new doc"
                                                    />
                                                </div>
                                                {files[0] ? (
                                                    <p className="mt-30px">
                                                        {files[0].name}{" "}
                                                        <span className="txt-green fw-normal">
                                                            selected
                                                        </span>
                                                    </p>
                                                ) : (
                                                    <p className="file-browse">
                                                        Drag & drop files here or{" "}
                                                        <span className="fw-normal">browse</span>
                                                    </p>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="upload-rule__img">
                                <img src={Pass} alt="pass" />
                                <img className="mx-3" src={Unpass1} alt="pass" />
                                <img src={Unpass2} alt="pass" />
                            </div>
                        </div>
                    </div>

                    <div className="my-5 ">
                        <div className="d-flex justify-content-center gap-3 col-md-12">
                            <button
                                className="btn btn-outline-light rounded-0 py-2 text-uppercase fw-500 col-sm-3 col-6"
                                onClick={() => setState({ step: step - 1 })}
                            >
                                back
                            </button>
                            <button
                                disabled={files.length === 0 || requestPending}
                                className="btn btn-success rounded-0 py-2 text-uppercase fw-500 text-light col-sm-3 col-6"
                                onClick={uploadDocumentMethod}
                            >
                                {requestPending ? "uploading. . ." : "next"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
