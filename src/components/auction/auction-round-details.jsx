import { useQuery } from "@apollo/client"
import React from "react"
import { useState } from "react"
import { TabPanel, Tabs } from "react-tabs"
import { GET_BIDLIST_BY_ROUND } from "../../apollo/graghqls/querys/Bid"
import CustomSpinner from "../../components/common/custom-spinner"
import { GreenCup } from "../../utilities/imgImport"
import { useAuction } from "./auction-context"
import { Currencies } from "../../utilities/staticData"

export default function AuctionRoundDetails() {
    // Containers
    const auction = useAuction()
    const { currentRoundNumber } = auction
    const [currentRoundBidList, setCurrentRoundBidList] = useState(null)
    const loadingData = !currentRoundBidList

    // Webservices
    useQuery(GET_BIDLIST_BY_ROUND, {
        variables: {
            round: currentRoundNumber,
        },
        onCompleted: (data) => {
            setCurrentRoundBidList(data.getBidListByRound)
        },
        onError: (error) => console.log(error),
    })
    // Render
    if (loadingData)
        return (
            <div className="text-center mt-4">
                <CustomSpinner />
            </div>
        )
    return (
        <>
            <Tabs className="statistics-tab" selectedIndex={0}>
                <TabPanel>
                    <table>
                        <thead>
                            <tr>
                                <th className="border-0 py-2">
                                    <img src={GreenCup} alt="Green Cup" />
                                </th>
                                <th className="fw-500 py-2">Placement</th>
                                <th className="fw-500 text-end py-2">
                                    Highest Bids
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRoundBidList.map((item, index) => (
                                <tr key={index}>
                                    <td className="border-0 ps-6px py-2">
                                        {index + 1}
                                    </td>
                                    <td className="py-2">
                                        {item.prefix + item.name}
                                    </td>
                                    <td className="py-2 text-end">
                                        <span className="txt-green">
                                            {Currencies[0].symbol}{" "}
                                        </span>
                                        {/* {calcPriceFromUsd(item.totalPrice)} */}
                                        {item.totalPrice}
                                    </td>
                                </tr>
                            ))}
                            {currentRoundBidList.length === 0 && (
                                <tr>
                                    <td
                                        className="text-uppercase mx-auto fs-14px"
                                        colSpan={3}
                                    >
                                        no records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TabPanel>
            </Tabs>
        </>
    )
}
