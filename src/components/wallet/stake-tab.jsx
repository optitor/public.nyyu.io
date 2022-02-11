/* eslint-disable */

import React from "react"
import { useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { BTC, DownArrow, Equity, ETH, USDC } from "../../utilities/imgImport"
import { Icon } from "@iconify/react"

export default function StakeTab() {
    // Containers
    const [lockedStakingAssets, setLockedStakingAssets] = useState([])
    if (lockedStakingAssets.length === 0)
        setLockedStakingAssets([
            {
                id: 0,
                label: "btc",
                minAmount: "1 btc",
                apy: "30.77%",
                duration: 0,
            },
            {
                id: 1,
                label: "eth",
                minAmount: "1 eth",
                apy: "0.90%",
                duration: 1,
            },
            {
                id: 2,
                label: "usdc",
                minAmount: "1 usdc",
                apy: "4.49%",
                duration: 0,
            },
        ])
    // Methods
    const changeDurationForAsset = (assetID, durationID) => {
        const fooArray = lockedStakingAssets
        fooArray[assetID].duration = durationID
        setLockedStakingAssets([...fooArray])
        // console.log("clicking")
    }
    return (
        <Tabs className="text-light stake-react-list__tab">
            <TabList className="py-3 px-0 px-sm-4 overflow-auto d-flex align-items-center justify-content-start white-space-nowrap">
                <Tab>Equity Value</Tab>
                <Tab>Locked Staking</Tab>
                <Tab>DeFi Staking</Tab>
            </TabList>
            <TabPanel className="px-4">
                <div className="py-3">
                    <div className="d-flex justify-content-between px-2 flex-sm-row flex-column">
                        <div className="d-flex flex-column justify-content-center">
                            <div className="d-flex align-items-center gap-3">
                                <div className="fs-24px fw-500">Equity value(BTC)</div>
                                <img src={Equity} alt="equity icon" />
                            </div>
                            <div className="txt-green fs-36px lh-25px mt-3">******</div>
                            <div className="text-secondary fs-24px">******</div>
                        </div>
                        <div>
                            <div className="d-flex justify-content-between gap-5">
                                <div>
                                    <div className="text-secondary fs-14px fw-500">
                                        30-day profit (BTC)
                                    </div>
                                    <div className="txt-green fs-18px">******</div>
                                </div>
                                <div>
                                    <div className="text-secondary fs-14px fw-500">
                                        Last day PNL (BTC)
                                    </div>
                                    <div className="txt-green fs-18px">******</div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button className="btn btn-outline-light rounded-0 w-100 fw-bold text-uppercase">
                                    stake to earn
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 overflow-auto">
                        <div className="d-flex gap-3 justify-content-start align-items-center">
                            <div className="d-flex justify-content-start align-items-center gap-2">
                                <div className="fs-14px">All holdings</div>
                                <div>
                                    <img
                                        src={DownArrow}
                                        alt="down arrow"
                                        className="cursor-pointer w-50"
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-start align-items-center gap-2">
                                <div className="fs-14px">All coins</div>
                                <div>
                                    <img
                                        src={DownArrow}
                                        alt="down arrow"
                                        className="cursor-pointer w-50"
                                    />
                                </div>
                            </div>
                        </div>
                        <table>
                            <thead className="border-bottom-1px">
                                <tr>
                                    <th>Token</th>
                                    <th className="text-sm-center">Amount</th>
                                    <th className="text-sm-end">APY</th>
                                    <th className="text-sm-end">Interest</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { icon: BTC, label: "btc" },
                                    { icon: ETH, label: "eth" },
                                ].map((item, index) => (
                                    <tr key={index} className="w-sm-100">
                                        <td className="pe-5">
                                            <div className="d-flex align-items-center fs-12px gap-2">
                                                <img src={item.icon} alt="btc image" />
                                                <div className="fs-16px fw-500 text-uppercase">
                                                    {item.label}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="fs-12px text-center pe-5">1 NDB</td>
                                        <td className="fs-12px text-success text-end pe-5">
                                            30.77%
                                        </td>
                                        <td className="fs-12px text-end pe-5 white-space-nowrap">
                                            0.06251 NDB
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </TabPanel>
            <TabPanel className="px-4">
                <div className="d-flex py-3">
                    <table>
                        <thead className="border-bottom-1px">
                            <tr className="text-center">
                                <th className="text-start">Token</th>
                                <th>Est. APY</th>
                                <th></th>
                                <th>Duration</th>
                                <th></th>
                                <th>Min. amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {lockedStakingAssets.map((asset) => (
                                <tr>
                                    <td>
                                        <div className="d-flex align-items-center fs-16px gap-2">
                                            <div className="circle-light"></div>
                                            <div className="fs-16px fw-500 text-uppercase">
                                                {asset.label}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="fs-14px text-success">{asset.apy}</td>
                                    <td className="fs-14px" colSpan={3}>
                                        <div className="stake-duration">
                                            {[
                                                { id: 0, label: "Flexible" },
                                                { id: 1, label: "30 days" },
                                                { id: 2, label: "60 days" },
                                                { id: 3, label: "90 days" },
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={`bg-black-10 ${
                                                        asset.duration === item.id &&
                                                        "active-duration"
                                                    }`}
                                                    onClick={() =>
                                                        changeDurationForAsset(asset.id, item.id)
                                                    }
                                                >
                                                    {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="fs-14px text-uppercase">{asset.minAmount}</td>
                                    <td>
                                        <button className="btn btn-outline-light rounded-0 fw-bold text-uppercase w-100 py-1">
                                            stake
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TabPanel>
            <TabPanel className="px-4">
                <div className="d-flex py-3">
                    <table>
                        <thead className="border-bottom-1px">
                            <tr className="text-center">
                                <th className="text-start">Token</th>
                                <th>Est. APY</th>
                                <th>Duration</th>
                                <th>Min. amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {[
                                {
                                    id: 0,
                                    label: "ndb",
                                    minAmount: "1 btc",
                                    apy: "30.77%",
                                    duration: 0,
                                },
                            ].map((asset, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="d-flex align-items-center fs-16px gap-2">
                                            <div className="circle-light"></div>
                                            <div className="fs-16px fw-500 text-uppercase">
                                                {asset.label}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="fs-14px text-success">{asset.apy}</td>
                                    <td className="fs-14px">
                                        <div className="d-flex align-items-center gap-2 justify-content-center">
                                            <Icon
                                                className="clock-icon text-success"
                                                icon="ic:baseline-access-time"
                                            />
                                            <div>Flexible</div>
                                        </div>
                                    </td>
                                    <td className="fs-14px text-uppercase">{asset.minAmount}</td>
                                    <td>
                                        <button className="btn btn-outline-light rounded-0 fw-bold text-uppercase w-100 py-1">
                                            stake
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TabPanel>
        </Tabs>
    )
}
