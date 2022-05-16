import React, { useState } from "react"
import useDeepCompareEffect from "use-deep-compare-effect"
import Loading from "../common/Loading"
import { ACCEPTED_IMAGE_FORMAT, useVerification } from "./verification-context"
import { NewDoc, VerifyIdStep5, ConsentPass, ConsentUnpass1, ConsentUnPass2 } from "../../utilities/imgImport"
import AlarmModal, { showFailAlarm } from "../admin/AlarmModal"

export default function StepOne() {
    // Containers
    const verification = useVerification()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Methods
    const handleFileUpload = (e) => {
        verification.consentProof.handleDragDropEvent(e);
        verification.consentProof.setFiles(e, "w");
    };

    useDeepCompareEffect(() => {
        const file = verification.consentProof.files[0]
        const extension = file?.type;
        if(!file) {
            return;
        } else if(!ACCEPTED_IMAGE_FORMAT.includes(extension)) {
            setError('Not_supported');
            showFailAlarm('Wrong file format', 'You can only upload PNG, JPG, JPEG or PDF');
        } else {
            setError('');
        }
    }, [verification.consentProof.files]);

    // Render
    verification.shuftReferencePayload?.conStatus === true && verification.nextStep()
    return (
        <>
            <div className={`${!loading && "d-none"}`}>
                <Loading />
            </div>
            <div className={`col-sm-12 col-10 mx-auto mt-3 mt-sm-0 ${loading && "d-none"}`}>
                <h4 className="text-center  mt-5 mt-sm-2 mb-4">Verify your identity</h4>
                <div className="text-center">
                    <div className="d-block d-sm-none">
                        <div className="txt-green text-uppercase fw-bold fs-18px mb-3">step 3</div>
                        <div className="text-light fs-14px fw-bold">Consent verification</div>
                    </div>
                    <img
                        className="d-sm-block d-none"
                        src={VerifyIdStep5}
                        onLoad={() => setLoading(false)}
                        alt="step indicator"
                    />
                </div>
                <div className="my-sm-5 verify-step1">
                    <div className="col-12 d-flex flex-sm-row flex-column gap-sm-5 gap-0">
                        <div className="col-md-6 col-12 mt-5 mt-sm-0">
                            <p>
                            Write the following text on a blank paper, <br />
                            upload its photo along with your face.
                            </p>
                            <p className="my-3 fw-bold">{verification.consentText}</p>
                            <div className="requirements mt-0">
                                <p className="fs-14px">Photo requirements:</p>
                                <div className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <p>Hold the written consent next to your face</p>
                                </div>
                                <div className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <p>Upload the entire document clearly</p>
                                </div>
                                <div className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <p>No image from another image or device</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="my-0">
                                <div className="upload-doc">
                                    <div className="my-5 mb-sm-3 mt-sm-0" id="file-upload-wrapper">
                                        <label
                                            htmlFor="file-upload-input"
                                            className="file-upload cursor-pointer"
                                            onDragEnter={
                                                verification.consentProof.handleDragDropEvent
                                            }
                                            onDragOver={
                                                verification.consentProof.handleDragDropEvent
                                            }
                                            onDrop={handleFileUpload}
                                        >
                                            <input
                                                type="file"
                                                id="file-upload-input"
                                                className="d-none"
                                                accept=".png, .jpg, .jpeg, .pdf"
                                                onChange={handleFileUpload}
                                            />
                                            <div className="py-3 px-0">
                                                <div className="new-doc mx-auto">
                                                    <img
                                                        src={NewDoc}
                                                        className="w-50"
                                                        alt="new doc"
                                                    />
                                                </div>
                                                {verification.consentProof.files[0] ? (
                                                    <>
                                                        <p className="mt-30px text-center">
                                                            {
                                                                verification
                                                                    .consentProof
                                                                    .files[0].name
                                                            }{" "}
                                                            <span className="txt-green fw-normal">
                                                                selected
                                                            </span>
                                                        </p>
                                                        {error === 'Not_supported' && 
                                                        <p className="text-center">
                                                            <small style={{color: 'red'}}>PDF, PNG, or JPG file formats only</small>
                                                        </p>}
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="file-browse">
                                                            Drag & drop files here
                                                            or{" "}
                                                            <span className="fw-normal">
                                                                browse
                                                            </span>
                                                        </p>
                                                        <p className="text-center">
                                                            <small>PDF, PNG, or JPG file formats only</small>
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="upload-rule__img">
                                <img src={ConsentPass} alt="pass" />
                                <img className="mx-3" src={ConsentUnpass1} alt="pass" />
                                <img src={ConsentUnPass2} alt="pass" />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-3 my-5 col-md-12">
                        <button
                            className="btn btn-outline-light rounded-0 py-2 text-uppercase fw-500 col-sm-3 col-6"
                            onClick={() => verification.previousStep()}
                        >
                            back
                        </button>
                        <button
                            disabled={verification.consentProof.files.length === 0}
                            className="btn btn-success rounded-0 py-2 text-uppercase fw-500 text-light col-sm-3 col-6"
                            onClick={() => verification.nextStep()}
                        >
                            next
                        </button>
                    </div>
                </div>
            </div>
            <AlarmModal />
        </>
    )
}
