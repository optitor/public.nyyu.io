import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "gatsby"
import { Logo } from "../../utilities/imgImport"

import { useGetAvatarComponentsQuery } from './../../apollo/model/avatarComponent';
import { fetch_Avatar_Components } from "../../redux/actions/avatarAction";

const AdminHeader = () => {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);

    let navMenuClsName = "menu "
    if (show) {
        navMenuClsName += "active"
    };

    // Fetch avatarComponents Data from backend
    let avatarComponents = [];
    const queryResults = useGetAvatarComponentsQuery();
    if(queryResults.data) {
        avatarComponents = queryResults.data.getAvatarComponents;
    }
    
    useEffect(() => {
        dispatch(fetch_Avatar_Components(avatarComponents));
    }, [avatarComponents.length]);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <nav className={navMenuClsName}>
            <div className="container d-flex align-items-center justify-content-between">
                <Link to="/">
                    <img src={Logo} alt="logo" className="logo" />
                </Link>
                <div className="d-flex">
                    <div className="admin">
                        <span
                            className="btn-primary d-inline-block"
                            style={{ border: "none", padding: 7, textTransform: "unset" }}
                        >
                            Admin
                        </span>
                    </div>
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
            </div>
        </nav>
    )
}

export default AdminHeader
