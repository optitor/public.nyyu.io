import React, {useState, useEffect} from "react"
import { TabPanel } from "react-tabs"
import { useQuery, useMutation } from "@apollo/client"
import Switch from "react-switch"
import { GET_NOTIFICATIONS } from "../../apollo/graghqls/querys/Notification"
import { USER_NOTIFICATION_SETTING } from "../../apollo/graghqls/mutations/Notification"
  
const NOTIFICATION_PAGE_LIMIT = 10

export default function NotificationRecent() {

    const [last, setLast] = useState(null)

    const { data: ntf_list } = useQuery(GET_NOTIFICATIONS, {
        variables: { 
            stamp: last,
            limit: NOTIFICATION_PAGE_LIMIT
        },
    })
    const ntfList = ntf_list?.getNotifications

    return (
        <>
            {ntfList && ntfList.map((item, idx) => (
                <div className="recent-item" key={idx}>
                    <div
                        className={
                            item?.status
                                ? "status active"
                                : "status deactive"
                        }
                    ></div>
                    <p>{item?.act}</p>
                </div>
            ))}
        </>
    )
}
