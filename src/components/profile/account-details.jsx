import { Link } from "gatsby";
import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { ROUTES } from "../../utilities/routes";
import ChangeEmailModal from "./ChangeEmailModal";
import ChangeNameModal from "./ChangeNameModal";
import SelectCurrencyModal from "./SelectCurrencyModal";
import { EuropeanFlag } from '../../utilities/imgImport';

export default function AccountDetails({
    setIsPasswordModalOpen,
    user,
    displayName,
    shuftiStatus,
}) {
    // Containers
    const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState(false);
    const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

    const savedCurrency = useSelector(state => state.favAssets.currency); 

    // Render
    return (
        <>
            {isChangeEmailModalOpen && (
                <ChangeEmailModal
                    isOpen={isChangeEmailModalOpen}
                    setIsOpen={setIsChangeEmailModalOpen}
                />
            )}
            {isChangeNameModalOpen && (
                <ChangeNameModal
                    isOpen={isChangeNameModalOpen}
                    setIsOpen={setIsChangeNameModalOpen}
                />
            )}
            {isCurrencyModalOpen && (
                <SelectCurrencyModal
                    isOpen={isCurrencyModalOpen}
                    setIsOpen={setIsCurrencyModalOpen}
                />
            )}
            <div className="account-details">
                <div className="row w-100 mx-auto">
                    <div className="detail_item col-sm-4 col-md-6  br">
                        display name
                    </div>
                    <div className="detail_item col-sm-8 col-md-6 text-end text-sm-start">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>{displayName}</div>
                            <button
                                onClick={() => setIsChangeNameModalOpen(true)}
                                className="btn fs-10px text-success text-underline ms-1"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row w-100 mx-auto">
                    <div className="detail_item col-sm-4 col-md-6 br">email</div>
                    <div className="detail_item col-sm-8 col-md-6 text-end text-sm-start text-lowercase">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>{user && user?.email}</div>
                            <button
                                onClick={() => setIsChangeEmailModalOpen(true)}
                                className="btn fs-10px text-success text-underline text-capitalize ms-1"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row w-100 mx-auto change-password">
                    <div className="detail_item col-sm-4 col-md-6 br">password</div>
                    <div className="detail_item col-sm-8 col-md-6 d-flex align-items-center justify-content-end">
                        <button
                            className="btn-primary change-pwd"
                            onClick={() => setIsPasswordModalOpen(true)}
                        >
                            Change Password
                        </button>
                    </div>
                </div>
                <div className="row w-100 mx-auto">
                    <div className="detail_item col-sm-4 col-md-6 br">
                        Identity verification
                    </div>
                    <div className="detail_item col-sm-8 col-md-6 text-end text-sm-start text-lowercase">
                        {shuftiStatus === "UNSET" ? (
                            <div className="d-flex align-items-center gap-2">
                                <div className="circle circle-dark" />
                                <Link
                                    to={ROUTES.verifyId}
                                    className="text-light-blue fs-15px fw-bold text-underline text-capitalize"
                                >
                                    Setup
                                </Link>
                            </div>
                        ) : shuftiStatus?.event === "verification.accepted" ? (
                            <div className="d-flex align-items-center gap-2">
                                <div className="circle circle-success" />
                                <div className="txt-green fs-15px fw-bold text-capitalize">
                                    verified
                                </div>
                            </div>
                        ) : shuftiStatus?.event === "request.invalid" || shuftiStatus?.event === "verification.declined" ? (
                            <div className="d-flex align-items-center gap-2">
                                <div className="circle circle-danger" />
                                <Link
                                    to={ROUTES.verifyId}
                                    className="text-light fs-15px fw-500 text-capitalize"
                                >
                                    Failed,{" "}
                                    <span className="text-underline">
                                        Retry
                                    </span>
                                </Link>
                            </div>
                        ) : shuftiStatus?.event === "review.pending" ||
                          shuftiStatus === "PENDING" ? (
                            <div className="d-flex align-items-center gap-2">
                                <div className="circle circle-warning" />
                                <div className="text-light fs-15px fw-500 text-capitalize">
                                    under review
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
                                <div className="circle circle-dark" />
                                <Link
                                    to={ROUTES.verifyId}
                                    className="text-light-blue fs-15px fw-bold text-underline text-capitalize"
                                >
                                    Setup
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                <div className="row w-100 mx-auto">
                    <div className="detail_item col-sm-4 col-md-6 br">Currency</div>
                    <div className="detail_item col-sm-8 col-md-6">
                        <div className="d-flex align-items-center justify-content-between" style={{height: 30}}>
                            <div className="d-flex align-items-center">
                                <div className='flag_div' style={{width: 14, height: 14}}>
                                    <img
                                        src={savedCurrency.value !=='EUR'? `${process.env.GATSBY_CurrencyIconEndpoint}/${String(savedCurrency.value).toLowerCase()}.png`: EuropeanFlag}
                                        alt={savedCurrency.value}
                                    />
                                </div>
                                <p className="ms-2">{savedCurrency.label}</p>
                            </div>
                            <button
                                onClick={() => setIsCurrencyModalOpen(true)}
                                className="btn fs-10px text-success text-underline text-capitalize ms-1"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
