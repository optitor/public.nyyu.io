import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from "@apollo/client";
import { Skeleton } from '@mui/material';
import { renderNumberFormat } from "../../utilities/number";
import { getCurrentMarketCap, getCirculatingSupply } from "../../utilities/utility-methods";
import { GET_CURRENT_ROUND } from "../../apollo/graphqls/querys/Auction";

export default function CurrentCapProgressBar() {
    const [totalRounds, setTotalRounds] = useState(null);
    const [currentCap, setCurrentCap] = useState(null); // Hardcoded value
    const [circulatingSupply, setCirculatingSupply] = useState(null); // Hardcoded value

    const MaxSupply = 10**12;

    const loading = !(circulatingSupply && currentCap && totalRounds);

    useQuery(GET_CURRENT_ROUND, {
        onCompleted: (data) => {
            const auction = data.getCurrentRound?.auction;
            const presale = data.getCurrentRound?.presale;
            if(auction) {
                setTotalRounds(auction?.round);
            } else if(presale) {
                setTotalRounds(presale?.round);
            }
        },
        onError: (error) => console.log(error),
        errorPolicy: "ignore",
        fetchPolicy: "network-only",
    });

    const barProgress = useMemo(() => {
        let progress = Number(circulatingSupply / MaxSupply * 100).toFixed(1);
        if(progress < 1) progress = 1;

        return progress;
    }, [circulatingSupply, MaxSupply]);

    useEffect(async () => {
        const response = await getCurrentMarketCap();
        setCurrentCap(Number(response.marketcap));
    }, []);

    useEffect(async () => {
        const response = await getCirculatingSupply();
        setCirculatingSupply(Number(response.circulatingSupply));
    }, []);

    return (
        <div className="remain-token__value col-md-12 mx-auto">
            {loading? (
                <Skeleton />
            ): (
                <>
                    <div className="d-flex justify-content-between">
                        <p className="current-value d-flex flex-column flex-sm-row">
                            <span className="me-2">current cap</span>
                            {renderNumberFormat(currentCap, '', 2, false, '#23c865')}
                        </p>
                        <p className="end-value d-flex flex-column flex-sm-row align-items-end">
                            <span>Max supply</span>
                            <span className="ms-2 txt-green">1 Trillion</span>
                        </p>
                    </div>
                    <div className="timeframe-bar">
                        <div
                            className="timeleft"
                            style={{
                                width: `${barProgress}%`,
                                background:
                                    "linear-gradient(270deg, #FFFFFF 0%, #77DDA0 31.34%, #23C865 64.81%)",
                            }}
                        >
                            <div className="timeleft__value">
                                Round &nbsp;
                                <span className="txt-green">
                                    {totalRounds}
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};