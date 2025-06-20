import React, { useState, useEffect, useReducer } from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import Modal from "react-modal"
import Select from "react-select"
import parse from "html-react-parser"
import styled from "styled-components"
import { DressupData } from "../../utilities/dressup-data"
import { CloseIcon, EmptyAvatar, EmptyBlackAvatar } from "../../utilities/imgImport"
import DressupHorizontalList from "./dressup-user-horizontal-list"
import { hairColors, SkinColors } from "./dressup-data"
import { Tab, TabList } from "react-tabs";

const init = {
    hairStyles: { index: 0, updatable: false },
    facialStyles: { index: 0, updatable: false },
    expressions: { index: 0, updatable: false },
    hats: { index: 0, updatable: false },
    others: { index: 0, updatable: false },
    hairColors: { index: 0, updatable: false },
};

export default function DressupModal({ isModalOpen, setIsModalOpen, onSave }) {
    const avatarComponents = useSelector((state) => state.avatarComponents)
    const selected = useSelector((state) => state.auth?.user?.avatar?.selected)
    const hairColor = useSelector((state) => state.auth?.user?.avatar?.hairColor)
    const skinColor = useSelector((state) => state.auth?.user?.avatar?.skinColor)


    let { loaded, hairStyles, facialStyles, expressions, hats, others } = avatarComponents
    // Convert the mapKey Object to the array.
    hairStyles = Object.values(hairStyles)
    facialStyles = Object.values(facialStyles)
    expressions = Object.values(expressions)
    hats = Object.values(hats)
    others = Object.values(others)

    const [state, setState] = useReducer((old, action) => ({ ...old, ...action }), init)

    const [selectedTab, setSelectedTab] = useState(0)

    useEffect(() => {
        if (!isModalOpen) return
        const avatar = JSON.parse(selected ?? "[]")
        const avatarSet = _.mapKeys(avatar, "groupId")

        const newState = Object.keys(init).map((key) => {
            let index = Object.values(avatarComponents[key] ?? {}).findIndex(
                (i) => i?.compId === avatarSet?.[key.slice(0, -1)]?.compId
            )
            if(key === 'hairColors') {
                index = hairColors?.findIndex(item => item === hairColor);
                return { key, index, updatable: true };
            }
            return { key, index, updatable: index >= 0 }
        })

        const s = _.mapKeys(newState, "key")
        setState(s)
    }, [isModalOpen, selected, avatarComponents, hairColor])

    const saveAvatarItems = () => {
        const avatarSets = Object.keys(avatarComponents)
            .filter((key) => state[key]?.updatable ?? false)
            .map((key) => {
                const index = state[key].index
                return {
                    groupId:
                        Object.values(avatarComponents[key])[index]?.groupId ?? key.slice(0, -1),
                    compId: Object.values(avatarComponents[key])[index]?.compId ?? 0,
                }
            })
        if (!!avatarSets.length) {
            onSave({
                components: avatarSets,
                hairColor: hairColors[selectedHairColor],
                skinColor: selectedSkinColor.value
            });
        }
        setIsModalOpen(false)
    }

    const closeModal = () => {
        setState(init)
        setIsModalOpen(false)
    };

    const selectedHairColor =  state.hairColors?.index ?? 0
    const selectedHairStyle = state.hairStyles?.index ?? 0
    const selectedFacialStyle = state.facialStyles?.index ?? 0
    const selectedHat = state.hats?.index ?? 0
    const selectedExpression = state.expressions?.index ?? 0
    const selectedOther = state.others?.index ?? 0
    const [selectedSkinColor, setSelectedSkinColor] = useState(skinColor === 'black'? SkinColors[1]: SkinColors[0]);

    const saveButtonActive =
        state.hairStyles?.updatable &&
        state.facialStyles?.updatable &&
        state.expressions?.updatable &&
        state.hats?.updatable &&
        state.others?.updatable

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            ariaHideApp={false}
            className="dress-up-modal"
            overlayClassName="dress-up-modal__overlay"
        >
            <div className="dress-up-modal__header">
                <div
                    onClick={closeModal}
                    onKeyDown={closeModal}
                    role="button"
                    tabIndex="0"
                    className="close"
                >
                    <img
                        width="14px"
                        height="14px"
                        src={CloseIcon}
                        className="mt-3 me-3"
                        alt="close"
                    />
                </div>
            </div>

            <div className="row m-0 py-4 text-white">
                <div className="col-sm-4">
                    <div className="row">
                        <div className="profile">
                            <div className="image_div">
                                <img src={selectedSkinColor.value === 'black' ? EmptyBlackAvatar: EmptyAvatar} alt="back" />
                                {loaded && (
                                    <>
                                        <Hair
                                            hairColor={hairColors[selectedHairColor]}
                                            style={{
                                                top: `${hairStyles[selectedHairStyle]?.top}%`,
                                                left: `${hairStyles[selectedHairStyle]?.left}%`,
                                                width: `${hairStyles[selectedHairStyle]?.width}%`,
                                            }}
                                        >
                                            {parse(hairStyles[selectedHairStyle]?.svg ?? "")}
                                        </Hair>
                                        <div
                                            style={{
                                                top: `${facialStyles[selectedFacialStyle]?.top}%`,
                                                left: `${facialStyles[selectedFacialStyle]?.left}%`,
                                                width: `${facialStyles[selectedFacialStyle]?.width}%`,
                                            }}
                                        >
                                            {parse(facialStyles[selectedFacialStyle]?.svg ?? "")}
                                        </div>
                                        <div
                                            style={{
                                                top: `${expressions[selectedExpression]?.top}%`,
                                                left: `${expressions[selectedExpression]?.left}%`,
                                                width: `${expressions[selectedExpression]?.width}%`,
                                            }}
                                        >
                                            {parse(expressions[selectedExpression]?.svg ?? "")}
                                        </div>
                                        <div
                                            style={{
                                                top: `${hats[selectedHat]?.top}%`,
                                                left: `${hats[selectedHat]?.left}%`,
                                                width: `${hats[selectedHat]?.width}%`,
                                            }}
                                        >
                                            {parse(hats[selectedHat]?.svg ?? "")}
                                        </div>
                                        <div
                                            style={{
                                                top: `${others[selectedOther]?.top}%`,
                                                left: `${others[selectedOther]?.left}%`,
                                                width: `${others[selectedOther]?.width}%`,
                                            }}
                                        >
                                            {parse(others[selectedOther]?.svg ?? "")}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="w-50 m-auto mb-1 fw-bold">SKIN COLOR</p>
                            <Select
                                className='black_input w-50 m-auto'
                                value={selectedSkinColor}
                                onChange={selected => setSelectedSkinColor(selected)}
                                options={SkinColors}
                                styles={customSelectStyles}
                                isSearchable={false}
                            />
                        </div>
                        <div className="d-none d-sm-block">
                            <div className="dress-up-modal-sections-list">
                                {DressupData.tabs.map((item) => (
                                    <div
                                        onClick={() => setSelectedTab(item.index)}
                                        onKeyDown={() => setSelectedTab(item.index)}
                                        role="presentation"
                                        key={item.index}
                                        className={`${item.index === selectedTab && "active"}`}
                                    >
                                        {item.title}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <button
                                    className={`btn btn-outline-light rounded-0 px-5 py-2 fw-bold text-uppercase ${
                                        !saveButtonActive && "btn-secondary"
                                    } ms-4`}
                                    onClick={saveAvatarItems}
                                    disabled={!saveButtonActive}
                                >
                                    save
                                </button>
                            </div>
                        </div>
                        <div className="d-block d-sm-none">
                            <TabList>
                                {DressupData.tabs.map(item => (
                                    <Tab
                                        onClick={() => setSelectedTab(item.index)}
                                        onKeyDown={() => setSelectedTab(item.index)}
                                        key={item.index}
                                        selected={selectedTab === item.index}
                                    >
                                        <div className="pt-3">
                                            {item.title}
                                        </div>
                                    </Tab>
                                ))}
                            </TabList>
                        </div>
                    </div>
                </div>
                <div className="col-sm-8 components">
                    {loaded && selectedTab === 0 && (
                        <div className="dress-up-modal-hair-section">
                            <DressupHorizontalList
                                topic="hairStyle"
                                title={"hair style"}
                                list={hairStyles}
                                selectedItem={selectedHairStyle}
                                setSelectedItem={(res) => setState({ hairStyles: res })}
                            />
                            <div className="mt-4"></div>
                            <DressupHorizontalList
                                topic="hairColors"
                                title={"hair color"}
                                hairStyle={selectedHairStyle}
                                hairStyles={hairStyles}
                                list={hairColors}
                                selectedItem={selectedHairColor}
                                setSelectedItem={(res) => setState({ hairColors: res })}
                                secondRow
                            />
                        </div>
                    )}
                    {loaded && selectedTab === 1 && (
                        <div className="dress-up-modal-hair-section">
                            <DressupHorizontalList
                                topic="facialStyle"
                                title={"facial style"}
                                list={facialStyles}
                                selectedItem={selectedFacialStyle}
                                setSelectedItem={(res) => setState({ facialStyles: res })}
                            />
                            <div className="mt-4"></div>
                            <DressupHorizontalList
                                topic="expression"
                                title={"expressions"}
                                list={expressions}
                                selectedItem={selectedExpression}
                                setSelectedItem={(res) => setState({ expressions: res })}
                                secondRow
                            />
                        </div>
                    )}
                    {loaded && selectedTab === 2 && (
                        <div className="dress-up-modal-hair-section">
                            <DressupHorizontalList
                                topic="hat"
                                title={"hats"}
                                list={hats}
                                selectedItem={selectedHat}
                                setSelectedItem={(res) => setState({ hats: res })}
                            />
                            <div className="mt-4"></div>
                            <DressupHorizontalList
                                topic="other"
                                title={"others"}
                                list={others}
                                selectedItem={selectedOther}
                                setSelectedItem={(res) => setState({ others: res })}
                                secondRow
                            />
                        </div>
                    )}
                    <div className="d-block d-sm-none">
                        <button
                            className={`btn btn-outline-light rounded-0 px-5 py-2 fw-bold text-uppercase w-100 mt-4 ${
                                !saveButtonActive && "btn-secondary"
                            }`}
                            onClick={saveAvatarItems}
                            disabled={!saveButtonActive}
                        >
                            save
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

const Hair = styled.div`
    svg > path {
        fill: ${(props) => {
            return props.hairColor ? props.hairColor : "#626161"
        }};
    }
`

const customSelectStyles = {
    option: (provided, state) => ({
        ...provided,
        color: "white",
        backgroundColor: state.isSelected ? "#23c865" : undefined,
        fontSize: 14,
        borderBottom: "1px solid dimgrey",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "inherit",
        },
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "none",
        borderRadius: 0,
        height: 40,
        cursor: "pointer",
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "1px solid white",
        borderRadius: 0,
    }),
    menuList: (provided) => ({
        ...provided,
        margin: 0,
        padding: 0,
        borderRadius: 0,
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: 0,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white",
        marginLeft: 10,
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "dimgrey",
    }),
};