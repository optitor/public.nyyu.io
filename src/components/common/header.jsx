import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import DressupHorizontalList from "../dressup-horizontal-list"

// Libraries
import { Link } from "gatsby"

// Icons
import {
    Bell,
    CloseIcon,
    DownArrow,
    HairColor1,
    HairColor2,
    HairColor3,
    HairColor4,
    HairStyle1,
    HairStyle2,
    HairStyle3,
    HairStyle4,
    HairStyle5,
    Logo,
    Tesla,
} from "../../utilities/imgImport"
import { User } from "../../utilities/user-data"

import { useAuth } from "../../hooks/useAuth"

const Menu = () => {
    const auth = useAuth()

    // State
    const [isDropDownMenuOpen, setIsDropDownMenuOpen] = useState(false)
    const [isDressUPModalOpen, setIsDressUPModalOpen] = useState(false)
    const [selectedHairStyle, setSelectedHairStyle] = useState(0)
    const [selectedHairColor, setSelectedHairColor] = useState(0)
    const [selectedTab, setSelectedTab] = useState(0)
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

    const tabs = [
        {
            index: 0,
            title: "hair",
        },
        {
            index: 1,
            title: "face",
        },
        {
            index: 2,
            title: "accessories",
        },
    ]

    const hairStyles = [
        {
            index: 0,
            icon: HairStyle1,
            price: "owned",
            unit: "",
        },
        {
            index: 1,
            icon: HairStyle2,
            price: "0.01",
            unit: "ndb",
        },
        {
            index: 2,
            icon: HairStyle3,
            price: "0.01",
            unit: "ndb",
        },
    ]

    const hairColors = [
        {
            index: 0,
            icon: HairColor1,
            price: "owned",
            unit: "",
        },
        {
            index: 1,
            icon: HairColor2,
            price: "owned",
            unit: "",
        },
        {
            index: 2,
            icon: HairColor3,
            price: "owned",
            unit: "",
        },
        {
            index: 3,
            icon: HairColor4,
            price: "100",
            unit: "t",
        },
    ]

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
                                to="/app/signin"
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
                                    className="dressup-modal"
                                    overlayClassName="dressup-modal__overlay"
                                >
                                    <div className="dressup-modal__header">
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
                                                className="mt-3 me-3"
                                                alt="close"
                                            />
                                        </div>
                                    </div>
                                    <div className="row m-0 py-4 text-white">
                                        <div className="col-4">
                                            <div className="row">
                                                <img
                                                    src={Tesla}
                                                    alt="Avatar"
                                                    className="w-75 px-5 mx-auto"
                                                />
                                                <span className="text-center dressup-modal-avatar-name">
                                                    Tesla
                                                </span>
                                                <div className="dressup-modal-sections-list">
                                                    {tabs.map((item) => (
                                                        <div
                                                            onClick={() =>
                                                                setSelectedTab(item.index)
                                                            }
                                                            key={item.index}
                                                            className={`${
                                                                item.index == selectedTab &&
                                                                "active"
                                                            }`}
                                                        >
                                                            {item.title}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="btn-save">save</div>
                                            </div>
                                        </div>
                                        <div className="col-8 border-start px-5 py-3">
                                            {selectedTab == 0 && (
                                                <div className="dressup-modal-hair-section">
                                                    <DressupHorizontalList
                                                        title={"hair style"}
                                                        list={hairStyles}
                                                        selectedItem={selectedHairStyle}
                                                        setSelectedItem={setSelectedHairStyle}
                                                    />
                                                    <div className="mt-4"></div>
                                                    <DressupHorizontalList
                                                        title={"hair color"}
                                                        list={hairColors}
                                                        selectedItem={selectedHairColor}
                                                        setSelectedItem={setSelectedHairColor}
                                                    />
                                                </div>
                                            )}
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
