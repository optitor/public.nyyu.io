import React from "react"
import { useState } from "react"
import Modal from "react-modal"
import { CloseIcon } from "../../utilities/imgImport"

export default function QualifyModal({ isOpen, setIsOpen }) {
    const [socialMedias, setSocialMedias] = useState([
        {
            id: 0,
            todo: "Follow our Twitter",
            cta: "follow",
            status: true,
        },
        {
            id: 1,
            todo: "Retweet our post",
            cta: "retweet",
            status: false,
        },
        {
            id: 2,
            todo: "Follow our Linked",
            cta: "follow",
            status: false,
        },
        {
            id: 3,
            todo: "Share our latest Linkedin post",
            cta: "share",
            status: false,
        },
    ])
    const completeTodo = (id) => {
        const fooArray = socialMedias
        fooArray[id].status = true
        setSocialMedias([...fooArray])
    }
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="support-modal border-0 p-5"
            overlayClassName="support-modal__overlay"
        >
            <div className="support-modal__header">
                <div className="text-uppercase fw-bold">
                    <div className="d-flex align-items-center">
                        <div className="gray-circle me-2"></div>
                        <div className="fs-22px">qualify first</div>
                    </div>
                </div>
                <div
                    onClick={() => setIsOpen(false)}
                    onKeyDown={() => setIsOpen(false)}
                    role="button"
                    tabIndex="0"
                >
                    <img
                        width="14px"
                        height="14px"
                        src={CloseIcon}
                        alt="close"
                    />
                </div>
            </div>
            <div>
                <div className="mt-3">
                    {socialMedias.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className="d-flex justify-content-between align-items-center text-light border-bottom border-2 border-secondary py-4"
                            >
                                <div className="text-14px col-lg-9">
                                    {item.todo}
                                </div>
                                <div className="col-lg-3">
                                    {item.status ? (
                                        <div className="fw-bold text-success fs-15px text-center text-uppercase">
                                            completed
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                completeTodo(item.id)
                                            }
                                            className="btn btn-success rounded-0 px-55px py-2 text-uppercase fw-bold text-light w-100"
                                        >
                                            {item.cta}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="text-center mt-5">
                    <button className="btn btn-outline-light text-uppercase fw-bold rounded-0 mx-auto py-3 px-100px">
                        next
                    </button>
                </div>
            </div>
        </Modal>
    )
}
