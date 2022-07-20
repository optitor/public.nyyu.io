import React, { useState, useReducer, useMemo } from "react";
import { Link } from "gatsby";
import { Input } from "../common/FormControl";
import { useSignIn2FA } from "../../apollo/model/auth";
import CustomSpinner from "../common/custom-spinner";
import { FaExclamationCircle } from "@react-icons/all-files/fa/FaExclamationCircle";
import Countdown from 'react-countdown';

const SESSION_EXPIRE_TIME = 60 * 1000;

// Renderer callback with condition
const countDownRenderer = ({ seconds, completed }) => {
    if (completed) {
        // Render a completed state
        return <span className="fs-14px">(2FA code Expired)</span>;
    } else {
        // Render a countdown
        return (
            <>
                {seconds !==0 && <span className="fs-14px">({seconds} Sec)</span>}
            </>
        );
    }
};

const VerifyMutliFA = ({
    twoStep,
    tempToken,
    email,
    returnToSignIn,
    resend,
    loading,
}) => {
    const [code, setCode] = useReducer(
        (old, action) => ({ ...old, ...action }),
        {
            app: "",
            phone: "",
            email: "",
        }
    );
    const [codeError, setCodeError] = useState("");

    const [signin2faMutation, signin2faMutationResults] = useSignIn2FA();

    const createdAt = useMemo(() => {
        if(!loading) return Date.now();
    }, [loading]);

    const confirmCodeClick = (e) => {
        e.preventDefault();
        let error = false;
        setCodeError("");
        if (!code || code.length === 0) {
            setCodeError("Invalid Code.");
            error = true;
        }
        if (!error)
            signin2faMutation(
                email,
                tempToken,
                twoStep.map((step) => {
                    return {
                        key: step,
                        value: code[step],
                    };
                })
            );
    };

    const pending = signin2faMutationResults.loading;
    const webserviceError =
        signin2faMutationResults?.data?.confirm2FA?.status === "Failed";

    return (
        <>
            <h3 className="signup-head mb-5">Authenticate</h3>
            <form className="form">
                {twoStep &&
                    Array.isArray(twoStep) &&
                    twoStep.map(
                        (step) =>
                            step && (
                                <div key={step}>
                                    <p>Confirmation code (<span className="text-capitalize fw-bold">{step}</span>)</p>
                                    <div className="form-group">
                                        <Input
                                            name="code"
                                            type="text"
                                            value={code[step]}
                                            onChange={(e) =>
                                                setCode({
                                                    [step]: e.target.value,
                                                })
                                            }
                                            autoComplete='off'
                                            placeholder="Enter code"
                                        />
                                        {codeError && (
                                            <span className="errorsapn">
                                                <FaExclamationCircle />{" "}
                                                {codeError}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form-group text-white d-flex justify-content-end align-items-center" style={{minHeight: 32}}>
                                        {!loading &&
                                        <Countdown
                                            date={createdAt + SESSION_EXPIRE_TIME}
                                            renderer={countDownRenderer}
                                        />}
                                        <button
                                            type="button"
                                            disabled={loading}
                                            className={`signup-link btn mt-0 pe-0 py-0 text-capitalize cursor-pointer ${
                                                loading
                                                    ? "text-secondary"
                                                    : "text-success text-underline"
                                            }`}
                                            onClick={(e) => resend(e)}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="mt-4px">
                                                    {loading ? (
                                                        <CustomSpinner sm />
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                                <div>Resend</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )
                    )}
                <div className="mt-5 mb-2">
                    {webserviceError && (
                        <span className="errorsapn">
                            <FaExclamationCircle />{" "}
                            {signin2faMutationResults?.data?.confirm2FA?.token}
                        </span>
                    )}
                    <button
                        type="submit"
                        className="btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center py-2"
                        disabled={pending}
                        onClick={confirmCodeClick}
                    >
                        <div
                            className={`${pending ? "opacity-100" : "opacity-0"}`}
                        >
                            <CustomSpinner />
                        </div>
                        <div className={`${pending ? "ms-3" : "pe-4"}`}>
                            confirm code
                        </div>
                    </button>
                </div>
            </form>
            <p className="text-white text-center">
                Return to{" "}
                <Link
                    to="#"
                    className="signup-link"
                    onClick={() => returnToSignIn()}
                >
                    Sign in
                </Link>
            </p>
        </>
    );
};

export default VerifyMutliFA;
