import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import { TabPanel, Tabs } from "react-tabs"
import { useAuction } from "./auction-context"
import CustomSpinner from "../common/custom-spinner"
import { GreenCup } from "../../utilities/imgImport"
import { Currencies } from "../../utilities/staticData"
import { GET_BIDLIST_BY_ROUND } from "../../apollo/graghqls/querys/Bid"
import { GET_BID } from "../../apollo/graghqls/querys/Auction"

export default function AuctionRoundBidList() {
    // Containers
    const auction = useAuction()
    const { auctions, currentRoundNumber } = auction
    const [currentRoundBidList, setCurrentRoundBidList] = useState(null)
    const current = auctions?.filter(
        (auction) => auction.round === currentRoundNumber
    )[0]
    const loadingData = !(
        currentRoundBidList &&
        auction.currentRoundBidList &&
        auction.getBid
    )

    // Webservices
    useQuery(GET_BIDLIST_BY_ROUND, {
        variables: {
            round: currentRoundNumber,
        },
        onCompleted: (data) => {
            const list = data.getBidListByRound.sort(
                (item1, item2) => item2.totalAmount - item1.totalAmount
            )
            setCurrentRoundBidList(list)
            auction.setCurrentRoundBidList(list)
        },
        onError: (error) => console.log(error),
    })

    useQuery(GET_BID, {
        variables: {
            roundId: current?.id,
        },
        onCompleted: (data) => {
            auction.setGetBid(data.getBid)
            if (data.getBid === null) return auction.setIsBid(true)
            if (data.getBid.status === 0) return auction.setIsBid(true)
            return auction.setIsBid(false)
        },
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
                                        {item.totalAmount}
                                    </td>
                                </tr>
                            ))}
                            {currentRoundBidList.length === 0 && (
                                <tr>
                                    <td
                                        className="text-uppercase text-center mx-auto fs-14px border-0 py-2"
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
