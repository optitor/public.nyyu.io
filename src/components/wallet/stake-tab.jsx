import React from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { BTC, DOGE, DownArrow, ETH, USDC } from "../../utilities/imgImport"

export default function StakeTab() {
    return (
        <Tabs className="text-light">
            <TabList className="py-3 px-4">
                <Tab>Equity Value</Tab>
                <Tab>Locked Staking</Tab>
                <Tab>DeFi Staking</Tab>
            </TabList>
            <TabPanel className="px-4 py-3">
                <div className="d-flex justify-content-between px-2">
                    <div className="d-flex flex-column justify-content-center">
                        <div className="fs-24px fw-500">Equity value(BTC)</div>
                        <div className="txt-green fs-36px">******</div>
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
                            <button className="btn btn-outline-light rounded-0 w-100 fw-500 text-uppercase">
                                stake to earn
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-5">
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
                    <table className="overflow-auto">
                        <thead className="border-bottom-1px">
                            <tr>
                                <th>Token</th>
                                <th className="text-center">Amount</th>
                                <th className="text-end">APY</th>
                                <th className="text-end">Interest</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { icon: BTC, label: "btc" },
                                { icon: ETH, label: "eth" },
                                { icon: DOGE, label: "doge" },
                                { icon: USDC, label: "usdc" },
                                { icon: BTC, label: "btc" },
                                { icon: ETH, label: "eth" },
                                { icon: DOGE, label: "doge" },
                                { icon: USDC, label: "usdc" },
                                { icon: BTC, label: "btc" },
                                { icon: ETH, label: "eth" },
                                { icon: DOGE, label: "doge" },
                                { icon: USDC, label: "usdc" },
                            ].map((item) => (
                                <tr>
                                    <td>
                                        <div className="d-flex align-items-center fs-16px gap-2">
                                            <img src={item.icon} alt="btc image" />
                                            <div className="fs-16px fw-500 text-uppercase">
                                                {item.label}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="fs-14px text-center">1 NDB</td>
                                    <td className="fs-14px text-success text-end">30.77%</td>
                                    <td className="fs-14px text-end">0.06251 NDB</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TabPanel>
            <TabPanel>B</TabPanel>
            <TabPanel>C</TabPanel>
        </Tabs>
    )
}
