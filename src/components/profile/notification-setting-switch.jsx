import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client"
import Switch from "react-switch"
import { GET_NOTICATION_TYPES } from "../../apollo/graghqls/querys/Notification"
import { USER_NOTIFICATION_SETTING } from "../../apollo/graghqls/mutations/Notification"
import { GET_USER } from "../../apollo/graghqls/querys/Auth"

import { COLOR_LOAD, COLOR_OFF, COLOR_ON } from "../../utilities/staticData"
import CustomSpinner from "../common/custom-spinner"

export default function NotificationSetting() {
    //Webservice
    const { data: user_data, refetch } = useQuery(GET_USER)
    const { data: notificationTypes } = useQuery(GET_NOTICATION_TYPES, {
        fetchPolicy: "network-only",
        onCompleted: () => setLoadingSection(false),
    })
    const [changeNotifySetting] = useMutation(USER_NOTIFICATION_SETTING, {
        onCompleted: (data) => {
            resetLoading(data.changeNotifySetting)
            refetch()
        },
    })

    // Containers
    const [loadingSection, setLoadingSection] = useState(true)
    const setting = user_data?.getUser.notifySetting
    const [tempSetting, setTempSetting] = useState([])
    const ntfTypeList = notificationTypes?.getNotificationTypes

    // Methods
    const setChecked = (i) => {
        const cList = tempSetting.slice()
        cList[i].status = !cList[i].status
        cList[i].loading = true
        setTempSetting(cList)

        changeNotifySetting({
            variables: {
                nType: Number(cList[i].index),
                status: cList[i].status,
            },
        })
    }
    const resetLoading = (nType) => {
        const cList = tempSetting.slice()
        const idx = cList.findIndex((c) => c.index === nType)
        cList[idx].loading = false
        setTempSetting(cList)
    }
    useEffect(() => {
        setTempSetting(
            ntfTypeList
                ? ntfTypeList.map((n) => {
                      return {
                          index: n.index,
                          type: n.type,
                          status: (setting & (1 << n.type)) > 0,
                          loading: false,
                      }
                  })
                : []
        )
    }, [setting, ntfTypeList])

    // Render
    if (loadingSection)
        return (
            <div className="d-flex justify-content-center my-5">
                <CustomSpinner />
            </div>
        )
    else
        return (
            <>
                {ntfTypeList &&
                    ntfTypeList.map(({ type }, index) => (
                        <div className="notification-item" key={index}>
                            <p>{type}</p>
                            <Switch
                                onColor={tempSetting[index]?.loading ? COLOR_LOAD : COLOR_ON}
                                offColor={tempSetting[index]?.loading ? COLOR_LOAD : COLOR_OFF}
                                height={3}
                                width={35}
                                handleDiameter={12}
                                onHandleColor={tempSetting[index]?.loading ? COLOR_LOAD : COLOR_ON}
                                offHandleColor={
                                    tempSetting[index]?.loading ? COLOR_LOAD : COLOR_OFF
                                }
                                onChange={() => setChecked(index)}
                                checked={tempSetting[index]?.status ? true : false}
                            />
                        </div>
                    ))}
            </>
        )
}
