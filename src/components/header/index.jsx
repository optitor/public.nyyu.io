import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, navigate } from "gatsby";
import { isBrowser } from "../../utilities/auth";
import { useAuth } from "../../hooks/useAuth";

// Import only what we know exists
let Logo, Bell, NotificationBell;
try {
    const imgImports = require("../../utilities/imgImport");
    Logo = imgImports.Logo;
    Bell = imgImports.Bell;
    NotificationBell = imgImports.NotificationBell;
} catch (e) {
    console.warn("Image imports not found");
    Logo = "";
    Bell = "";
    NotificationBell = "";
}

// Import routes safely
let ROUTES, navLinks;
try {
    const routeImports = require("../../utilities/routes");
    ROUTES = routeImports.ROUTES;
    navLinks = routeImports.navLinks;
} catch (e) {
    console.warn("Routes not found");
    ROUTES = {
        signIn: "/app/signin/",
        signUp: "/app/signup/",
        profile: "/app/profile/",
        admin: "/admin",
        app: "/app/",
    };
    navLinks = [];
}

// Import static data safely
let navigationLinks, profile_tabs;
try {
    const staticData = require("../../utilities/staticData");
    navigationLinks = staticData.navigationLinks || [];
    profile_tabs = staticData.profile_tabs || [];
} catch (e) {
    console.warn("Static data not found");
    navigationLinks = [];
    profile_tabs = [];
}

// Import actions safely
let setCurrentAuthInfo, fetch_Avatar_Components, fetch_Favor_Assets;
try {
    const authActions = require("../../store/actions/authAction");
    setCurrentAuthInfo = authActions.setCurrentAuthInfo;
} catch (e) {
    console.warn("Auth actions not found");
    setCurrentAuthInfo = () => ({ type: "DUMMY_ACTION" });
}

try {
    const avatarActions = require("../../store/actions/avatarAction");
    fetch_Avatar_Components = avatarActions.fetch_Avatar_Components;
} catch (e) {
    console.warn("Avatar actions not found");
    fetch_Avatar_Components = () => ({ type: "DUMMY_ACTION" });
}

try {
    const settingActions = require("../../store/actions/settingAction");
    fetch_Favor_Assets = settingActions.fetch_Favor_Assets;
} catch (e) {
    console.warn("Setting actions not found");
    fetch_Favor_Assets = () => ({ type: "DUMMY_ACTION" });
}

// Import GraphQL safely
let GET_USER, GET_ALL_UNREAD_NOTIFICATIONS, useQuery;
try {
    const { useQuery: apolloUseQuery } = require("@apollo/client");
    useQuery = apolloUseQuery;
} catch (e) {
    console.warn("Apollo client not found");
    useQuery = () => ({ data: null, loading: false, error: null });
}

try {
    const authQueries = require("../../apollo/graphqls/querys/Auth");
    GET_USER = authQueries.GET_USER;
} catch (e) {
    console.warn("Auth queries not found");
    GET_USER = null;
}

try {
    const notificationQueries = require("../../apollo/graphqls/querys/Notification");
    GET_ALL_UNREAD_NOTIFICATIONS =
        notificationQueries.GET_ALL_UNREAD_NOTIFICATIONS;
} catch (e) {
    console.warn("Notification queries not found");
    GET_ALL_UNREAD_NOTIFICATIONS = null;
}

// Import cookies safely
let setCookie, removeCookie, NDB_Privilege, NDB_Admin;
try {
    const cookieUtils = require("../../utilities/cookies");
    setCookie = cookieUtils.setCookie;
    removeCookie = cookieUtils.removeCookie;
    NDB_Privilege = cookieUtils.NDB_Privilege;
    NDB_Admin = cookieUtils.NDB_Admin;
} catch (e) {
    console.warn("Cookie utilities not found");
    setCookie = () => {};
    removeCookie = () => {};
    NDB_Privilege = "NDB_Privilege";
    NDB_Admin = "NDB_Admin";
}

// Import auth utils safely
let logout;
try {
    const authUtils = require("../../utilities/auth");
    logout = authUtils.logout;
} catch (e) {
    console.warn("Auth utilities not found");
    logout = () => {};
}

// Social media fallbacks
const TWITTER = "https://twitter.com";
const DISCORD = "https://discord.com";

const Menu = ({ setTabIndex, setCurrentProfileTab, setTab }) => {
    const dispatch = useDispatch();
    const [banned, setBanned] = useState(false);
    const [isBannedOpen, setIsBannedOpen] = useState(false);
    const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
    const [informMessage, setInformMessage] = useState({
        first: "It seems you are accessing nyyu via anonymous proxy, VPN or VPS.",
        second: "we are unable to provide services to you.",
    });

    // Webservice - always call hooks, but handle missing queries
    const { data: user_data } = useQuery(GET_USER || `query { __typename }`);

    // Notifications query - always call but handle missing query
    useQuery(GET_ALL_UNREAD_NOTIFICATIONS || `query { __typename }`, {
        fetchPolicy: "network-only",
        errorPolicy: "none",
        skip: !GET_ALL_UNREAD_NOTIFICATIONS, // Skip if query doesn't exist
        onCompleted: (data) => {
            if (!data?.getAllUnReadNotifications) return;
            setNewNotification(data?.getAllUnReadNotifications?.length !== 0);
        },
        onError: (err) => {
            if (err.graphQLErrors && err.graphQLErrors[0]) {
                if (err.graphQLErrors[0]?.isBannedCountry) {
                    setInformMessage({
                        first: `It seems you are accessing nyyu from an IP address belonging to ${err.graphQLErrors[0].country}.`,
                        second: "we are unable to provide services to users from this region.",
                    });
                    navigate("/");
                    setBanned(true);
                    setIsBannedOpen(true);
                } else if (err.graphQLErrors[0]?.isAnonymousIp) {
                    setInformMessage({
                        first: "It seems you are accessing nyyu via anonymous proxy, VPN or VPS.",
                        second: "we are unable to provide services to you.",
                    });
                    navigate("/");
                    setBanned(true);
                    setIsBannedOpen(true);
                } else if (err.graphQLErrors[0]?.isUnderMaintenance) {
                    navigate("/");
                    setBanned(true);
                    setIsMaintenanceOpen(true);
                    logout();
                }
            }
        },
    });

    // Containers
    const auth = useAuth();
    const userInfo = user_data?.getUser;
    const [active, setActive] = useState(false);

    // Safe selectors
    const avatarComponents = useSelector(
        (state) => state?.avatarComponents || { loaded: false },
    );
    const authState = useSelector((state) => state?.auth || {});
    const { user, isAuthenticated } = authState;

    const [newNotification, setNewNotification] = useState(false);
    const isAdmin = user?.role && user?.role?.includes("ROLE_ADMIN");

    const isShowNavLinks =
        isBrowser &&
        (window.location.pathname.includes(ROUTES.app) ||
            window.location.pathname.includes(ROUTES.admin));

    const isCurrentSignin =
        isBrowser && window.location.pathname.includes("/app/sign");

    // Methods
    useEffect(() => {
        if (!avatarComponents.loaded && fetch_Avatar_Components) {
            dispatch(fetch_Avatar_Components());
        }
        if (userInfo && setCurrentAuthInfo) {
            dispatch(setCurrentAuthInfo(userInfo));
            if (userInfo.role && userInfo.role.includes("ROLE_ADMIN")) {
                setCookie(NDB_Privilege, NDB_Admin);
            } else {
                removeCookie(NDB_Privilege);
            }
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
    }, [active]);

    useEffect(() => {
        if (fetch_Favor_Assets) {
            dispatch(fetch_Favor_Assets());
        }
    }, [dispatch]);

    const isActive = (paths) => {
        if (!paths || !Array.isArray(paths)) return false;
        return (
            paths.filter((item) => item === window.location.pathname).length > 0
        );
    };

    return (
        <nav className={active ? "menu menu--active" : "menu"}>
            <div className="px-4 d-flex justify-content-between">
                <div className="d-flex align-items-center gap-5 text-white text-uppercase fw-bold">
                    <Link to="/" className="menu__logo d-flex" title="Logo">
                        {Logo && <img src={Logo} alt="NDB Brand Logo" />}
                    </Link>
                    {auth?.isLoggedIn() && isShowNavLinks && navLinks && (
                        <div className="d-none d-lg-flex justify-content-between gap-5">
                            {navLinks.map((link, key) => {
                                return (
                                    <Link
                                        key={key}
                                        to={link.to}
                                        className={`${isActive(link.active) && "txt-green"}`}
                                    >
                                        {link.title}
                                    </Link>
                                );
                            })}
                            {isAdmin && (
                                <Link
                                    to={ROUTES.admin}
                                    className={`${
                                        window.location.pathname.includes(
                                            ROUTES.admin,
                                        ) && "txt-green"
                                    }`}
                                >
                                    admin
                                </Link>
                            )}
                        </div>
                    )}
                </div>
                <div className="d-flex align-items-center">
                    <div>
                        {!auth?.isLoggedIn() ? (
                            !banned ? (
                                !isCurrentSignin ? (
                                    <>
                                        <Link
                                            to={ROUTES.signIn}
                                            className="text-white text-decoration-none fw-bold me-3"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to={ROUTES.signUp}
                                            className="btn btn-success fw-bold"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                ) : null
                            ) : null
                        ) : (
                            <ul className="d-flex justify-content-between align-items-center list-unstyled mb-0 gap-3">
                                <li>
                                    <a
                                        href={TWITTER}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="social-icon d-flex justify-content-center align-items-center bg-success"
                                    >
                                        <i className="fab fa-twitter" />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={DISCORD}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="social-icon d-flex justify-content-center align-items-center bg-success"
                                    >
                                        <i className="fab fa-discord" />
                                    </a>
                                </li>
                                <li className="pe-sm-3 px-0 scale-75">
                                    <Link to={ROUTES.profile}>
                                        {Bell && (
                                            <img
                                                onClick={
                                                    setTabIndex
                                                        ? () => {
                                                              setTabIndex(1);
                                                              setCurrentProfileTab(
                                                                  profile_tabs[1],
                                                              );
                                                              setTab(1);
                                                          }
                                                        : () => {
                                                              dispatch({
                                                                  type: "CREATE_NOTIFICATION_ROUTE",
                                                              });
                                                          }
                                                }
                                                src={
                                                    newNotification
                                                        ? NotificationBell
                                                        : Bell
                                                }
                                                alt="Bell Icon"
                                            />
                                        )}
                                    </Link>
                                </li>
                                <li className="pe-sm-3 px-0 scale-75">
                                    <Link to={ROUTES.profile}>
                                        <div
                                            className="avatar-placeholder user-avatar"
                                            onClick={() => {
                                                dispatch({
                                                    type: "DISABLE_NOTIFICATION_ROUTE",
                                                });
                                            }}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                backgroundColor: "#6c757d",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "white",
                                                fontSize: "12px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            U
                                        </div>
                                    </Link>
                                </li>
                            </ul>
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
                                    <a
                                        href={link.url}
                                        className={`d-inline-block ${link.active && "active"}`}
                                        onClick={() => setActive(false)}
                                    >
                                        {link.label}
                                    </a>
                                    {isAuthenticated &&
                                        link.active &&
                                        link.subMenu && (
                                            <ul className="my-4 d-block d-lg-none">
                                                {link.subMenu.map(
                                                    (subLink, index) => (
                                                        <li
                                                            className="mb-3"
                                                            key={index}
                                                        >
                                                            <Link
                                                                to={subLink.url}
                                                                className="fw-500 fs-20px d-block text-light header-item"
                                                                activeClassName="first-letter:txt-green header-item"
                                                            >
                                                                {subLink.label}
                                                            </Link>
                                                        </li>
                                                    ),
                                                )}
                                                {isAdmin && (
                                                    <li className="mb-3">
                                                        <Link
                                                            to={ROUTES.admin}
                                                            className="fw-500 fs-20px d-block text-light header-item"
                                                            activeClassName="first-letter:txt-green header-item"
                                                        >
                                                            ADMIN
                                                        </Link>
                                                    </li>
                                                )}
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
