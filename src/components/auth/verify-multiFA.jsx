import React, { useState, useReducer, useMemo, useEffect } from "react";
import { Link } from "gatsby";
import { Input } from "../common/FormControl";
import { useSignIn2FA } from "../../apollo/model/auth";
import CustomSpinner from "../common/custom-spinner";
import { FaExclamationCircle } from "@react-icons/all-files/fa/FaExclamationCircle";
import Countdown from 'react-countdown';

const EXPIRE_TIME = 60 * 1000;

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
    const [waitingCode, setWaitingCode] = useState(false);

    const [signin2faMutation, signin2faMutationResults] = useSignIn2FA();

    const createdAt = useMemo(() => {
        if(!loading) return Date.now();
    }, [loading]);

    useEffect(() => {
        if(!loading) setWaitingCode(true);
    }, [loading]);

    // Renderer callback with condition
    const countDownRenderer = ({ seconds, completed }) => {
        if (completed) {
            // Render a completed state
            setWaitingCode(false);
            return <span></span>;
        } else {
            // Render a countdown
            return (
                <>
                    {seconds !==0 && <span className="text-success" style={{minWidth: 70}}>({seconds} Sec)</span>}
                </>
            );
        }
    };

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
                                        <button
                                            type="button"
                                            disabled={loading || waitingCode}
                                            className={`signup-link btn mt-0 pe-0 me-1 py-0 text-capitalize cursor-pointer ${
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
                                        {!loading &&
                                        <Countdown
                                            date={createdAt + EXPIRE_TIME}
                                            renderer={countDownRenderer}
                                        />
                                        }
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
