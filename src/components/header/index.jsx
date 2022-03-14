import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "gatsby";
import { isBrowser } from "./../../utilities/auth";
import { Bell, Logo, NotificationBell } from "../../utilities/imgImport";
import ReactTooltip from "react-tooltip";

import {useAuth} from "../../hooks/useAuth";
import {setCurrentAuthInfo, getAuthInfo} from "../../redux/actions/authAction";
import {fetch_Avatar_Components} from "../../redux/actions/avatarAction";

import Loading from "../common/FadeLoading";
import DressupModal from "../dress-up/dressup-user-modal";
import CurrencyChoice from "./currency-choice";
import Avatar from "../dress-up/avatar";
import UserTier from "./user-tier";
import { profile_tabs } from "../../utilities/staticData";
import {GET_USER} from "../../apollo/graghqls/querys/Auth";
import {ROUTES} from "../../utilities/routes";
import {GET_ALL_UNREAD_NOTIFICATIONS} from "../../apollo/graghqls/querys/Notification";
import {UPDATE_AVATARSET} from "../../apollo/graghqls/mutations/AvatarComponent";

const Menu = ({ setTabIndex, setCurrentProfileTab, setTab }) => {
    const dispatch = useDispatch();
    // Webservice
    const { data: user_data } = useQuery(GET_USER);
    useQuery(GET_ALL_UNREAD_NOTIFICATIONS, {
        fetchPolicy: "network-only",
        onCompleted: (response) => {
            if (!response.getAllUnReadNotifications) return;
            setNewNotification(response.getAllUnReadNotifications?.length !== 0);
        },
    });
    const [updateAvatarSet, { loading }] = useMutation(UPDATE_AVATARSET, {
        onCompleted: (data) => {
            dispatch(getAuthInfo());
        },
        onError: (err) => {
            console.log("received Mutation data", err);
        },
    });


    // Containers
    const auth = useAuth();
    const userInfo = user_data?.getUser;
    const [active, setActive] = useState(false);
    const { avatarComponents } = useSelector((state) => state);
    const [newNotification, setNewNotification] = useState(false);
    const [isDressUPModalOpen, setIsDressUPModalOpen] = useState(false);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigationLinks = [
        {
            label: "Home",
            url: "https://ndb.money/",
            active: false,
        },
        {
            label: "Vision",
            url: "https://ndb.city",
            active: false,
        },
        {
            label: "Technology",
            url: "https://ndb.money/technology",
            active: false,
        },
        {
            label: "Learn",
            url: "https://ndb.money/learn",
            active: false,
        },
        {
            label: "Sale",
            url: "/",
            active: true,
            subMenu: [
                {
                    label: "Wallet",
                    url: ROUTES.wallet,
                    isDressup: false,
                },
                {
                    label: "Sale",
                    url: ROUTES.auction,
                    isDressup: false,
                },
                {
                    label: "Profile",
                    url: ROUTES.profile,
                    isDressup: false,
                },
                {
                    label: "Dressup",
                    isDressup: true,
                },
                {
                    label: "Support",
                    url: ROUTES.faq,
                    isDressup: false,
                },
            ],
        },
        {
            label: "Contact Us",
            url: "https://ndb.money/#contactUs",
            active: false,
        },
    ];

    const isShowNavLinks =
        isBrowser &&
        (window.location.pathname === ROUTES.profile ||
            window.location.pathname === ROUTES.faq ||
            window.location.pathname === ROUTES.wallet ||
            window.location.pathname === ROUTES.auction ||
            window.location.pathname === ROUTES.payment ||
            window.location.pathname === ROUTES.creditDeposit ||
            window.location.pathname.includes(ROUTES.admin));

    // Methods
    useEffect(() => {
        if (!avatarComponents.loaded) {
            dispatch(fetch_Avatar_Components());
        }
        if (!isAuthenticated && userInfo) {
            dispatch(setCurrentAuthInfo(userInfo));
        }
    }, [dispatch, userInfo, avatarComponents.loaded, isAuthenticated]);

    useEffect(() => {
        const handleEscKeyPress = (event) => {
            if (event.key === "Escape" && active) {
                setActive(false);
            }
        };
        document.addEventListener("keydown", handleEscKeyPress);
        return () => document.removeEventListener("keydown", handleEscKeyPress);
    });

    // Render
    if (loading) return <Loading />;
    else
        return (
            <nav className={active ? "menu menu--active" : "menu"}>
                <div className="px-4 d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-5 text-white text-uppercase fw-bold">
                        <Link to="/" className="menu__logo d-flex" title="Logo">
                            <img src={Logo} alt="NDB Brand Logo" />
                        </Link>
                        {isShowNavLinks && (
                            <div className="d-none d-md-flex justify-content-between gap-5">
                                <Link
                                    to={ROUTES.wallet}
                                    className={`${
                                        (window.location.pathname === ROUTES.wallet ||
                                            window.location.pathname === ROUTES.creditDeposit) &&
                                        "txt-green"
                                    }`}
                                >
                                    wallet
                                </Link>
                                <Link
                                    to={ROUTES.auction}
                                    className={`${
                                        (window.location.pathname === ROUTES.auction ||
                                            window.location.pathname === ROUTES.payment) &&
                                        "txt-green"
                                    }`}
                                >
                                    sale
                                </Link>
                                <Link
                                    to={ROUTES.profile}
                                    className={`${
                                        window.location.pathname === ROUTES.profile && "txt-green"
                                    }`}
                                >
                                    profile
                                </Link>
                                <div
                                    onClick={() => setIsDressUPModalOpen(true)}
                                    onKeyDown={() => setIsDressUPModalOpen(true)}
                                    className="cursor-pointer hover:text-green"
                                    role="presentation"
                                >
                                    dressup
                                </div>
                                <Link
                                    to={ROUTES.faq}
                                    className={`${
                                        window.location.pathname === ROUTES.faq && "txt-green"
                                    }`}
                                >
                                    support
                                </Link>
                                {user?.role && user?.role?.includes("ROLE_ADMIN") ? (
                                    <Link
                                        to={ROUTES.admin}
                                        className={`${
                                            window.location.pathname.includes(ROUTES.admin) &&
                                            "txt-green"
                                        }`}
                                    >
                                        admin
                                    </Link>
                                ) : (
                                    ""
                                )}
                            </div>
                        )}
                    </div>
                    <div className="d-flex align-items-center">
                        <div>
                            {!auth?.isLoggedIn() ? (
                                <Link className="header-btn" to={ROUTES.signIn}>
                                    Sign In
                                </Link>
                            ) : (
                                <ul className="d-flex align-items-center">
                                    <Link className="header-btn sale" to="/app/auction">
                                        Sale
                                    </Link>
                                    <li className="scale-75 cursor-pointer">
                                        <Link to={ROUTES.profile}>
                                            <img
                                                onClick={
                                                    isBrowser &&
                                                    window.location.pathname === ROUTES.profile
                                                        ? () => {
                                                              setTabIndex(1);
                                                              setCurrentProfileTab(profile_tabs[1]);
                                                              setTab(1);
                                                          }
                                                        : () => {
                                                              dispatch({
                                                                  type: "CREATE_NOTIFICATION_ROUTE",
                                                              });
                                                          }
                                                }
                                                src={newNotification ? NotificationBell : Bell}
                                                alt="Bell Icon"
                                            />
                                        </Link>
                                        <ReactTooltip
                                            id="bell-icon-tooltip"
                                            place="bottom"
                                            type="light"
                                            effect="solid"
                                        >
                                            <div
                                                className="text-uppercase text-center"
                                                style={{ width: "200px" }}
                                            >
                                                no unread notification
                                            </div>
                                        </ReactTooltip>
                                    </li>
                                    <li className="px-sm-3 px-0 scale-75">
                                        <Link to={ROUTES.profile}>
                                            <Avatar
                                                onClick={() => {
                                                    dispatch({
                                                        type: "DISABLE_NOTIFICATION_ROUTE",
                                                    });
                                                }}
                                                className="user-avatar"
                                            />
                                            <UserTier />
                                        </Link>
                                    </li>
                                    <DressupModal
                                        setIsModalOpen={setIsDressUPModalOpen}
                                        isModalOpen={isDressUPModalOpen}
                                        onSave={(res) => {
                                            updateAvatarSet({
                                                variables: { ...res },
                                            });
                                        }}
                                    />
                                </ul>
                            )}
                        </div>
                        <CurrencyChoice />
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
                                        <a
                                            href={link.url}
                                            className={`d-inline-block ${link.active && "active"}`}
                                            onClick={() => setActive(false)}
                                        >
                                            {link.label}
                                        </a>
                                        {link.active && (
                                            <ul className="my-4 d-block d-sm-none">
                                                {link.subMenu.map((subLink, index) => {
                                                    return (
                                                        <li className="mb-3" key={index}>
                                                            {subLink.isDressup ? (
                                                                <div
                                                                    onClick={() => {
                                                                        setActive(false);
                                                                        setIsDressUPModalOpen(true);
                                                                    }}
                                                                    className="fw-500 text-light fs-20px"
                                                                >
                                                                    {subLink.label}
                                                                </div>
                                                            ) : (
                                                                <Link
                                                                    to={subLink.url}
                                                                    className="fw-500 fs-20px d-block text-light"
                                                                    activeClassName="first-letter:text-green"
                                                                >
                                                                    {subLink.label}
                                                                </Link>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        );
};

export default Menu;
