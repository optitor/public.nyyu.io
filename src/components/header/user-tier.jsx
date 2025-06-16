import { useQuery } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_USER_TIERS } from "../profile/profile-queries";
import { fillUserTiers } from "../../store/actions/userTierAction";

export default function UserTier() {
    // Containers
    const userData = useSelector((state) => state.auth?.user);
    const [userTiersData, setUserTiersData] = useState(null);
    // Methods
    const dispatch = useDispatch();

    // Webservice
    const { loading: userTiersLoading } = useQuery(GET_USER_TIERS, {
        onCompleted: (data) => {
            setUserTiersData(data?.getUserTiers);
            dispatch(fillUserTiers(data?.getUserTiers));
        },
    });
    // Render
    if (userTiersLoading) return <></>;
    else
        return (
            <div
                className="header-avatar-user-tier"
                dangerouslySetInnerHTML={{
                    __html: userTiersData?.filter(
                        (item) => item?.level === userData?.tierLevel,
                    )[0]?.svg,
                }}
            />
        );
}
