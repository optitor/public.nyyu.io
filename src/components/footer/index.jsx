import React from "react"
import { footerLinks } from "../../utilities/staticData"
import { Link } from "gatsby"

export default function Footer() {

    return (
        <div className="footer-bar">
            <div className="px-4 d-flex justify-content-between align-items-center">
                <div className="footer-nav">
                    <div className="d-flex align-items-center gap-5 text-gray">
                        {footerLinks.map((item, index) => (
                            <Link
                                key={index}
                                to={item.url}
                                className="text-gray"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="footer-copyright">
                    <div className="text-gray">
                        @ 2022 NYYU UAB, Lithuania. All Rights reserved.
                    </div>
                </div>
            </div>
        </div>
    )
}