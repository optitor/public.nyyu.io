import React from "react";
import { useQuery } from "@apollo/client";
import { GET_TASK_SETTING, GET_USER_TIER_TASK } from "./profile-queries";
import { useState } from "react";
import CustomSpinner from "../common/custom-spinner";
import { QuestionMark } from "../../utilities/imgImport";
import ReactTooltip from "react-tooltip";
import { useSelector } from "react-redux";

export default function TierDetailsTab({ shuftiStatus }) {
    // Webserivce
    useQuery(GET_TASK_SETTING, {
        fetchPolicy: "network-only",
        onCompleted: (data) => setTaskSettingData(data.getTaskSetting),
    });

    useQuery(GET_USER_TIER_TASK, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setGainPointsData(data.getUserTierTask);
            const walletBalance = data.getUserTierTask.wallet;

            let _walletPoint = 0;
            taskSettingData.wallet.forEach(elem => {
                if(walletBalance > elem.amount) {
                    _walletPoint += elem.point;
                }
            });
            setWalletPoint(_walletPoint);
        },
    });

    // Containers
    const userTiersData = useSelector(state => state.tiers);
    const userData = useSelector(state => state.auth?.user);

    const [gainPointsData, setGainPointsData] = useState(null);
    const [taskSettingData, setTaskSettingData] = useState(null);
    const [walletPoint, setWalletPoint] = useState(0);
    

    const loadingSection = !(gainPointsData && taskSettingData && userTiersData && userData);
    const currentTier = userTiersData?.filter((item) => item?.level === userData?.tierLevel);
    const nextTier = userTiersData?.filter((item) => item?.level === userData?.tierLevel + 1);
    const wallletBalanceSettings = [
        {
            amount: 50,
            points: 50,
        },
        {
            amount: 1000,
            points: 1000,
        },
        {
            amount: 50000,
            points: 1500,
        },
        {
            amount: 100000,
            points: 2000,
        },
        {
            amount: 300000,
            points: 3000,
        },
        {
            amount: 500000,
            points: 6000,
        },
    ];
    // Methods

    if (loadingSection)
        return (
            <div className="d-flex justify-content-center my-5">
                <CustomSpinner />
            </div>
        );
    else
        return (
            <>
                <div className="tier-details">
                    <div className="row w-100 mx-auto">
                        <div className="detail_item my-auto br">Tier</div>
                        <div className="detail_item text-end text-sm-start d-flex align-items-center justify-content-end justify-content-sm-start">
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

                            {currentTier?.length > 0 ? currentTier[0]?.name : ""}
                        </div>
                    </div>
                    <div className="row w-100 mx-auto">
                        <div className="detail_item br">Point to next tier</div>
                        <div className="detail_item text-end text-sm-start">
                            {nextTier?.length > 0 ? nextTier[0]?.point - userData?.tierPoint : ""}
                        </div>
                    </div>
                    <div className="row w-100 mx-auto pt-5">
                        <h4>
                            <span className="txt-green">G</span>
                            ain Points
                        </h4>
                        <div className="detail_item d-flex align-items-center br">
                            <div
                                className={`status me-2 ${
                                    shuftiStatus?.event !== "verification.accepted"
                                        ? "deactive"
                                        : "active"
                                }`}
                            />
                            KYC/AML completion
                        </div>
                        <div className="detail_item text-end text-sm-start">
                            {taskSettingData.verification}
                        </div>
                    </div>

                    <div className="row mx-0">
                        <div className="detail_item d-flex align-items-center br">
                            <div
                                className={`status me-2 ${
                                    gainPointsData.wallet === 0 ? "deactive" : "active"
                                }`}
                            />

                            <div className="d-flex align-items-center justify-content-between w-100">
                                <div>Wallet balance</div>
                                <div className="cursor-pointer">
                                    <img
                                        src={QuestionMark}
                                        alt="Question mark"
                                        data-tip
                                        data-for="qmark-icon-tooltip"
                                        style={{width: 25}}
                                    />
                                </div>
                            </div>
                            <ReactTooltip
                                id="qmark-icon-tooltip"
                                place="bottom"
                                type="dark"
                                effect="solid"
                            >
                                <div
                                    className="text-uppercase text-start"
                                    style={{ width: "300px" }}
                                >
                                    {wallletBalanceSettings.map((setting, index) => {
                                        return (
                                            <div key={index}>
                                                <span className="text-[#959595]">Amount:</span>{" "}
                                                {setting.amount},{" "}
                                                <span className="text-[#959595]">Points: </span>{" "}
                                                {setting.points}
                                            </div>
                                        );
                                    })}
                                </div>
                            </ReactTooltip>
                        </div>
                        <div className="detail_item text-end text-sm-start">
                            {gainPointsData.wallet}/6000
                        </div>
                    </div>

                    <div className="row mx-0">
                        <div className="detail_item d-flex align-items-center br">
                            <div
                                className={`status me-2 ${
                                    gainPointsData.auctions?.length ? "active" : "deactive"
                                }`}
                            />
                            Auction participation
                        </div>
                        <div className="detail_item text-end text-sm-start">
                            {taskSettingData.auction * gainPointsData.auctions?.length || 0}
                        </div>
                    </div>
                    <div className="row mx-0">
                        <div className="detail_item d-flex align-items-center br">
                            <div
                                className={`status me-2 ${
                                    gainPointsData.direct > 0 ? "active" : "deactive"
                                }`}
                            />
                            Direct Purchase
                        </div>
                        <div className="detail_item text-end text-sm-start">
                            {gainPointsData.direct || 0}
                        </div>
                    </div>
                </div>
            </>
        );
}
