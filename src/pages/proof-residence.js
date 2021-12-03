import React, { useReducer, useRef } from "react"
import Header from "../components/common/header"
import useFileUpload from "react-use-file-upload"
import { NewDoc, PhotoIcon, Trees } from "../utilities/imgImport"
import { formatBytes } from "../utilities/number"

const ProofResidence = () => {
    const inputRef = useRef()
    const { files, handleDragDropEvent, setFiles, removeFile } = useFileUpload()
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        step: -1,
    })
    const { step } = state

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
            <section className="d-flex align-items-center">
                <div className="container">
                    <h4 className="text-center mt-2 mb-5 p-lg-5">Proof of residence</h4>
                    <div className="verify-step2">
                        <div className="d-flex flex-wrap justify-content-center pt-lg-5">
                            <div className="upload-doc me-lg-5">
                                <div className="mb-3">
                                    <div
                                        className={`file-upload ${files.length > 0 && "uploaded"}`}
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
                            <div className="upload-rule ms-lg-3">
                                <p>
                                    <strong className="txt-green">We accept</strong> <br />
                                    Bank statements, utility bills, internet/cable TV/house phone
                                    line bills, tax returns, council tax bills, government-issued
                                    certifications of residence, etc.
                                </p>
                                <p className="mt-3">
                                    <strong className="txt-light-red">We don’t accept</strong>
                                    <br />
                                    Screenshots, mobile phone bills, medical bills, receipts for
                                    purchases, insurance statements.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button
                            className="btn-primary me-3"
                            onClick={() => setState({ step: step + 1 })}
                        >
                            Skip
                        </button>
                        <button
                            className="btn-primary btn-upload"
                            onClick={() => inputRef.current.click()}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </section>

            {step !== -1 && <img src={Trees} alt="trees" className="trees-img w-100" />}
        </main>
    )
}

export default ProofResidence
