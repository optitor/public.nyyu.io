import React from "react"
import { useSelector } from "react-redux"
import parse from "html-react-parser"
import styled from "styled-components"
import { EmptyAvatar } from "../../utilities/imgImport"
import { hairColors } from "./dressup-data"
import _ from "lodash"

export default function Avatar() {
    const avatarComponents = useSelector((state) => state.avatarComponents)
    const userAvatarJSON = useSelector((state) => state.auth?.user?.avatar?.selected)

    let expression, facialStyle, hairStyle, hat, other, hairColor
    try {
        const avatar = JSON.parse(userAvatarJSON)
        const avatarSet = _.mapValues(_.mapKeys(avatar, "groupId"), "compId")

        console.log("avatarset", avatarSet)

        expression = avatarSet?.expression ?? 0
        facialStyle = avatarSet?.facialStyle ?? 0
        hairStyle = avatarSet?.hairStyle ?? 0
        hat = avatarSet?.hat ?? 0
        other = avatarSet?.other ?? 0
        hairColor = avatarSet?.hairColor ?? 0
    } catch (e) {
        console.log(e)
    }

    let { loaded, hairStyles, facialStyles, expressions, hats, others } = avatarComponents

    return (
        <div className="avatar-component">
            <div className="image_div">
                <img src={EmptyAvatar} alt="back" />
                {loaded && (
                    <>
                        <Hair
                            hairColor={hairColors[hairColor]}
                            style={{
                                top: `${hairStyles[hairStyle]?.top}%`,
                                left: `${hairStyles[hairStyle]?.left}%`,
                                width: `${hairStyles[hairStyle]?.width}%`,
                            }}
                        >
                            {parse(hairStyles[hairStyle]?.svg ?? "")}
                        </Hair>
                        <div
                            style={{
                                top: `${expressions[expression]?.top}%`,
                                left: `${expressions[expression]?.left}%`,
                                width: `${expressions[expression]?.width}%`,
                            }}
                        >
                            {parse(expressions[expression]?.svg ?? "")}
                        </div>
                        <div
                            style={{
                                top: `${facialStyles[facialStyle]?.top}%`,
                                left: `${facialStyles[facialStyle]?.left}%`,
                                width: `${facialStyles[facialStyle]?.width}%`,
                            }}
                        >
                            {parse(facialStyles[facialStyle]?.svg ?? "")}
                        </div>
                        <div
                            style={{
                                top: `${hats[hat]?.top}%`,
                                left: `${hats[hat]?.left}%`,
                                width: `${hats[hat]?.width}%`,
                            }}
                        >
                            {parse(hats[hat]?.svg ?? "")}
                        </div>
                        <div
                            style={{
                                top: `${others[other]?.top}%`,
                                left: `${others[other]?.left}%`,
                                width: `${others[other]?.width}%`,
                            }}
                        >
                            {parse(others[other]?.svg ?? "")}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const Hair = styled.div`
    svg > path {
        fill: ${(props) => {
            return props.hairColor ? props.hairColor : "#626161"
        }};
    }
`
