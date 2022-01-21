import React from "react"
import { VerifyIdStep7 } from "../../utilities/imgImport"

export default function StepSeven({ step, setState }) {
    // Render
    return (
        <>
            <div className="text-center">
                <img src={VerifyIdStep7} alt="step indicator" />
            </div>
            <div className="my-sm-5 verify-step1">
                <div className="text-center">
                    <p className="fs-25px fw-bold text-light">
                        Thank you, your verification has been successfully submitted.
                    </p>
                    <p className="fs-14px text-start px-2 mt-3">
                        As soley the data processor, NDB acknowledges your right to request access,
                        erasure, and retention of your data.
                        <br />
                        Contact out Data Compliance Officer at{" "}
                        <span className="text-success">privacy@ndb.technology</span>
                    </p>
                </div>
                <div className="d-flex justify-content-center gap-3 mt-5 col-md-12">
                    <button
                        className="btn btn-success rounded-0 px-3 py-2 text-uppercase fw-500 text-light col-md-3"
                        onClick={() => setState({ step: step + 1 })}
                    >
                        complete
                    </button>
                </div>
            </div>
        </>
    )
}
