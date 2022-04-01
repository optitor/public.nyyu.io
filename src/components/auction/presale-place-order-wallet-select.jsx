import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { navigate } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMutation } from "@apollo/client"

import { useAuction } from "../../providers/auction-context"
import { setBidInfo, setCurrentRound } from "../../redux/actions/bidAction"
import { PLACE_PRESALE_ORDER } from "../../apollo/graphqls/mutations/Bid"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import CustomSpinner from "../common/custom-spinner"
import { externalWallets } from "../../utilities/staticData"
import { ROUTES } from "../../utilities/routes"
import { validURL } from "../../utilities/string"
import { setPresaleOrderId } from '../../redux/actions/bidAction' 

export default function PresalePlaceOrderWalletSelect() {
    const auction = useAuction()
    const dispatch = useDispatch()
    const { setPresalePlaceOrderStage, optCurrentRound, presaleNdbAmount } = auction
    const [error, setError] = useState("")
    const [reqPending, setReqPending] = useState(false)
    const [selectedWallet, setSelectedWallet] = useState(null)
    const [externalUrl, setExternalUrl] = useState("")
    const [urlError, setUrlError] = useState(null)

    function handleSelectWallet(selection) {
        if (selection === "internal") {
            setSelectedWallet(1)
        } else if (selection === "external") {
            setSelectedWallet(2)
        }
    }

    const [placePresaleOrderMutation] = useMutation(PLACE_PRESALE_ORDER, {
        onCompleted: data => {
            // console.log(data.placePreSaleOrder)
            if(data.placePreSaleOrder) {
                dispatch(setPresaleOrderId(data.placePreSaleOrder?.id))
                navigate(ROUTES.payment)
            }
            setReqPending(false)
        },
        onError: (err) => {
            setError(err.message)
            setReqPending(false)
        },
    })

    const handlePresale = () => {
        if (selectedWallet === 2 && !validURL(externalUrl)) {
            setUrlError(true)
            return
        }
        setReqPending(true)
        setError("")
        placePresaleOrderMutation({
            variables: {
                presaleId: optCurrentRound?.id,
                ndbAmount: presaleNdbAmount,
                destination: selectedWallet === 2 ? 2 : 1,
                extAddr: selectedWallet === 2 ? externalUrl : ""
            },
        })
        dispatch(setBidInfo(Number(optCurrentRound?.tokenPrice * presaleNdbAmount)))
        dispatch(setCurrentRound(optCurrentRound?.id))
    }

    return (
        <div className="my-30px mx-40px">
            <div className="w-100 d-flex justify-content-center align-items-center position-relative text-white fw-700 fs-30px">
                SELECT DESTINATION WALLET
                <div className="position-absolute top-0px left-0px">
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="left-arrow cursor-pointer text-light"
                        size="xs"
                        onClick={() => setPresalePlaceOrderStage(0)}
                    />
                </div>
            </div>
            <div className="row mt-25px">
                <div className="col-sm-6">
                    <div className={`select-internal-wallet ${selectedWallet === 1 ? "internal-wallet" : ""}`} onClick={() => handleSelectWallet("internal")}>
                        NDB WALLET
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className={`select-external-wallet ${selectedWallet === 2 ? "external-wallet" : ""}`} onClick={() => handleSelectWallet("external")}>
                        EXTERNAL WALLET
                    </div>
                </div>
            </div>

            <div className="wallet-content">
                {selectedWallet === 2 && <>
                    <div className="row">
                        {externalWallets.map((item, key) => (
                            <div
                                className="col-sm-6"
                                key={key}
                                role="presentation"
                            >
                                <div className="d-flex flex-column justify-content-center align-items-center border-dimgray pt-20px pb-20px mt-10px">
                                    <img src={item.icon} alt="wallet icon" className="wallet-icon" />
                                    <p>{item.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-100 d-flex align-items-center mt-10px">
                        <span>External Wallet Address</span>
                        <input
                            type="text"
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                            className={`url-input ${externalUrl && urlError ? "url-error-input" : ""}`}
                            placeholder="Please place external address"
                        />
                    </div>
                </>}
            </div>
            <div className="custom-checkbox pb-10px">
                <input type="checkbox" id="cb1"/>
                <label className="custom-control-label" htmlFor="cb1">Remember my selection</label>
            </div>
            {error && (
                <div className="mt-1 mb-2">
                    <div className="d-flex align-items-center gap-2">
                        <svg
                            className="icon-23px text-danger"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-danger fw-500 text-[#959595]">
                            {error}
                        </p>
                    </div>
                </div>
            )}
            <button
                className="btn btn-outline-light rounded-0 text-uppercase w-100 fw-bold py-12px fs-20px"
                onClick={handlePresale}
                disabled={reqPending && !selectedWallet}
            >
                <div className="d-flex align-items-center justify-content-center gap-3">
                    {reqPending && <CustomSpinner />}
                    GO TO PAYMENT
                </div>
            </button>
        </div>
    )
}
