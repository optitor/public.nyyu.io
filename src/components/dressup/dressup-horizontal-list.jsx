import React from "react"

export default function DressupHorizontalList({
    list,
    title,
    selectedItem,
    setSelectedItem,
    secondRow,
}) {
    const isScrollable = list.length > 3
    return (
        <div className="row m-0">
            <div className="mb-2 ps-0">{title}</div>
            <div
                className={`row me-4 dressup-modal-items-horizontal-list border-top border-bottom border-secondary border-1 ${
                    isScrollable ? "d-inline-block" : "d-auto"
                }`}
            >
                {list.map((item) => {
                    return (
                        <div
                            style={{
                                marginTop: "-1px",
                            }}
                            onClick={() => setSelectedItem(item.index)}
                            onKeyDown={() => setSelectedItem(item.index)}
                            role="presentation"
                            className={`border border-4 text-center cursor-pointer ${
                                selectedItem === item.index
                                    ? "border-success"
                                    : "border-transparent"
                            }`}
                        >
                            <img src={item.icon} alt="Avatar" />
                            <div>
                                {item.price}
                                <span className="text-success">{item.unit}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
