import React, { useState } from "react"
import { Link } from "gatsby"
import { Logo } from "../../utilities/imgImport"

const Header = () => {
    const [show, setShow] = useState(false)
    const hamburgerHandler = () => {
        setShow(!show)
    }
    let navMenuClsName = "menu "
    if (show) {
        navMenuClsName += "active"
    }
    return (
        <nav className={navMenuClsName}>
            <div className="container d-flex align-items-center justify-content-between">
                {/* <div className={navMenuClsName}> */}
                <Link to="/">
                    <img src={Logo} alt="logo" className="logo" />
                </Link>
                <div className="d-flex">
                    <div className="sign-in">
                        <Link className="btn-primary text-uppercase d-inline-block" to="/signin">
                            sign in
                        </Link>
                    </div>
                    <button className="hamburger" onClick={hamburgerHandler} tabIndex="0">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                {show && (
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" activeClassName="active" to="/">
                                <span className="txt-green">H</span>ome
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" activeClassName="active" to="technology">
                                <span className="txt-green">T</span>echnology
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" activeClassName="active" to="/fision">
                                <span className="txt-green">V</span>ision
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" activeClassName="active" to="/learn">
                                <span className="txt-green">L</span>earn
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" activeClassName="active" to="/contact-us">
                                <span className="txt-green">C</span>ontact us
                            </Link>
                        </li>
                    </ul>
                )}
                {/* </div> */}
            </div>
        </nav>
    )
}

export default Header
