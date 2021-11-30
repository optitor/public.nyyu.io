import React, { useState, useReducer, useCallback } from "react"
import Header from "../components/common/header"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { Coinbase, MetaMask, Tesla, TrustWallet, WalletConnect } from "../utilities/imgImport"
import { Link } from "gatsby"
import Switch from "react-switch"
import Select from "react-select"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FormInput } from "../components/common/FormControl"

// const securities = [
//     {
//         name: "Enable 2FA",
//         status: true,
//         status_label: "Enabled",
//     },
//     {
//         name: "Identity Verificatoin",
//         status: true,
//         status_label: "Verified",
//     },
//     {
//         name: "Mobile Verification",
//         status: false,
//         status_label: "Setup",
//     },
//     {
//         name: "Turn-on Withdrawal Whitelist",
//         status: false,
//         status_label: "Setup",
//     },
// ]
const recent = [
    {
        status: true,
        act: "Failla.987 Placed a higher bid ",
    },
    {
        status: false,
        act: "Round 2 has just started",
    },
    {
        status: false,
        act: "round 1 ended",
    },
    {
        status: false,
        act: "Token has pumped in 23% since your last bid",
    },
    {
        status: true,
        act: "There are only 40 tokens left",
    },
]
const profile_tabs = [
    {
        value: "Account details",
        label: "Account details",
        index: 0,
    },
    {
        value: "Notifications",
        label: "Notifications",
        index: 1,
    },
    {
        value: "Connect wallet",
        label: "Connect wallet",
        index: 2,
    },
    {
        value: "Sign out",
        label: "Sign out",
        index: 3,
    },
]
const wallets = [
    {
        icon: MetaMask,
        desc: "Connect to your MetaMask wallet",
        href: "https://metamask.io/",
    },
    {
        icon: WalletConnect,
        desc: "Scan with WalletConnect to connect",
        href: "https://walletconnect.com/",
    },
    {
        icon: Coinbase,
        desc: "Connect to your Coinbase Account",
        href: "https://www.coinbase.com/",
    },
    {
        icon: TrustWallet,
        desc: "Connect to your Trust wallet",
        href: "https://trustwallet.com/",
    },
]

const Profile = () => {
    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), {
        bid: true,
        outbid: false,
        new_bid: false,
        win: true,
        lose: true,
        round_start: true,
        round_end: true,
        pwd: { value: "", error: "" },
        pwd_confirm: { value: "", error: "" },
    })
    const { bid, outbid, new_bid, win, lose, round_start, round_end, pwd, pwd_confirm } = state
    const [tabIndex, setTabIndex] = useState(0)
    const [profile_tab, setProfileTab] = useState(profile_tabs[0])
    const [walletId, setWalletId] = useState(0)

    const [pwdModal, setPwdOpen] = useState(false)
    const [tfaModal, setTFAOpen] = useState(false)

    const handleProfileTab = (value) => {
        setProfileTab(value)
        setTabIndex(value.index)
    }

    const handleBid = useCallback(() => {
        setState({ bid: !bid })
    }, [bid])
    const handleOutbid = useCallback(() => {
        setState({ outbid: !outbid })
    }, [outbid])
    const handleNewbid = useCallback(() => {
        setState({ new_bid: !new_bid })
    }, [new_bid])
    const handleWin = useCallback(() => {
        setState({ win: !win })
    }, [win])
    const handleLose = useCallback(() => {
        setState({ lose: !lose })
    }, [lose])
    const handleRoundStart = useCallback(() => {
        setState({ round_start: !round_start })
    }, [round_start])
    const handleRoundEnd = useCallback(() => {
        setState({ round_end: !round_end })
    }, [round_end])

    const handlePasswordChange = useCallback((e) => {
        setState({
            pwd: {
                value: e.target.value,
                error: e.target.value.length >= 6 ? "" : "Password length must be at least 6",
            },
        })
    }, [])
    const handlePwdConfirmChange = useCallback((e) => {
        setState({
            pwd_confirm: {
                value: e.target.value,
                error: e.target.value.length >= 6 ? "" : "Password length must be at least 6",
            },
        })
    }, [])

    return (
        <main className="profile-page">
            <Header />
            <section className="container position-relative h-100">
                <div className="row">
                    <div className="col-lg-3 col-md-4 profile-page__left">
                        <div className="user-info">
                            <img className="user-info__avatar" src={Tesla} alt="tesla" />
                            <p className="user-info__name">Tesla.12</p>
                        </div>
                        <Tabs className="profile-tab" onSelect={(index) => setTabIndex(index)}>
                            <TabList>
                                {profile_tabs.map((item, idx) => (
                                    <Tab key={idx}>{item.label}</Tab>
                                ))}
                            </TabList>
                            <Select
                                options={profile_tabs}
                                value={profile_tab}
                                onChange={(v) => handleProfileTab(v)}
                                className="profile-tab__select"
                            />
                            <TabPanel>0</TabPanel>
                            <TabPanel>1</TabPanel>
                            <TabPanel>2</TabPanel>
                            <TabPanel>3</TabPanel>
                        </Tabs>
                    </div>
                    <div className="col-lg-9 col-md-8 profile-page__right">
                        {tabIndex === 0 && (
                            <div className="account-details">
                                <div className="account-detail">
                                    <div className="row">
                                        <h4>
                                            <span className="txt-green">a</span>
                                            ccount Details
                                        </h4>
                                        <div className="col-6 br">Display name</div>
                                        <div className="col-6">tesla.12</div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6 br">email</div>
                                        <div className="col-6">exAmple@mail</div>
                                    </div>
                                    <div className="row change-password">
                                        <div className="col-6 br">Password</div>
                                        <div className="col-6 justify-content-between">
                                            <p>********</p>
                                            <button
                                                className="btn-primary"
                                                onClick={() => setPwdOpen(true)}
                                            >
                                                Change Passord
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center mt-3">
                                    <button
                                        className="btn-primary btn-pwd"
                                        onClick={() => setPwdOpen(true)}
                                    >
                                        Change Pasword
                                    </button>
                                </div>
                                <div className="account-security">
                                    <div className="row">
                                        <h4>
                                            Increase your account security&nbsp;
                                            <span className="txt-green">2</span>/4
                                        </h4>
                                        <div className="col-sm-6 br">
                                            <div className="status active"></div>
                                            <div className="security-item">
                                                <p className="security-name">Enable 2FA</p>
                                                <p
                                                    className="txt-green security-link"
                                                    onClick={() => setTFAOpen(true)}
                                                    onKeyDown={() => setTFAOpen(true)}
                                                    role="presentation"
                                                >
                                                    Enabled
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="status active"></div>
                                            <div className="security-item">
                                                <p className="security-name">
                                                    KYC Identity Verificatoin less than 100k CHF
                                                    withdraw
                                                </p>
                                                <p className="txt-green security-link">Verified</p>
                                            </div>
                                        </div>

                                        <div className="col-sm-6 br">
                                            <div className="status deactive"></div>
                                            <div className="security-item">
                                                <p className="security-name">Mobile Verification</p>
                                                <p className="txt-cyan security-link">Setup</p>
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <div className="status deactive"></div>
                                            <div className="security-item">
                                                <p className="security-name">
                                                    AML Identity Verificatoin more than 100k CHF
                                                    withdraw
                                                </p>
                                                <p className="txt-cyan security-link">Setup</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3">
                                    <Link to="/" className="get-verify">
                                        Get verified
                                    </Link>
                                    &nbsp; to collect over 2,000 USD the account should be verified.
                                </p>
                            </div>
                        )}
                        {tabIndex === 1 && (
                            <div className="notification-set">
                                <Tabs className="notification-tab">
                                    <TabList>
                                        <Tab>Recent</Tab>
                                        <Tab>Setup</Tab>
                                    </TabList>
                                    <TabPanel>
                                        {recent.map((item, idx) => (
                                            <div className="recent-item" key={idx}>
                                                <div
                                                    className={
                                                        item.status
                                                            ? "status active"
                                                            : "status deactive"
                                                    }
                                                ></div>
                                                <p>{item.act}</p>
                                            </div>
                                        ))}
                                    </TabPanel>
                                    <TabPanel>
                                        <div className="notification-item">
                                            <p>BID</p>
                                            <Switch
                                                onColor="#23c865"
                                                offColor="#ffffff"
                                                height={3}
                                                width={28}
                                                handleDiameter={11}
                                                onHandleColor="#23c865"
                                                onChange={handleBid}
                                                checked={bid}
                                            />
                                        </div>
                                        <div className="notification-item">
                                            <p>outbid</p>
                                            <Switch
                                                onColor="#23c865"
                                                offColor="#ffffff"
                                                height={3}
                                                width={28}
                                                handleDiameter={11}
                                                onHandleColor="#23c865"
                                                onChange={handleOutbid}
                                                checked={outbid}
                                            />
                                        </div>
                                        <div className="notification-item">
                                            <p>New Bid</p>
                                            <Switch
                                                onColor="#23c865"
                                                offColor="#ffffff"
                                                height={3}
                                                width={28}
                                                handleDiameter={11}
                                                onHandleColor="#23c865"
                                                onChange={handleNewbid}
                                                checked={new_bid}
                                            />
                                        </div>
                                        <div className="notification-item">
                                            <p>win</p>
                                            <Switch
                                                onColor="#23c865"
                                                offColor="#ffffff"
                                                height={3}
                                                width={28}
                                                handleDiameter={11}
                                                onHandleColor="#23c865"
                                                onChange={handleWin}
                                                checked={win}
                                            />
                                        </div>
                                        <div className="notification-item">
                                            <p>Lose</p>
                                            <Switch
                                                onColor="#23c865"
                                                offColor="#ffffff"
                                                height={3}
                                                width={28}
                                                handleDiameter={11}
                                                onHandleColor="#23c865"
                                                onChange={handleLose}
                                                checked={lose}
                                            />
                                        </div>
                                        <div className="notification-item">
                                            <p>Round Start</p>
                                            <Switch
                                                onColor="#23c865"
                                                offColor="#ffffff"
                                                height={3}
                                                width={28}
                                                handleDiameter={11}
                                                onHandleColor="#23c865"
                                                onChange={handleRoundStart}
                                                checked={round_start}
                                            />
                                        </div>
                                        <div className="notification-item">
                                            <p>Round End</p>
                                            <Switch
                                                onColor="#23c865"
                                                offColor="#ffffff"
                                                height={3}
                                                width={28}
                                                handleDiameter={11}
                                                onHandleColor="#23c865"
                                                onChange={handleRoundEnd}
                                                checked={round_end}
                                            />
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>
                        )}
                        {tabIndex === 2 && (
                            <div className="connect-wallet">
                                <h4>select wallet</h4>
                                <div className="row">
                                    {wallets.map((item, idx) => (
                                        <div
                                            className="col-sm-6"
                                            key={idx}
                                            onClick={() => setWalletId(idx)}
                                            onKeyDown={() => setWalletId(idx)}
                                            role="presentation"
                                        >
                                            <div
                                                className={`wallet-item ${
                                                    idx === walletId && "active"
                                                }`}
                                            >
                                                <img src={item.icon} alt="wallet icon" />
                                                <p>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-primary">CONNECT</button>
                            </div>
                        )}
                        {tabIndex === 3 && (
                            <div className="sign-out">
                                <h4>confirm sign out</h4>
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center">
                                    <p>Are you sure you want to sign out?</p>
                                    <button className="btn-primary">sign out</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Modal
                isOpen={pwdModal}
                onRequestClose={() => setPwdOpen(false)}
                ariaHideApp={false}
                className="pwd-modal"
                overlayClassName="pwd-modal__overlay"
            >
                <p className="pwd-modal__header">
                    Change your password
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-white modal-close"
                        onClick={() => setPwdOpen(false)}
                        onKeyDown={() => setPwdOpen(false)}
                        role="button"
                        tabIndex="0"
                    />
                </p>
                <form className="form" onSubmit={(e) => e.preventDefault()}>
                    <FormInput
                        name="password"
                        type="password"
                        label="New Password"
                        value={pwd.value}
                        onChange={handlePasswordChange}
                        placeholder="Enter password"
                        error={pwd.error}
                    />
                    <FormInput
                        name="pwd_confirm"
                        type="password"
                        label="Confirm New Password"
                        value={pwd_confirm.value}
                        onChange={handlePwdConfirmChange}
                        placeholder="Enter password"
                        error={pwd_confirm.error}
                    />
                    <div className="pwd-modal__footer">
                        <button type="submit" className="btn-primary">
                            SAVE
                        </button>
                        <button className="btn-cancel" onClick={() => setPwdOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal
                isOpen={tfaModal}
                onRequestClose={() => setTFAOpen(false)}
                ariaHideApp={false}
                className="tfa-modal"
                overlayClassName="tfa-modal__overlay"
            >
                <p className="tfa-modal__header">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-white modal-close"
                        onClick={() => setTFAOpen(false)}
                        onKeyDown={() => setTFAOpen(false)}
                        role="button"
                        tabIndex="0"
                    />
                </p>
                <p className="tfa-modal__body my-5">
                    Are you sure you want to disable 2-step verifacation to email?
                </p>
                <div className="pwd-modal__footer">
                    <button type="submit" className="btn-primary">
                        Yes
                    </button>
                    <button className="btn-cancel" onClick={() => setTFAOpen(false)}>
                        Cancel
                    </button>
                </div>
            </Modal>
        </main>
    )
}

export default Profile
