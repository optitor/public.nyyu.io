import React, { useState } from "react";
import Zendesk from "react-zendesk";
import { useMutation } from '@apollo/client';
import Header from "../components/header";
import {
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
import CustomSpinner from "./common/custom-spinner";
import Seo from "../components/seo";
import UnlockAccountModal from "../components/support/unlock-account-moda";
import ResetPhoneModal from "../components/support/reset-phone-modal";
import DepositAssetModal from "../components/support/deposit-asset-modal";
import DepositMissingModal from "../components/support/deposit-missing-modal";
import ResetAuthenticatorModal from "../components/support/reset-authenticator-modal";
import DeleteAccountModal from "../components/profile/delete-account-modal";
import { ZENDESK_KEY } from "../utilities/staticData3";
import { ZendeskURLWithJWT } from "../utilities/staticData";
import { GET_ZENDESK_JWT } from '../apollo/graphqls/mutations/Support';

const setting = {
    color: {
        theme: "#000",
    },
    launcher: {
        chatLabel: {
            "en-US": "Need Help",
        },
    },
    contactForm: {
        fields: [
            {
                id: "description",
                prefill: { "*": "My pre-filled description" },
            },
        ],
    },
};

const FAQ = () => {
    // Container
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [isUnlockAccountModalOpen, setIsUnlockAccountModalOpen] = useState(false);
    const [isResetPhoneModalOpen, setIsResetPhoneModalOpen] = useState(false);
    const [isResetAuthenticatorModalOpen, setIsResetAuthenticatorModalOpen] = useState(false);
    const [isDepositAssetModalOpen, setIsDepositAssetModalOpen] = useState(false);
    const [isDepositMissingModalOpen, setIsDepositMissingModalOpen] = useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [pending, setPending] = useState(false);

    const [getZendeskJwtMutation] = useMutation(GET_ZENDESK_JWT, {
        onCompleted: data => {
            if(data.getZendeskJwt) {
                const jwtToken = data.getZendeskJwt?.token;
                window.open(`${ZendeskURLWithJWT}${jwtToken}`, '_blank');
            }
            setPending(false);
        },
        onError: err => {
            console.log(err.message);
            setPending(false);
        }
    });

    const handleHelpCenter = () => {
        setPending(true);
        getZendeskJwtMutation();
    };

    const handleHelpCommunity = () => {
        setPending(true);
        getZendeskJwtMutation();
    };

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
            clickEvent: () => {
                const link = document.createElement("a");
                link.href = "https://help.nyyu.io/hc/en-gb/requests/new";
                link.target = "_blank";
                link.click();
            },
        },
    ];

    // Render
    return (
        <>
            <Seo title="Support" />
            <main className="faq-page">
                <Header />
                <section className="px-sm-5 px-2 pb-5 pb-sm-0 w-100">
                    <div className="row m-0 mt-4 mt-sm-0">
                        <div className="col-lg-3 col-6 ps-0 my-2 my-sm-0">
                            <button
                                className="h-100 border border-light text-light support-banner-item text-decoration-none d-block"
                                onClick={handleHelpCenter}
                            >
                                <div className="h-100 d-flex align-items-center justify-content-around flex-column gap-sm-0 gap-3 py-3 py-sm-0">
                                    {pending?
                                        <CustomSpinner />
                                        :
                                        (
                                            <>
                                                <div className="fw-bold text-uppercase support-banner-title">
                                                    help center
                                                </div>
                                                <img
                                                    src={SupportHelpCenter}
                                                    alt="Support help center"
                                                />
                                            </>
                                        )
                                    }
                                </div>
                            </button>
                        </div>

                        <div className="col-lg-3 col-6 ps-0 pe-0 pe-sm-2 my-2 my-sm-0">
                            <a
                                className="h-100 border border-light text-light support-banner-item text-decoration-none d-block"
                                href='https://help.nyyu.io/hc/en-gb/community/topics'
                                target='_blank'
                            >
                                <div className="h-100 d-flex align-items-center justify-content-around flex-column gap-sm-0 gap-3 py-3 py-sm-0">
                                    <div className="fw-bold text-uppercase support-banner-title">
                                        community
                                    </div>
                                    <img
                                        src={SupportCommunity}
                                        alt="Support help center"
                                    />
                                </div>
                            </a>
                        </div>

                        <div className="row col-lg-6 col-12 p-0 m-0">
                            {selfServiceData.map((item, index) => {
                                return (
                                    <button
                                        key={index}
                                        className={`btn col-12 col-lg-6 py-0 ${index % 2 === 0
                                            ? "ps-lg-0 pe-lg-1 px-0"
                                            : "pe-lg-0 ps-lg-1 px-0"
                                            }`}
                                        onClick={item.clickEvent}
                                    >
                                        <div
                                            className={`text-light border border-1 border-light text-center support-self-security-item col-12 ${item.id <= 5 && "mb-2"
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
                <Zendesk defer zendeskKey={ZENDESK_KEY} {...setting} />;
            </main>
        </>
    );
};

export default FAQ;
