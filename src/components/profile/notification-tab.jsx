import React, {useState, useEffect} from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { useQuery, useMutation } from "@apollo/client"
import Switch from "react-switch"
import { GET_NOTICATION_TYPES } from "../../apollo/graghqls/querys/Notification"
import { USER_NOTIFICATION_SETTING } from "../../apollo/graghqls/mutations/Notification"

import { recentNotifications, COLOR_LOAD, COLOR_OFF, COLOR_ON } from "../../utilities/staticData"

export default function NotificationTab({setting}) {

    const { data : ntf_type_result } = useQuery(GET_NOTICATION_TYPES)

    const [changeNotifySetting] = useMutation(USER_NOTIFICATION_SETTING, {
        onCompleted: (data) => {           
            console.log("notify setting result", data.changeNotifySetting)
            resetLoading(data.changeNotifySetting)
        },
        onError : (error)=> {
            console.log("notify setting Error", error)
        }
    })

    const [tempSetting, setTempSetting] = useState([])
    
    const ntfTypeList = ntf_type_result?.getNotificationTypes2
    
    useEffect(() => {
        setTempSetting(ntfTypeList ? ntfTypeList.map(n => {
            return { 
                type: n.nType, 
                status: (setting & (1 << n.nType)) > 0, // calc from int
                loading: false
            }
        }) : [])
    }, [setting, ntfTypeList])

    const setChecked = (i) => {
        const cList = tempSetting.slice() 
        cList[i].status = !cList[i].status
        cList[i].loading = true
        setTempSetting(cList)
        changeNotifySetting({
            variables: {
                nType: cList[i].type,
                status: cList[i].status
            }
        })
    }

    const resetLoading = (nType) => {
        const cList = tempSetting.slice()
        const idx =  cList.findIndex(c => c.type === nType)
        cList[idx].loading = false
        setTempSetting(cList)
    }

    return (
        <div className="notification-set">
        <Tabs className="notification-tab">
            <TabList>
                <Tab>Recent</Tab>
                <Tab>Setup</Tab>
            </TabList>
            <TabPanel>
                {recentNotifications.map((item, idx) => (
                    <div className="recent-item" key={idx}>
                        <div
                            className={
                                item.status
                                    ? "status active"
                                    : "status deactive"
                            }
                        ></div>
                        <p>{item.act}</p>
                    </div>
                ))}
            </TabPanel>
            <TabPanel>
                {ntfTypeList && ntfTypeList.map((ntf_type, i) => 
                    <div className="notification-item" key={i}>
                        <p>{ntf_type.tName}</p>
                        <Switch
                            // disabled
                            onColor={tempSetting[i]?.loading ? COLOR_LOAD : COLOR_ON}
                            offColor={tempSetting[i]?.loading ? COLOR_LOAD : COLOR_OFF}
                            height={3}
                            width={35}
                            handleDiameter={12}
                            onHandleColor={tempSetting[i]?.loading ? COLOR_LOAD : COLOR_ON}
                            onChange={() => setChecked(i)}
                            checked={tempSetting[i]?.status ? true : false}
                        />
                    </div>
                )}
            </TabPanel>
        </Tabs>
    </div>
    )
}
