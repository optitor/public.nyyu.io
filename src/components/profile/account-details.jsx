import { Link } from "gatsby"
import React from "react"
import { ROUTES } from "../../utilities/routes"

export default function AccountDetails({ setIsPasswordModalOpen, user, displayName }) {
    return (
        <div className="account-detail">
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
            </div>
            <div className="row w-100 mx-auto">
                <div className="col-6 col-sm-4 col-md-6 br">kyc/aml verification</div>
                <div className="col-6 col-sm-8 col-md-6 text-end text-sm-start text-lowercase">
                    {user.verify.kycVerified === true ? (
                        <div className="txt-green fs-13px fw-500">Verified</div>
                    ) : (
                        <Link
                            to={ROUTES.verifyId}
                            className="txt-green fs-13px fw-500 text-decoration-underline"
                        >
                            setup
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
