import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import NDBStakingModal from './NDBStakingModal';

const DataRow = ({ asset }) => {
    const [isStakingModalOpen, setIsStakingModalOpen] = useState(false);

    return (
        <>
            <tr>
                <td>
                    <div className="d-flex align-items-center fs-16px gap-2">
                        <div className="circle-light"></div>
                        <div className="fs-16px fw-500 text-uppercase">
                            {asset.label}
                        </div>
                    </div>
                </td>
                <td className="fs-14px text-success">
                    {asset.apy}
                </td>
                <td className="fs-14px">
                    <div className="d-flex align-items-center gap-2 justify-content-center">
                        <Icon
                            className="clock-icon text-success"
                            icon="ic:baseline-access-time"
                        />
                        <div>Flexible</div>
                    </div>
                </td>
                <td className="fs-14px text-uppercase">
                    {asset.minAmount}
                </td>
                <td>
                    <button className="btn btn-outline-light rounded-0 fw-bold text-uppercase w-100 py-1"
                        onClick={() => setIsStakingModalOpen(true)}
                    >
                        stake
                    </button>
                </td>
            </tr>
            {isStakingModalOpen && <NDBStakingModal isModalOpen={isStakingModalOpen} setIsModalOpen={setIsStakingModalOpen} data={asset} />}
        </>
    );
};

export default function DefiStakingTab() {
    const [isStakingModalOpen, setIsStakingModalOpen] = useState(false);

    return (
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
                        <DataRow key={index} asset={asset} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}