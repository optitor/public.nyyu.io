import React from "react"
import { NewDoc, Pass, Unpass1, Unpass2, VerifyIdStep5 } from "../../utilities/imgImport"

export default function StepOne({ step, setState }) {
    // Render
    return (
        <>
            <div className="text-center">
                <img src={VerifyIdStep5} alt="step indicator" />
            </div>
            <div className="my-sm-5 verify-step1">
                <div className="col-12 d-flex gap-5">
                    <div className="col-md-6">
                        <p>
                            Write the following text on a blank paper, <br />
                            upload its photo along with your face.
                        </p>
                        <p className="my-3 fw-bold text-uppercase">i & ndb</p>
                        <div className="requirements">
                            <p className="fs-14px">Photo requirements:</p>
                            <p className="d-flex align-items-center gap-2 ms-2 item">
                                <div className="small-white-dot"></div>
                                <div>Upload entire document clearly</div>
                            </p>
                            <p className="d-flex align-items-center gap-2 ms-2 item">
                                <div className="small-white-dot"></div>
                                <div>Don’t fold the document</div>
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
                    <div className="col-md-6">
                        <div className="d-flex flex-wrap justify-content-center my-0">
                            <div className="upload-doc">
                                <div className="mb-3">
                                    <div className="file-upload py-3 px-5">
                                        <div className="new-doc">
                                            <img src={NewDoc} className="w-50" alt="new doc" />
                                        </div>
                                        <p className="file-browse">
                                            Drag & drop files here or{" "}
                                            <span className="fw-bold">browse</span>
                                        </p>

                                        <input type="file" multiple style={{ display: "none" }} />
                                    </div>
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

                <div className="d-flex justify-content-center gap-3 mt-5 col-md-12">
                    <button
                        className="btn btn-outline-light rounded-0 px-5 py-2 text-uppercase fw-500 col-md-3"
                        onClick={() => setState({ step: step - 1 })}
                    >
                        back
                    </button>
                    <button
                        className="btn btn-success rounded-0 px-5 py-2 text-uppercase fw-500 text-light col-md-3"
                        onClick={() => setState({ step: step + 1 })}
                    >
                        next
                    </button>
                </div>
            </div>
        </>
    )
}
