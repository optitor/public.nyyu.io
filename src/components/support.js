import React, { useState } from "react"
import Header from "../components/header"
import { FAQ_CONTENT, NEWS_CONTENT } from "../utilities/staticData"
import Accordion from "../components/common/Accordion"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import {
    ChatButton,
    SupportAuthenticator,
    SupportDelete,
    SupportRecovery,
    SupportReset,
    SupportSecurity,
    SupportTag,
    SupportUnlock,
} from "../utilities/imgImport"
import ResetPasswordModal from "../components/support/reset-password-modal"
import Seo from "../components/seo"
import UnlockAccountModal from "../components/support/unlock-account-moda"
import ResetPhoneModal from "../components/support/reset-phone-modal"
import DepositAssetModal from "../components/support/deposit-asset-modal"
import DepositMissingModal from "../components/support/deposit-missing-modal"
import ResetAuthenticatorModal from "../components/support/reset-authenticator-modal"
import DeleteAccountModal from "../components/profile/delete-account-modal"
import ChatModal from "../components/support/chat-modal"

const FAQ = () => {
    // Containers
    const selfServiceData = [
        {
            id: 0,
            label: "Reset Password",
            icon: SupportReset,
            clickEvent: () => setIsResetPasswordModalOpen(true),
        },
        {
            id: 1,
            label: "Unlock Account",
            icon: SupportUnlock,
            clickEvent: () => setIsUnlockAccountModalOpen(true),
        },
        {
            id: 2,
            label: "Reset Phone Security Verification",
            icon: SupportSecurity,
            clickEvent: () => setIsResetPhoneModalOpen(true),
        },
        {
            id: 3,
            label: "Reset Google Authenticator",
            icon: SupportAuthenticator,
            clickEvent: () => setIsResetAuthenticatorModalOpen(true),
        },
        {
            id: 4,
            label: "Deposit Non Credit Asset Recovery",
            icon: SupportRecovery,
            clickEvent: () => setIsDepositAssetModalOpen(true),
        },
        {
            id: 5,
            label: "Deposit Missing Or Wrong Tag/Memo Asset Recovery",
            icon: SupportTag,
            clickEvent: () => setIsDepositMissingModalOpen(true),
        },
        {
            id: 5,
            label: "Suspend/Delete Account",
            icon: SupportDelete,
            clickEvent: () => setIsDeleteAccountModalOpen(true),
        },
    ]

    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
    const [isUnlockAccountModalOpen, setIsUnlockAccountModalOpen] = useState(false)
    const [isResetPhoneModalOpen, setIsResetPhoneModalOpen] = useState(false)
    const [isResetAuthenticatorModalOpen, setIsResetAuthenticatorModalOpen] = useState(false)
    const [isDepositAssetModalOpen, setIsDepositAssetModalOpen] = useState(false)
    const [isDepositMissingModalOpen, setIsDepositMissingModalOpen] = useState(false)
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false)
    const [isChatModalOpen, setIsChatModalOpen] = useState(false)
    // Render
    return (
        <>
            <Seo title="Support" />
            <main className="faq-page">
                <Header />
                <section className="container px-sm-5 px-4 pb-5 pb-sm-0">
                    <Tabs className="faq__tabs">
                        <TabList className="faq__tabs-list">
                            <Tab className="faq__tabs-tab w-100 pb-2 pb-sm-0">help center</Tab>
                        </TabList>
                        <TabPanel>
                            <Tabs className="sub-faq__tabs">
                                <TabList className="sub-faq__tabs-list">
                                    <Tab className="sub-faq__tabs-tab text-uppercase">
                                        self-service
                                    </Tab>
                                    <Tab className="sub-faq__tabs-tab text-uppercase">faq</Tab>
                                    <Tab className="sub-faq__tabs-tab text-uppercase">news</Tab>
                                </TabList>
                                <TabPanel>
                                    <div className="row col-12 p-0 m-0">
                                        {selfServiceData.map((item, index) => {
                                            return (
                                                <button
                                                    key={index}
                                                    className={`btn col-12 col-lg-6 ${index % 2 === 0
                                                        ? "ps-lg-0 pe-lg-1 px-0"
                                                        : "pe-lg-0 ps-lg-1 px-0"
                                                        }`}
                                                    onClick={item.clickEvent}
                                                >
                                                    <div className="text-light border border-1 border-light text-center support-self-security-item col-12 mb-2">
                                                        <img src={item.icon} alt="item figure" />
                                                        <div>{item.label}</div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <div className="d-flex justify-content-md-between mt-3">
                                        <div className="cursor-pointer position-fixed end-20px bottom-20px" style={{ zIndex: 99999 }}>
                                            {
                                                !isChatModalOpen && <img
                                                    src={ChatButton}
                                                    className="rounded-pill hover:scale-125"
                                                    alt="Chat Button"
                                                    onClick={() => setIsChatModalOpen(true)}
                                                />
                                            }
                                            <ChatModal
                                                isOpen={isChatModalOpen}
                                                setIsOpen={setIsChatModalOpen}
                                            />
                                        </div>
                                    </div>
                                    <DeleteAccountModal
                                        isDeleteAccountModalOpen={isDeleteAccountModalOpen}
                                        setIsDeleteAccountModalOpen={setIsDeleteAccountModalOpen}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <p className="question-label d-sm-block d-none">Question</p>
                                    <div className="faq-list">
                                        {FAQ_CONTENT?.map((question, idx) => (
                                            <Accordion {...question} key={idx} />
                                        ))}
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="faq-list">
                                        {NEWS_CONTENT?.map((question, idx) => (
                                            <Accordion {...question} key={idx} />
                                        ))}
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </TabPanel>
                    </Tabs>
                    {isResetPasswordModalOpen && (
                        <ResetPasswordModal
                            isOpen={isResetPasswordModalOpen}
                            setIsOpen={setIsResetPasswordModalOpen}
                        />
                    )}
                    <UnlockAccountModal
                        isOpen={isUnlockAccountModalOpen}
                        setIsOpen={setIsUnlockAccountModalOpen}
                    />
                    <ResetPhoneModal
                        isOpen={isResetPhoneModalOpen}
                        setIsOpen={setIsResetPhoneModalOpen}
                    />
                    <ResetAuthenticatorModal
                        isOpen={isResetAuthenticatorModalOpen}
                        setIsOpen={setIsResetAuthenticatorModalOpen}
                    />
                    <DepositAssetModal
                        isOpen={isDepositAssetModalOpen}
                        setIsOpen={setIsDepositAssetModalOpen}
                    />
                    <DepositMissingModal
                        isOpen={isDepositMissingModalOpen}
                        setIsOpen={setIsDepositMissingModalOpen}
                    />
                </section>
            </main>
        </>
    )
}

export default FAQ
