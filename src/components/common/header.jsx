import React, { useEffect, useState } from "react"
import Modal from "react-modal"

// Libraries
import { Link } from "gatsby"

// Icons
import { Bell, CloseIcon, DownArrow, Logo } from "../../utilities/imgImport"
import { User } from "../../utilities/user-data"

import { useAuth } from "../../hooks/useAuth"

const Menu = () => {
    const auth = useAuth()

    // State
    const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false)
    const [isDressUPModalOpen, setIsDressUPModalOpen] = useState(false)
    const [active, setActive] = useState(false)

    // Navigation Links
    const navigationLinks = [
        {
            label: "Home",
            url: "/",
        },
        {
            label: "Technology",
            url: "https://ndb.technology",
        },
        {
            label: "Vision",
            url: "https://ndb.city",
        },
        {
            label: "Learn",
            url: "/learn",
        },
        {
            label: "Contact Us",
            url: "https://ndb.money/#contactUs",
        },
    ]

    //DropDown Menu.
    const toggleDropDownMenu = () => setIsDropDownMenuOpen(!isDropDownMenuOpen)

    // Handles 'ESC' key pressing.
    useEffect(() => {
        const handleEscKeyPress = (event) => {
            if (event.key === "Escape" && active) {
                setActive(false)
            }
        }

        document.addEventListener("keydown", handleEscKeyPress)

        return () => document.removeEventListener("keydown", handleEscKeyPress)
    })

    return (
        <nav className={active ? "menu menu--active" : "menu"}>
            <div className="px-4 d-flex align-items-center justify-content-between">
                <Link to="/" className="menu__logo d-flex" title="Logo">
                    <img src={Logo} alt="NDB Brand Logo" />
                </Link>

                <div className="d-flex align-items-center">
                    <div className="sign-in">
                        {!auth?.isLoggedIn() ? (
                            <Link
                                className="btn-primary text-uppercase d-inline-block"
                                to="/signin"
                            >
                                Sign In
                            </Link>
                        ) : (
                            <div className="d-flex align-items-center justify-content-end">
                                <img src={Bell} alt="Bell Icon" />
                                <img src={User.avatar} className="w-50 px-4" alt="Tesla Icon" />
                                <img
                                    src={DownArrow}
                                    alt="Down Arrow Icon"
                                    className="cursor-pointer"
                                    onClick={toggleDropDownMenu}
                                />
                                {isDropDownMenuOpen && (
                                    <div className="user-dropdown-menu">
                                        <div>dashboard</div>
                                        <div>profile</div>
                                        <div onClick={() => setIsDressUPModalOpen(true)}>
                                            dressup
                                        </div>
                                        <div>faq</div>
                                    </div>
                                )}
                                <Modal
                                    isOpen={isDressUPModalOpen}
                                    onRequestClose={() => {
                                        setIsDressUPModalOpen(false)
                                    }}
                                    ariaHideApp={false}
                                    className="pwd-modal"
                                    overlayClassName="pwd-modal__overlay"
                                >
                                    <div className="pwd-modal__header">
                                        Change your password
                                        <div
                                            onClick={() => setIsDressUPModalOpen(false)}
                                            onKeyDown={() => setIsDressUPModalOpen(false)}
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
                                </Modal>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        className="menu__toggler"
                        onClick={() => setActive(!active)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>

                <div className="menu__content">
                    <div className="content d-md-flex align-items-center">
                        <ul className="content__section menu__items">
                            {navigationLinks.map((link) => (
                                <li className="menu__item" key={link.label}>
                                    <Link
                                        to={link.url}
                                        className="d-inline-block"
                                        onClick={() => setActive(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Menu
