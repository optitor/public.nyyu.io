import Select from "react-select"
import Loading from "./common/Loading"
import { Link, navigate } from "gatsby"
import { useQuery } from "@apollo/client"
import { useDispatch } from "react-redux"
import Header from "../components/header"
import { ROUTES } from "../utilities/routes"
import SignOutTab from "./profile/sign-out-tab"
import { profile_tabs, TWO_FACTOR_AUTH_TOOLTIP_CONTENT } from "../utilities/staticData"
import Seo from "./seo"
import TwoFactorModal from "./profile/two-factor-modal"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { GET_USER } from "../apollo/graghqls/querys/Auth"
import ConnectWalletTab from "./profile/connect-wallet-tab"
import React, { useEffect, useState } from "react"
import DeleteAccountModal from "./profile/delete-account-modal"
import { setCurrentAuthInfo } from "../redux/actions/authAction"
import NotificationRecent from "./profile/notification-recent-switch"
import NotificationSetting from "./profile/notification-setting-switch"
import ProfileChangePasswordModal from "./profile/change-password-modal"
import TierDetailsTab from "./profile/tier-details-tab"
import Avatar from "../components/dress-up/avatar"
import { GET_USER_TIERS } from "./profile/profile-queries"
import { QuestionMark } from "../utilities/imgImport"
import AccountDetails from "./profile/account-details"
import ReactTooltip from "react-tooltip"
import { GET_SHUFTI_REF_PAYLOAD, GET_SHUFT_REFERENCE } from "./verify-identity/kyc-webservice"
const Profile = () => {
    const dispatch = useDispatch()
    const [userDataLoading, setUserDataLoading] = useState(true)
    const [userTiersLoading, setUserTiersLoading] = useState(true)
    const [tabIndex, setTabIndex] = useState(0)
    const [displayName, setDisplayName] = useState("")
    const [userTiersData, setUserTiersData] = useState(null)
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [currentProfileTab, setCurrentProfileTab] = useState(profile_tabs[0])
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false)
    // Webservice
    const { data: userData, refetch } = useQuery(GET_USER, {
        onCompleted: (res) => {
            if (userData.getUser.avatar) {
                const { prefix, name } = userData.getUser.avatar
                if (prefix && name) {
                    setDisplayName(prefix + "." + name)
                    return setUserDataLoading(false)
                } else return navigate(ROUTES.selectFigure)
            }
            return navigate(ROUTES.selectFigure)
        },
        fetchPolicy: "network-only",
    })
    const { data: userTiers } = useQuery(GET_USER_TIERS, {
        fetchPolicy: "network-only",
        onCompleted: () => {
            setUserTiersData(userTiers.getUserTiers)
            return setUserTiersLoading(false)
        },
    })
    useQuery(GET_SHUFTI_REF_PAYLOAD, {
        onCompleted: (data) => {
            setShuftiReference(data.getShuftiRefPayload)
        },
        fetchPolicy: "network-only",
        errorpolicy: "ignore",
    })

    const loadingPage = userDataLoading || userTiersLoading || shuftReference
    // Containers
    const user = userData?.getUser
    const twoStep = user?.security
        ? user.security.filter((f) => f.tfaEnabled).map((m) => m.authType)
        : []

    const currentTier = userTiersData?.filter((item) => item?.level === user?.tierLevel)
    const [shuftReference, setShuftiReference] = useState(null)
    const nextTier = userTiersData?.filter((item) => item?.level === user?.tierLevel + 1)

    // Methods
    const handleProfileTab = (value) => {
        setCurrentProfileTab(value)
        setTabIndex(value.index)
    }

    const getSecurityStatus = (key) =>
        user?.security?.find((f) => f?.authType === key && f?.tfaEnabled)

    const TfaConfig = ({ title, method }) => {
        const config = !!getSecurityStatus(method)

        return (
            <>
                <div className={`status ${config ? "active" : "deactive"} mt-3px`}></div>
                <div className="security-item">
                    <p className="security-name">{title}</p>

                    {!config && (
                        <p
                            className="txt-green security-link"
                            onClick={() => setIs2FAModalOpen(true)}
                            onKeyDown={() => setIs2FAModalOpen(true)}
                            role="presentation"
                        >
                            Setup
                        </p>
                    )}
                </div>
                {config && (
                    <div className="security-item-disable">
                        <p
                            className="txt-red security-link"
                            onClick={() => setIs2FAModalOpen(true)}
                            onKeyDown={() => setIs2FAModalOpen(true)}
                            role="presentation"
                        >
                            disable
                        </p>
                    </div>
                )}
            </>
        )
    }

    useEffect(() => dispatch(setCurrentAuthInfo(user)), [dispatch, user])
    if (loadingPage) return <Loading />
    else {
        return (
            <>
                <Seo title="Profile" />
                <main className="profile-page">
                    <TwoFactorModal
                        is2FAModalOpen={is2FAModalOpen}
                        setIs2FAModalOpen={setIs2FAModalOpen}
                        email={user?.email}
                        phone={user?.phone}
                        twoStep={twoStep}
                        onResult={(res) => {
                            if (res) {
                                refetch()
                            }
                        }}
                    />
                    <Header />
                    <section className="container position-relative h-100">
                        <div className="row">
                            <div className="col-lg-3 profile-page__left border-md-end border-white">
                                <div className="user-info">
                                    <div className="my-5 user-info__avatar">
                                        <Avatar />
                                    </div>
                                    <div className="user-info__name">
                                        {currentTier?.length > 0 ? (
                                            <div
                                                className="me-3"
                                                dangerouslySetInnerHTML={{
                                                    __html: currentTier[0]?.svg,
                                                }}
                                            />
                                        ) : (
                                            <></>
                                        )}
                                        {displayName}
                                    </div>
                                    <p className="silver-cnt">
                                        {nextTier.length > 0 &&
                                            nextTier[0]?.point -
                                                user?.tierPoint +
                                                "p to " +
                                                nextTier[0]?.name}
                                    </p>
                                    <div className="timeframe-bar mt-1">
                                        <div
                                            className="timeleft"
                                            style={{
                                                width: `${
                                                    (user?.tierPoint / nextTier[0]?.point) * 100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <Tabs
                                    className="profile-tab"
                                    onSelect={(index) => setTabIndex(index)}
                                >
                                    <TabList>
                                        {profile_tabs.map((item, idx) => (
                                            <Tab key={idx}>{item.label}</Tab>
                                        ))}
                                    </TabList>
                                    <Select
                                        isSearchable={false}
                                        options={profile_tabs}
                                        value={currentProfileTab}
                                        onChange={(v) => handleProfileTab(v)}
                                        className="profile-tab__select mb-3"
                                    />
                                    <TabPanel>0</TabPanel>
                                    <TabPanel>1</TabPanel>
                                    <TabPanel>2</TabPanel>
                                    <TabPanel>3</TabPanel>
                                </Tabs>
                            </div>
                            <div className="col-lg-9 profile-page__right">
                                {tabIndex === 0 && (
                                    <>
                                        <Tabs className="detail-tab">
                                            <TabList>
                                                <Tab>
                                                    <div className="pt-3">account detaiLs</div>
                                                </Tab>
                                                <Tab>
                                                    <div className="pt-3">tier Details</div>
                                                </Tab>
                                            </TabList>
                                            <TabPanel>
                                                <div className="account-details">
                                                    <AccountDetails
                                                        setIsPasswordModalOpen={
                                                            setIsPasswordModalOpen
                                                        }
                                                        user={user}
                                                        displayName={displayName}
                                                        shuftReference={shuftReference}
                                                    />
                                                    <div className="account-security">
                                                        <h4 className="d-flex align-items-center">
                                                            <div>
                                                                Increase your account security
                                                            </div>
                                                            <img
                                                                data-tip
                                                                data-for="question-mark-tooltip"
                                                                className="cursor-pointer ms-2"
                                                                src={QuestionMark}
                                                                alt="Question Mark"
                                                            />
                                                            <ReactTooltip
                                                                id="question-mark-tooltip"
                                                                place="right"
                                                                type="light"
                                                                effect="solid"
                                                            >
                                                                <div
                                                                    className="text-capitalize text-start fw-normal"
                                                                    style={{ width: "320px" }}
                                                                >
                                                                    {
                                                                        TWO_FACTOR_AUTH_TOOLTIP_CONTENT
                                                                    }
                                                                </div>
                                                            </ReactTooltip>
                                                        </h4>
                                                        <div className="row w-100 mx-auto">
                                                            <div className="col-md-4 br">
                                                                <TfaConfig
                                                                    title="2FA Email"
                                                                    method="email"
                                                                />
                                                            </div>
                                                            <div className="col-md-4 br">
                                                                <TfaConfig
                                                                    title="2FA Mobile"
                                                                    method="phone"
                                                                />
                                                            </div>

                                                            <div className="col-md-4">
                                                                <TfaConfig
                                                                    title="2FA Google Authentication"
                                                                    method="app"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabPanel>
                                            <TabPanel>
                                                <TierDetailsTab />
                                            </TabPanel>
                                        </Tabs>
                                        <div className="verify-delete mt-3 pb-5 ps-sm-3 ps-0">
                                            <p
                                                className="delete-account-link"
                                                onClick={() => setIsDeleteAccountModalOpen(true)}
                                                onKeyDown={() => setIsDeleteAccountModalOpen(true)}
                                                role="presentation"
                                            >
                                                Delete account
                                            </p>
                                        </div>
                                    </>
                                )}
                                {tabIndex === 1 && (
                                    <div className="notification-set">
                                        <Tabs className="notification-tab">
                                            <TabList>
                                                <Tab>
                                                    <div className="pt-3 pb-2">Recent</div>
                                                </Tab>
                                                <Tab>
                                                    <div className="py-3 pb-2">Setup</div>
                                                </Tab>
                                            </TabList>
                                            <TabPanel>
                                                <NotificationRecent />
                                            </TabPanel>
                                            <TabPanel>
                                                <NotificationSetting />
                                            </TabPanel>
                                        </Tabs>
                                    </div>
                                )}
                                {tabIndex === 2 && (
                                    <div className="connect-wallet">
                                        <h4 className="pt-3">select wallet</h4>
                                        <ConnectWalletTab />
                                    </div>
                                )}
                                {tabIndex === 3 && <SignOutTab />}
                            </div>
                        </div>
                    </section>
                    <ProfileChangePasswordModal
                        isPasswordModalOpen={isPasswordModalOpen}
                        setIsPasswordModalOpen={setIsPasswordModalOpen}
                    />
                    <DeleteAccountModal
                        isDeleteAccountModalOpen={isDeleteAccountModalOpen}
                        setIsDeleteAccountModalOpen={setIsDeleteAccountModalOpen}
                    />
                </main>
            </>
        )
    }
}

export default Profile
