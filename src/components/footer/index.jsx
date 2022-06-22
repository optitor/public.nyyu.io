import React from "react"
import { footerLinks } from "../../utilities/staticData"
import { Link } from "gatsby"

export default function Footer() {

    return (
        <div className="footer-bar">
            <div className="row">
                <div className="col-xl-4 d-none d-xl-block text-center">
                    <div className="text-lightgrey py-1">
                        © 2022 NYYU UAB. Authorised by the FCIU, Reg. 305951620.
                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="d-none d-md-block">
                        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center text-lightgrey py-1">
                            {footerLinks.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.url}
                                    className="text-lightgrey text-hover-green mx-3 mb-1"
                                    target='_blank'
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="d-block d-md-none">
                        <div className="row mt-5 mx-2">
                            {footerLinks.map((item, index) => (
                                <div className="col-4" key={index}>
                                    <Link
                                        to={item.url}
                                        className="text-lightgrey text-hover-green mx-1 mb-2"
                                        target='_blank'
                                    >
                                        {item.label}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 d-block d-xl-none text-center mt-3 mb-5 px-4 px-sm-5 pb-5 pb-sm-2">
                    <div className="text-lightgrey py-1">
                        © 2022 NYYU UAB. Authorised by the FCIU, Reg. 305951620.
                    </div>
                </div>
            </div>
        </div>
    )
}