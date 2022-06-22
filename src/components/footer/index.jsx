import React from "react"
import { footerLinks } from "../../utilities/staticData"
import { Link } from "gatsby"

export default function Footer() {

    return (
        <div className="footer-bar">
            <div className="row">
                <div className="col-xl-4 text-center">
                    <div className="text-lightgrey py-1">
                        © 2022 NYYU UAB, Lithuania. Authorised by the FCIU, Reg. 305951620.
                    </div>
                </div>
                <div className="col-xl-8">
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
            </div>
        </div>
    )
}