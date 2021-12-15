import React from "react"

export default function DressupHorizontalList({ list, title, selectedItem, setSelectedItem }) {
    return (
        <div className="row m-0">
            <div className="mb-2 ps-0">{title}</div>
            <div className="row me-4 dressup-modal-items-horizontal-list border-top border-start border-bottom">
                {list.map((item) => {
                    return (
                        <div
                            onClick={() => setSelectedItem(item.index)}
                            style={{
                                marginTop: "-1px",
                                marginBottom: "-1px",
                            }}
                            className={`col-3 p-3 d-inline-block float-none border border-3 text-center cursor-pointer ${
                                selectedItem == item.index ? "border-success" : "border-transparent"
                            }`}
                        >
                            <img src={item.icon} className="img-fluid" alt="Avatar" />
                            <div className="pt-3">
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
