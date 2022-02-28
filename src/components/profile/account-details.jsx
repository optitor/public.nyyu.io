import {Link} from "gatsby"
import React from "react"
import {ROUTES} from "../../utilities/routes"

export default function AccountDetails({

    setIsPasswordModalOpen,
    user,
    displayName,
    shuftReference,
    shuftiStatus,
}) {
    return (
        <div className="account-details">
            <div className="row w-100 mx-auto">
                <div className="col-6 col-sm-4 col-md-6 br">Display name</div>
                <div className="col-6 col-sm-8 col-md-6 text-end text-sm-start">{displayName}</div>
            </div>
            <div className="row w-100 mx-auto">
                <div className="col-6 col-sm-4 col-md-6 br">email</div>
                <div className="col-6 col-sm-8 col-md-6 text-end text-sm-start text-lowercase">
                    {user && user?.email}
                </div>
            </div>
            <div className="row w-100 mx-auto change-password">
                <div className="col-6 col-sm-4 col-md-6 br">Password</div>
                <div className="col-6 col-sm-8 col-md-6 justify-content-sm-between justify-content-end">
                    <p>********</p>
                    <button
                        className="btn-primary change-pwd"
                        onClick={() => setIsPasswordModalOpen(true)}
                    >
                        Change Password
                    </button>
                </div>
                <div className="col-12 justify-content-center">
                    <button
                        className="btn-primary change-pwd"
                        onClick={() => setIsPasswordModalOpen(true)}
                    >
                        Change Password
                    </button>
                </div>
            </div>
            <div className="row w-100 mx-auto">
                <div className="col-6 col-sm-4 col-md-6 br">kyc/aml verification</div>
                <div className="col-6 col-sm-8 col-md-6 text-end text-sm-start text-lowercase">
                    {shuftiStatus === "UNSET" ? (
                        <div className="d-flex align-items-center gap-2">
                            <div className="circle circle-dark"></div>
                            <Link
                                to={ROUTES.verifyId}
                                className="text-success fs-15px fw-bold text-underline text-capitalize"
                            >
                                Setup
                            </Link>
                        </div>
                    ) : shuftiStatus?.event === "verification.accepted" ? (
                        <div className="d-flex align-items-center gap-2">
                            <div className="circle circle-success"></div>
                            <div className="txt-green fs-15px fw-bold text-capitalize">
                                verified
                            </div>
                        </div>
                    ) : shuftiStatus?.event === "verification.declined" ? (
                        <div className="d-flex align-items-center gap-2">
                            <div className="circle circle-danger"></div>
                            <Link
                                to={ROUTES.verifyId}
                                className="text-light fs-15px fw-500 text-capitalize"
                            >
                                Failed, <span className="text-underline">Retry</span>
                            </Link>
                        </div>
                    ) : shuftiStatus?.event === "request.invalid" ||
                      shuftiStatus?.event === "review.pending" ||
                      shuftiStatus === "PENDING" ? (
                        <div className="d-flex align-items-center gap-2">
                            <div className="circle circle-warning"></div>
                            <div className="text-light fs-15px fw-500 text-capitalize">
                                under review
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex align-items-center gap-2">
                            <div className="circle circle-dark"></div>
                            <Link
                                to={ROUTES.verifyId}
                                className="text-success fs-15px fw-bold text-underline text-capitalize"
                            >
                                Setup
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
