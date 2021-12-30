import React, { useState, useEffect } from "react"
import { useQuery } from "@apollo/client"
import { GET_NOTIFICATIONS } from "../../apollo/graghqls/querys/Notification"
import CustomSpinner from "../common/custom-spinner"

const NOTIFICATION_PAGE_LIMIT = 8

export default function NotificationRecent() {
    const [last, setLast] = useState(null)

    const [data, setData] = useState([])

    const { data: ntf_list, loading } = useQuery(GET_NOTIFICATIONS, {
        variables: {
            stamp: last?.timeStamp,
            limit: NOTIFICATION_PAGE_LIMIT,
        },
    })

    const ntfList = ntf_list?.getNotifications

    useEffect(() => {
        if (!ntfList) return
        setData((d) => [...d, ...ntfList])
    }, [ntfList])

    const disable = data.length > 0 && !last

    const loadMore = () => {
        disable && setLast(ntfList ? ntfList.slice(-1)[0] : null)
    }

    return (
        <>
            <div className="recent-notification-wrapper">
                {data &&
                    data.map((item, idx) => (
                        <div className="recent-item" key={idx}>
                            <div className={item?.read ? "status deactive" : "status active"}></div>
                            <p>{item?.msg}</p>
                        </div>
                    ))}
            </div>
            <div className="w-100 d-flex flex-column align-items-center justify-content-center position-absolute mx-auto py-5">
                <button
                    className="btn-primary d-flex align-items-center justify-content-center py-2"
                    onClick={(e) => loadMore()}
                >
                    <div className={`${loading ? "opacity-1" : "opacity-0"}`}>
                        <CustomSpinner />
                    </div>
                    <div className={`${loading ? "ms-3" : "pe-4"}`}>Load More</div>
                </button>
            </div>
        </>
    )
}
