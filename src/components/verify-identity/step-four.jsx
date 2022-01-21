import React from "react"
import { VerifyIdStep4 } from "../../utilities/imgImport"

export default function StepFour({ step, setState }) {
    // Render
    return (
        <>
            <div className="text-center">
                <img src={VerifyIdStep4} alt="step indicator" />
            </div>
            <div className="my-sm-5 verify-step1">
                <div className="mt-5 text-light fs-25px fw-bold text-center">
                    Confirm your address information
                    <div className="fs-16px fw-500">Make edits if needed</div>
                </div>
                <div className="col-8 mx-auto">
                    <div>
                        <p className="form-label mt-4">Address</p>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="17th floor, Street name, city"
                        />
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
                        confirm
                    </button>
                </div>
            </div>
        </>
    )
}
