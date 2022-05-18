import React from "react";
import { useState } from "react";
import Modal from "react-modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomSpinner from "../common/custom-spinner";
import { FormInput } from "../common/FormControl";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Icon } from '@iconify/react';
import { getCountryCallingCode } from 'react-phone-number-input/input';
import Select from "react-select"

import { CloseIcon } from "../../utilities/imgImport";
import { countryList } from '../../utilities/countryAlpha2';
import { useMutation } from "@apollo/client";
import * as Mutation from '../../apollo/graphqls/mutations/Support';
import { showSuccessAlarm } from "../admin/AlarmModal";

const Countries = countryList.map((item) => {
    return { label: item.name, value: item["alpha-2"] }
});

const selectStyles = {
    option: (provided, state) => ({
        ...provided,
        borderBottom: 'none',
        color: 
            state.isSelected ? 'white' : 
            state.isFocused ? 'black' : 'black',
        backgroundColor: 
            state.isSelected ? 'black' : 
            state.isFocused ? 'gray' : 'white',
        padding: 5
    }),
    singleValue: (provided, state) => {
        return { ...provided };
    }
}

export default function ResetPhoneModal({ isOpen, setIsOpen }) {
    
    // some state vars
    const [ country, setCountry ] = useState(null);
    const [countryCode, setCountryCode] = useState("");
    const [sentCode, setSentCode] = useState("");
    const [mobile, setMobile] = useState("");
    const [error, setError] = useState(null);   
    const [ pending, setPending ] = useState(false);
    const [sent, setSent] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const [requesetPhone2FA] = useMutation(
        Mutation.REQUEST_PHONE_2FA, {
            onCompleted: data => {
                console.log(data);
                if(data.requestPhone2FA === "queued") {
                    setSent(true);
                }
            },
            onError: err => {
                setSent(false);
                setError(err.message);
            }
        }
    )

    const [confirmPhone2FA] = useMutation(
        Mutation.CONFORM_PHONE_2FA, {
            onCompleted: data => {
                if(data.confirmPhone2FA === 'Success') {
                    showSuccessAlarm('New phone number is verified.');
                    setIsOpen(false);
                } else {
                    setError('Invalid two-step verification code');    
                }
                setLoading(false);
            },
            onError: err => {
                setLoading(false);
                setError(err.message);
            }
        }
    )

    const handleSubmit = () => {
        setLoading(true);
        confirmPhone2FA({
            variables: {
                code: sentCode.trim()
            }
        })
    }

    const getCode = () => {
        if(pending) return;    
        setSent(false);
        setError(null);
        setPending(true);
        setTimeout(() => {
            setPending(false);
        }, 6000);
        requesetPhone2FA({
            variables: {
                phone: mobile
            }
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="support-modal border-0"
            overlayClassName="support-modal__overlay"
        >
            <div className="support-modal__header justify-content-end">
                <div
                    onClick={() => setIsOpen(false)}
                    onKeyDown={() => setIsOpen(false)}
                    role="button"
                    tabIndex="0"
                >
                    <img
                        width="14px"
                        height="14px"
                        src={CloseIcon}
                        alt="close"
                    />
                </div>
            </div>
            <div className="my-5">
                <div className="text-center">
                    <p className="text-capitalize fs-30px fw-bold lh-36px">
                        reset phone verification
                    </p>
                    <p className="fs-16px mt-2 text-light fw-normald">
                        To secure your account, please complete the following
                        verification
                    </p>
                </div>

                <div className="col-12 col-sm-10 col-md-8 col-lg-7 mx-auto text-light my-5">
                    <form action="form">
                    <div className="input_mobile form-group">
                        <div className="mobile-input-field mt-3">
                            <label className="mb-2">select country</label>
                            <div className="country-code-select">
                                <Icon icon="akar-icons:search" className="search-icon text-light" />
                                <Select
                                    className="mb-2"
                                    styles={selectStyles}
                                    options={Countries}
                                    value={country}
                                    onChange={(selected) => {
                                        const code = `+${getCountryCallingCode(selected?.value)} `
                                        setCountry(selected)
                                        setCountryCode(code)
                                        setMobile(code)
                                    }}
                                    placeholder='Country'
                                />
                            </div>
                            <FormInput
                                type="text"
                                label="New phone number"
                                value={mobile}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    setMobile(countryCode + input.substr(countryCode.length))
                                }}
                                placeholder='Phone number'
                            />
                        </div>
                        
                    </div>
                        <div className="form-group">
                            <FormInput
                                type="text"
                                label="new phone number verification"
                                value={sentCode}
                                onChange={(e) => setSentCode(e.target.value)}
                                placeholder="Enter code"
                            />
                        </div>
                        <div className="fs-12px get-code">
                                {sent && <span>
                                    The code has been sent&nbsp;&nbsp;    
                                </span>}
                                <span 
                                    className={"fw-500 cursor-pointer " + (pending ? "txt-grey" : "txt-green") }
                                    onClick={getCode}
                                >
                                    Get Code
                                </span>
                            </div>
                        <div className="my-5">
                            {error && (
                                <span className="errorsapn">
                                    <FontAwesomeIcon
                                        icon={faExclamationCircle}
                                    />{" "}
                                    {error}
                                </span>
                            )}
                            <button
                                type="submit"
                                className="btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center py-2"
                                disabled={pending || error !== null || loading || (sentCode.length < 6)}
                                onClick={handleSubmit}
                            >
                                <div
                                    className={`${
                                        loading ? "opacity-1" : "opacity-0"
                                    }`}
                                >
                                    <CustomSpinner />
                                </div>
                                <div
                                    className={`fs-20px ${
                                        loading ? "ms-3" : "pe-4"
                                    }`}
                                >
                                    verify
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

