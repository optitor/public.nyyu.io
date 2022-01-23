import React from "react"
import { useSelector } from "react-redux"
import AvatarImage from "../admin/shared/AvatarImage"

export default function Avatar() {
    const selected = useSelector((state) => state.auth?.user?.avatar?.selected)

    const avatar = JSON.parse(selected ?? "[]")
    // console.log("avatarset", avatar)

    return <AvatarImage avatar={{ avatarSet: avatar }} />
}
