import React from "react";
import { useState } from "react";
import { VerifyIdStep2 } from "../../utilities/imgImport";
import Loading from "../common/Loading";
import { useVerification } from "./verification-context";

export default function StepTwo() {
    // Containers
    const verification = useVerification();
    const [firstNameError, setFirstNameError] = useState("");
    const [surnameError, setSurnameError] = useState("");
    const [dateError, setDateError] = useState("");
    const [loading, setLoading] = useState(true);
    const onNextButtonClick = (e) => {
        e.preventDefault();
        setFirstNameError("");
        setSurnameError("");
        let error = false;
        if (!verification.firstName) {
            error = true;
            setFirstNameError("Please fill out the first name field");
        }
        if (!verification.surname) {
            error = true;
            setSurnameError("Please fill out the surname field");
        }
        if (!verification.dob) {
            error = true;
            setDateError("Please fill out the date of birth field");
        }
        if (!error) return verification.nextStep();
    };

    // Render
    verification.shuftReferencePayload?.docStatus === true &&
        verification.nextStep();

    return (
        <>
            <div className={`${!loading && "d-none"}`}>
                <Loading />
            </div>
            <div
                className={`col-12 mx-auto mt-3 mt-sm-0 ${loading && "d-none"}`}
            >
                <h4 className="text-center  mt-5 mt-sm-2 mb-4">
                    Verify your identity
                </h4>
                <div className="text-center">
                    <div className="d-block d-sm-none">
                        <div className="txt-green text-uppercase fw-bold fs-18px mb-3">
                            step 1
                        </div>
                        <div className="text-light fs-14px fw-bold">
                            Confirm your ID information
                        </div>
                    </div>
                    <img
                        className="d-sm-block d-none"
                        src={VerifyIdStep2}
                        onLoad={() => setLoading(false)}
                        alt="step indicator"
                    />
                </div>
                <div className="my-sm-5 verify-step1">
                    <div className="mt-5 text-light fs-25px fw-bold text-center d-sm-block d-none">
                        Confirm your ID information
                        <div className="fs-16px fw-500">
                            Make edits if needed
                        </div>
                    </div>
                    <div className="col-sm-8 col-12 mx-auto">
                        <div className="">
                            <p className="form-label mt-4">First name</p>
                            <input
                                type="text"
                                className="form-control"
                                value={verification.firstName}
                                onChange={(e) =>
                                    verification.setFirstName(e.target.value)
                                }
                                placeholder="First name"
                            />
                            <div className="text-danger mt-2 fs-12px">
                                {firstNameError}
                            </div>
                        </div>
                        <div>
                            <p className="form-label mt-4">Last Name</p>
                            <input
                                type="text"
                                className="form-control"
                                value={verification.surname}
                                onChange={(e) =>
                                    verification.setSurname(e.target.value)
                                }
                                placeholder="Surname name"
                            />
                            <div className="text-danger mt-2 fs-12px">
                                {surnameError}
                            </div>
                        </div>
                        <div>
                            <p className="form-label mt-4">Date of Birth</p>
                            <input
                                type="date"
                                className="form-control"
                                value={verification.dob}
                                onChange={(e) =>
                                    verification.setDob(e.target.value)
                                }
                                placeholder="Surname name"
                            />
                            <div className="text-danger mt-2 fs-12px">
                                {dateError}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-3 mt-5 col-md-12">
                        <button
                            className="btn btn-outline-light rounded-0 px-5 py-2 text-uppercase fw-500 col-sm-3 col-6"
                            onClick={() => verification.previousStep()}
                        >
                            back
                        </button>
                        <button
                            className="btn btn-success rounded-0 px-5 py-2 text-uppercase fw-500 text-light col-sm-3 col-6"
                            onClick={onNextButtonClick}
                        >
                            next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
