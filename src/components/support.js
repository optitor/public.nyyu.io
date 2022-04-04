import React, { useState } from "react";
import Header from "../components/header";
import {
    ChatButton,
    SupportAuthenticator,
    SupportCommunity,
    SupportDelete,
    SupportHelpCenter,
    SupportRecovery,
    SupportRequest,
    SupportReset,
    SupportSecurity,
    SupportTag,
    SupportUnlock,
} from "../utilities/imgImport";
import ResetPasswordModal from "../components/support/reset-password-modal";
import Seo from "../components/seo";
import UnlockAccountModal from "../components/support/unlock-account-moda";
import ResetPhoneModal from "../components/support/reset-phone-modal";
import DepositAssetModal from "../components/support/deposit-asset-modal";
import DepositMissingModal from "../components/support/deposit-missing-modal";
import ResetAuthenticatorModal from "../components/support/reset-authenticator-modal";
import DeleteAccountModal from "../components/profile/delete-account-modal";
import ChatModal from "../components/support/chat-modal";

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
            id: 6,
            label: "Suspend/Delete Account",
            icon: SupportDelete,
            clickEvent: () => setIsDeleteAccountModalOpen(true),
        },
        {
            id: 7,
            label: "Submit a Request",
            icon: SupportRequest,
            clickEvent: () => {},
        },
    ];

    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
        useState(false);
    const [isUnlockAccountModalOpen, setIsUnlockAccountModalOpen] =
        useState(false);
    const [isResetPhoneModalOpen, setIsResetPhoneModalOpen] = useState(false);
    const [isResetAuthenticatorModalOpen, setIsResetAuthenticatorModalOpen] =
        useState(false);
    const [isDepositAssetModalOpen, setIsDepositAssetModalOpen] =
        useState(false);
    const [isDepositMissingModalOpen, setIsDepositMissingModalOpen] =
        useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
        useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    // Render
    return (
        <>
            <Seo title="Support" />
            <main className="faq-page">
                <Header />
                <section className="px-sm-5 px-2 pb-5 pb-sm-0 w-100">
                    <div className="row m-0">
                        <div className="col-lg-3 ps-0 m-0 d-none d-lg-block">
                            <div className="h-100 border border-light text-light">
                                <div className="h-100 d-flex align-items-center justify-content-around flex-column">
                                    <div className="fw-bold text-uppercase fs-30px">
                                        help center
                                    </div>
                                    <img
                                        src={SupportHelpCenter}
                                        alt="Support help center"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 ps-0 m-0 d-none d-lg-block">
                            <div className="h-100 border border-light text-light">
                                <div className="h-100 d-flex align-items-center justify-content-around flex-column">
                                    <div className="fw-bold text-uppercase fs-30px">
                                        community
                                    </div>
                                    <img
                                        src={SupportCommunity}
                                        alt="Support help center"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row col-lg-6 col-12 p-0 m-0">
                            {selfServiceData.map((item, index) => {
                                return (
                                    <button
                                        key={index}
                                        className={`btn col-12 col-lg-6 py-0 ${
                                            index % 2 === 0
                                                ? "ps-lg-0 pe-lg-1 px-0"
                                                : "pe-lg-0 ps-lg-1 px-0"
                                        }`}
                                        onClick={item.clickEvent}
                                    >
                                        <div
                                            className={`text-light border border-1 border-light text-center support-self-security-item col-12 ${
                                                item.id <= 5 && "mb-2"
                                            }`}
                                        >
                                            <img
                                                src={item.icon}
                                                alt="item figure"
                                            />
                                            <div>{item.label}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="d-flex justify-content-md-between mt-3">
                            <div
                                className="cursor-pointer position-fixed end-20px bottom-20px"
                                style={{ zIndex: 99999 }}
                            >
                                {!isChatModalOpen && (
                                    <img
                                        src={ChatButton}
                                        className="rounded-pill hover:scale-125"
                                        alt="Chat Button"
                                        onClick={() => setIsChatModalOpen(true)}
                                    />
                                )}
                                <ChatModal
                                    isOpen={isChatModalOpen}
                                    setIsOpen={setIsChatModalOpen}
                                />
                            </div>
                        </div>
                        <DeleteAccountModal
                            isDeleteAccountModalOpen={isDeleteAccountModalOpen}
                            setIsDeleteAccountModalOpen={
                                setIsDeleteAccountModalOpen
                            }
                        />
                    </div>
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
    );
};

export default FAQ;
