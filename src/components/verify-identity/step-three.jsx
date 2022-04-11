import Select from "react-select";
import React, { useState } from "react";
import {
    NewDoc,
    Pass,
    Unpass1,
    Unpass2,
    VerifyIdStep3,
} from "../../utilities/imgImport";
import Loading from "../common/Loading";
import { VerificationCountriesList } from "../../utilities/countries-list";
import { VerificationStepThreeDocumentTypes } from "../../utilities/staticData";
import  { ACCEPTED_IMAGE_FORMAT, useVerification } from "./verification-context";

export default function StepThree() {
    // Containers
    const verification = useVerification();
    const [loading, setLoading] = useState(true);
    const [docType, setDocType] = useState(
        VerificationStepThreeDocumentTypes[0]
    );

    // Methods
    const onUserDropFile = (e) => {
        verification.addressProof.handleDragDropEvent(e);
        verification.addressProof.setFiles(e, "w");
    };

    // Render
    verification.shuftReferencePayload?.addrStatus === true &&
        verification.nextStep();

    return (
        <>
            <div className={`${!loading && "d-none"}`}>
                <Loading />
            </div>
            <div
                className={`col-sm-12 col-10 mx-auto mt-3 mt-sm-0 ${
                    loading && "d-none"
                }`}
            >
                <h4 className="text-center  mt-5 mt-sm-2 mb-4">
                    Verify your identity
                </h4>
                <div className="text-center">
                    <div className="d-block d-sm-none">
                        <div className="txt-green text-uppercase fw-bold fs-18px mb-3">
                            step 2
                        </div>
                        <div className="text-light fs-14px">
                            Confirm your address information
                        </div>
                        <div className="text-light fs-12px">
                            Make edits if needed
                        </div>
                    </div>
                    <img
                        className="d-sm-block d-none"
                        src={VerifyIdStep3}
                        onLoad={() => setLoading(false)}
                        alt="step indicator"
                    />
                </div>
                <div className="my-sm-5 verify-step1">
                    <div className="col-12 d-flex flex-sm-row flex-column gap-sm-5 gap-0">
                        <div className="col-md-6 col-12">
                            <p className="form-label mt-4">Document type</p>
                            <Select
                                options={VerificationStepThreeDocumentTypes}
                                value={docType}
                                onChange={(v) => setDocType(v)}
                                placeholder="Document type"
                            />
                            <p className="form-label mt-4">Country issuing</p>
                            <Select
                                options={VerificationCountriesList}
                                value={verification.country}
                                onChange={(v) => verification.setCountry(v)}
                                placeholder="Choose country"
                            />
                            <div className="requirements">
                                <p className="fs-14px">Photo requirements:</p>
                                <div className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <p>Upload entire document clearly</p>
                                </div>
                                <div className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <p>Don`t fold the document</p>
                                </div>
                                <div className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <p>
                                        No image from another image or device
                                    </p>
                                </div>
                                <div className="d-flex align-items-center gap-2 ms-2 item">
                                    <div className="small-white-dot"></div>
                                    <p>No paper-base document</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="my-0 mt-lg-4">
                                <div className="upload-doc">
                                    <div
                                        className="my-5 mb-sm-3 mt-sm-0"
                                        id="file-upload-wrapper"
                                    >
                                        <label
                                            htmlFor="file-upload-input"
                                            className="file-upload cursor-pointer"
                                            onDragEnter={
                                                verification.addressProof
                                                    .handleDragDropEvent
                                            }
                                            onDragOver={
                                                verification.addressProof
                                                    .handleDragDropEvent
                                            }
                                            onDrop={onUserDropFile}
                                        >
                                            <input
                                                type="file"
                                                id="file-upload-input"
                                                className="d-none"
                                                onChange={(e) =>
                                                    {
                                                        const extension = e.target.files[0].type;
                                                        if(!ACCEPTED_IMAGE_FORMAT.includes(extension)) {
                                                            /// warning message 
                                                            return;
                                                        }
                                                        verification.addressProof.setFiles(
                                                            e,
                                                            "w"
                                                        );
                                                    }
                                                }
                                            />
                                            <div className="py-3 px-0">
                                                <div className="new-doc mx-auto">
                                                    <img
                                                        src={NewDoc}
                                                        className="w-50"
                                                        alt="new doc"
                                                    />
                                                </div>
                                                {verification.addressProof
                                                    .files[0] ? (
                                                    <p className="mt-30px">
                                                        {
                                                            verification
                                                                .addressProof
                                                                .files[0].name
                                                        }{" "}
                                                        <span className="txt-green fw-bold">
                                                            selected
                                                        </span>
                                                    </p>
                                                ) : (
                                                    <p className="file-browse">
                                                        Drag & drop files here
                                                        or{" "}
                                                        <span className="fw-bold">
                                                            browse
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="upload-rule__img">
                                <img src={Pass} alt="pass" />
                                <img
                                    className="mx-3"
                                    src={Unpass1}
                                    alt="pass"
                                />
                                <img src={Unpass2} alt="pass" />
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
                            disabled={
                                verification.addressProof.files.length === 0
                            }
                            className="btn btn-success rounded-0 py-2 text-uppercase fw-500 text-light col-sm-3 col-6"
                            onClick={() => verification.nextStep()}
                        >
                            next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
