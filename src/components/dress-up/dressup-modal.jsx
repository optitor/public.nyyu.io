import React, { useState } from "react";
import { useSelector } from "react-redux";
import Modal from "react-modal"
import Select from 'react-select';
import parse from 'html-react-parser'
import styled from "styled-components"
import { DressupData } from "../../utilities/dressup-data"
import { CloseIcon, EmptyAvatar, EmptyBlackAvatar } from "../../utilities/imgImport"
import DressupHorizontalList from "./dressup-horizontal-list"
import { hairColors, SkinColors } from './dressup-data';
import { TabList, Tab } from 'react-tabs';

export default function DressupModal({ isModalOpen, setIsModalOpen, setDressUpAvatarItems}) {
    const avatarComponents = useSelector(state => state.avatarComponents);
    let { loaded, hairStyles, facialStyles, expressions, hats, others } = avatarComponents;
    // Convert the mapKey Object to the array.
    hairStyles = Object.values(hairStyles);
    facialStyles = Object.values(facialStyles);
    expressions = Object.values(expressions);
    hats = Object.values(hats);
    others = Object.values(others);

    const [selectedHairStyle, setSelectedHairStyle] = useState(0)
    const [selectedHairColor, setSelectedHairColor] = useState(0)
    const [selectedSkinColor, setSelectedSkinColor] = useState(SkinColors[0]);
    const [selectedFacialStyle, setSelectedFacialStyle] = useState(0)
    const [selectedExpression, setSelectedExpression] = useState(0)
    const [selectedHat, setSelectedHat] = useState(0)
    const [selectedOther, setSelectedOther] = useState(0)

    const [selectedTab, setSelectedTab] = useState(0)

    const saveAvatarItems = () => {
        setDressUpAvatarItems({
            hairStyle: hairStyles[selectedHairStyle]?.compId,
            facialStyle: facialStyles[selectedFacialStyle]?.compId,
            expression: expressions[selectedExpression]?.compId,
            hat: hats[selectedHat]?.compId,
            other: others[selectedOther]?.compId,
            hairColor: hairColors[selectedHairColor],
            skinColor: selectedSkinColor.value
        });
        setIsModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    
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
                                <img src={selectedSkinColor.value === 'black'? EmptyBlackAvatar: EmptyAvatar} alt="back" />
                                {loaded && (<>
                                    <Hair
                                        hairColor={hairColors[selectedHairColor]}
                                        style={{
                                            top: `${hairStyles[selectedHairStyle]?.top}%`,
                                            left: `${hairStyles[selectedHairStyle]?.left}%`,
                                            width: `${hairStyles[selectedHairStyle]?.width}%`
                                        }}
                                    >
                                        {parse(hairStyles[selectedHairStyle]?.svg ?? "")}
                                    </Hair>
                                    <div style={{
                                        top: `${expressions[selectedExpression]?.top}%`,
                                        left: `${expressions[selectedExpression]?.left}%`,
                                        width: `${expressions[selectedExpression]?.width}%`}}
                                    >
                                        {parse(expressions[selectedExpression]?.svg ?? "")}
                                    </div>
                                    <div style={{top: `${facialStyles[selectedFacialStyle]?.top}%`,
                                        left: `${facialStyles[selectedFacialStyle]?.left}%`,
                                        width: `${facialStyles[selectedFacialStyle]?.width}%`}}
                                    >
                                        {parse(facialStyles[selectedFacialStyle]?.svg ?? "")}
                                    </div>
                                    <div style={{top: `${hats[selectedHat]?.top}%`,
                                        left: `${hats[selectedHat]?.left}%`,
                                        width: `${hats[selectedHat]?.width}%`}}
                                    >
                                        {parse(hats[selectedHat]?.svg ?? "")}
                                    </div>
                                    <div style={{top: `${others[selectedOther]?.top}%`, 
                                        left: `${others[selectedOther]?.left}%`,
                                        width: `${others[selectedOther]?.width}%`}}
                                    >
                                        {parse(others[selectedOther]?.svg ?? "")}
                                    </div>
                                </>)}
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
                            <button className="btn-save" onClick={saveAvatarItems}>save</button>
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
                                topic="hairStyles"
                                title={"hair style"}
                                list={hairStyles}
                                selectedItem={selectedHairStyle}
                                setSelectedItem={setSelectedHairStyle}
                            />
                            <div className="mt-4"></div>
                            <DressupHorizontalList
                                topic="hairColors"
                                title={"hair color"}
                                hairStyle={selectedHairStyle}
                                hairStyles={hairStyles}
                                list={hairColors}
                                selectedItem={selectedHairColor}
                                setSelectedItem={setSelectedHairColor}
                                secondRow
                            />
                        </div>
                    )}
                    {loaded && selectedTab === 1 && (
                        <div className="dress-up-modal-hair-section">
                            <DressupHorizontalList
                                topic="facialStyles"
                                title={"facial style"}
                                list={facialStyles}
                                selectedItem={selectedFacialStyle}
                                setSelectedItem={setSelectedFacialStyle}
                            />
                            <div className="mt-4"></div>
                            <DressupHorizontalList
                                topic="expressions"
                                title={"expressions"}
                                list={expressions}
                                selectedItem={selectedExpression}
                                setSelectedItem={setSelectedExpression}
                                secondRow
                            />
                        </div>
                    )}
                    {loaded && selectedTab === 2 && (
                        <div className="dress-up-modal-hair-section">
                            <DressupHorizontalList
                                topic="hats"
                                title={"hats"}
                                list={hats}
                                selectedItem={selectedHat}
                                setSelectedItem={setSelectedHat}
                            />
                            <div className="mt-4"></div>
                            <DressupHorizontalList
                                topic="others"
                                title={"others"}
                                list={others}
                                selectedItem={selectedOther}
                                setSelectedItem={setSelectedOther}
                                secondRow
                            />
                        </div>
                    )}
                    <div className="d-block d-sm-none">
                        <button
                            className={`btn btn-outline-light rounded-0 px-5 py-2 fw-bold text-uppercase w-100 mt-4`}
                            onClick={saveAvatarItems}
                        >
                            save
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    )
};

const Hair = styled.div`
    svg>path {
        fill: ${props => {
            return props.hairColor? props.hairColor: '#626161';
        }}
    }
`;

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
