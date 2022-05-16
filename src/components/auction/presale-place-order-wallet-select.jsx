<<<<<<< HEAD
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { navigate } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMutation } from "@apollo/client"
import { Icon } from '@iconify/react'
import ReactTooltip from "react-tooltip"

import { useAuction } from "../../providers/auction-context"
import { setBidInfo, setCurrentRound } from "../../redux/actions/bidAction"
import { PLACE_PRESALE_ORDER } from "../../apollo/graphqls/mutations/Bid"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import CustomSpinner from "../common/custom-spinner"
import { CheckBox } from "../common/FormControl"
import { wallets, NDB_WALLET_TOOLTIP_CONTENT, EXTERNAL_WALLET_TOOLTIP_CONTENT } from "../../utilities/staticData"
import { ROUTES } from "../../utilities/routes"
import { validURL } from "../../utilities/string"
import { setPresaleOrderId } from '../../redux/actions/bidAction' 
import { NyyuWallet, NyyuWalletSelected } from "../../utilities/imgImport";
import { useAccount, useConnect } from "wagmi"

export default function PresalePlaceOrderWalletSelect() {
    // wagmi connect
    const { connect, connectors } = useConnect();
    const { data: accountInfo } = useAccount();

    const auction = useAuction()
    const dispatch = useDispatch()
    const { setPresalePlaceOrderStage, optCurrentRound, presaleNdbAmount } = auction
    const [error, setError] = useState("")
    const [reqPending, setReqPending] = useState(false)
    const [selectedWallet, setSelectedWallet] = useState(null)
    const [externalWallet, setExternalWallet] = useState(null)
    const [externalUrl, setExternalUrl] = useState("")
    const [urlError, setUrlError] = useState(null)


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
        // if (selectedWallet === 'external' && !validURL(externalUrl)) {
        //     setUrlError(true)
        //     return
        // }
        setReqPending(true)
        setError("")
        placePresaleOrderMutation({
            variables: {
                presaleId: optCurrentRound?.id,
                ndbAmount: presaleNdbAmount,
                destination: selectedWallet === 'external' ? 2 : 1,
                extAddr: selectedWallet === 'external' ? accountInfo?.address : ""
            },
        })
        dispatch(setBidInfo(Number(optCurrentRound?.tokenPrice * presaleNdbAmount)))
        dispatch(setCurrentRound(optCurrentRound?.id))
    }

    const handlePrevious = () => {
        if(selectedWallet === 'external') {
            setSelectedWallet(null);
            setExternalWallet(null)
            return;
        }
        setPresalePlaceOrderStage(0);
    }

    const shortFormatAddr = (addr) => {
        return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
    }

    return (
        <div className="my-30px mx-40px">
            <div className="w-100 d-flex justify-content-center align-items-center position-relative text-white fw-700 title">
                SELECT DESTINATION WALLET
                <div className="position-absolute top-0px left-0px fs-30px">
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="left-arrow cursor-pointer text-light"
                        size="xs"
                        onClick={handlePrevious}
                    />
                </div>
            </div>
            <div className="my-3 wallet_content">
                {selectedWallet === 'external'?
                    <>
                        <div className="row">
                            {connectors?.map((connector, idx) => (accountInfo && (accountInfo?.connector.name === connector.name)) ? (
                                <div className="col-lg-6 mb-10px" key={idx}>
                                    <div className="presale-connected external_wallet">
                                        <img src={wallets[accountInfo.connector.id]?.icon} alt="wallet icon" className="wallet-icon"/>
                                        <p>{shortFormatAddr(accountInfo.address)}</p>
                                    </div>
                                </div>
                            ) : ( 
                            <div
                                className="col-lg-6"
                                key={idx}
                                role="presentation"
                                onClick={() => connect(connector)}
                            >
                                <div className={`wallet-item  external_wallet ${!connector.ready && "inactive"}`}>
                                    <img src={wallets[connector.id]?.icon} alt="wallet icon" className="wallet-icon"/>
                                    <p>{connector.ready ? wallets[connector.id]?.short : "Not supported"}</p>
                                </div>
                            </div>))}
                        </div>
                    </>
                    :
                    <div className="row">
                        <div className="col-lg-6 mt-2">
                            <div className={`destination_wallet ${selectedWallet === 'internal'? 'selected_wallet': ''}`}
                                onClick={() => setSelectedWallet("internal")}
                            >
                                <div className="d-flex justify-content-end wallet_header">
                                    <span data-tip='tooltip' data-for='ndb_wallet_tooltip'>
                                        <Icon icon='bi:question-circle'/>
                                    </span>
                                    <ReactTooltip place="left" type="light" effect="solid" id='ndb_wallet_tooltip'>
                                        <div
                                            className="text-justify"
                                            style={{
                                                width: "200px",
                                            }}
                                        >
                                            {NDB_WALLET_TOOLTIP_CONTENT}
                                        </div>
                                    </ReactTooltip>
                                </div>
                                <div className="img_div">
                                    <img src={selectedWallet === 'internal'? NyyuWalletSelected: NyyuWallet} alt='nyyu wallet' />
                                </div>
                                <h4 className="text-center">
                                    NYYU WALLET
                                </h4>
                            </div>
                        </div>
                        <div className="col-lg-6 mt-2">
                            <div className={`destination_wallet`}
                                onClick={() => setSelectedWallet("external")}
                            >
                                <div className="d-flex justify-content-end wallet_header">
                                    <span data-tip='tooltip' data-for='external_wallet_tooltip'>
                                        <Icon icon='bi:question-circle'/>
                                    </span>
                                    <ReactTooltip place="left" type="light" effect="solid" id='external_wallet_tooltip'>
                                        <div
                                            className="text-justify"
                                            style={{
                                                width: "200px",
                                            }}
                                        >
                                            {EXTERNAL_WALLET_TOOLTIP_CONTENT}
                                        </div>
                                    </ReactTooltip>
                                </div>
                                <div className="img_div">
                                    <Icon icon='carbon:wallet' />
                                </div>
                                <h4 className="text-center">
                                    EXTERNAL WALLET
                                </h4>
                            </div>
                        </div>
                    </div>
                }
            </div>
            
            <div className="custom-checkbox pb-10px d-flex align-items-center ">
                <CheckBox
                    type="checkbox"
                    name="allow_fraction"
                    // value={}
                    // onChange={handleAllowFraction}
                    id='remember_select_wallet'
                />
                <label className="custom-control-label" htmlFor="remember_select_wallet">Remember my selection</label>
            </div>
            {error && (
                <div className="mt-1 mb-2">
                    <div className="d-flex align-items-center gap-2">
                        <Icon className="icon-23px text-danger" icon='bx:error-circle' />
                        <p className="text-danger fw-500 text-[#959595]">
                            {error}
                        </p>
                    </div>
                </div>
            )}
            <button
                className="btn btn-outline-light rounded-0 text-uppercase w-100 fw-bold py-12px fs-20px"
                onClick={handlePresale}
                disabled={reqPending || !selectedWallet}
            >
                <div className="d-flex align-items-center justify-content-center gap-3">
                    {reqPending && <CustomSpinner />}
                    GO TO PAYMENT
                </div>
            </button>
        </div>
    )
}
=======
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { navigate } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMutation } from "@apollo/client"
import { Icon } from '@iconify/react'
import ReactTooltip from "react-tooltip"

import { useAuction } from "../../providers/auction-context"
import { setBidInfo, setCurrentRound } from "../../redux/actions/bidAction"
import { PLACE_PRESALE_ORDER } from "../../apollo/graphqls/mutations/Bid"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import CustomSpinner from "../common/custom-spinner"
import { CheckBox } from "../common/FormControl"
import { wallets, NDB_WALLET_TOOLTIP_CONTENT, EXTERNAL_WALLET_TOOLTIP_CONTENT } from "../../utilities/staticData"
import { ROUTES } from "../../utilities/routes"
import { setPresaleOrderId } from '../../redux/actions/bidAction' 
import { NyyuWallet, NyyuWalletSelected } from "../../utilities/imgImport";
import { useAccount, useConnect } from "wagmi"

export default function PresalePlaceOrderWalletSelect() {
    // wagmi connect
    const { connect, connectors } = useConnect();
    const { data: accountInfo } = useAccount();

    const auction = useAuction()
    const dispatch = useDispatch()
    const { setPresalePlaceOrderStage, optCurrentRound, presaleNdbAmount } = auction
    const [error, setError] = useState("")
    const [reqPending, setReqPending] = useState(false)
    const [selectedWallet, setSelectedWallet] = useState(null)

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
        setReqPending(true)
        setError("")
        placePresaleOrderMutation({
            variables: {
                presaleId: optCurrentRound?.id,
                ndbAmount: presaleNdbAmount,
                destination: selectedWallet === 'external' ? 2 : 1,
                extAddr: selectedWallet === 'external' ? accountInfo?.address : ""
            },
        })
        dispatch(setBidInfo(Number(optCurrentRound?.tokenPrice * presaleNdbAmount)))
        dispatch(setCurrentRound(optCurrentRound?.id))
    }

    const handlePrevious = () => {
        if(selectedWallet === 'external') {
            setSelectedWallet(null);
            return;
        }
        setPresalePlaceOrderStage(0);
    }

    const shortFormatAddr = (addr) => {
        return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
    }

    return (
        <div className="my-30px mx-40px">
            <div className="w-100 d-flex justify-content-center align-items-center position-relative text-white fw-700 title">
                SELECT DESTINATION WALLET
                <div className="position-absolute top-0px left-0px fs-30px">
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="left-arrow cursor-pointer text-light"
                        size="xs"
                        onClick={handlePrevious}
                    />
                </div>
            </div>
            <div className="my-3 wallet_content">
                {selectedWallet === 'external'?
                    <>
                        <div className="row">
                            {connectors?.map((connector, idx) => (accountInfo && (accountInfo?.connector.name === connector.name)) ? (
                                <div className="col-lg-6 mb-10px" key={idx}>
                                    <div className="presale-connected external_wallet">
                                        <img src={wallets[accountInfo.connector.id]?.icon} alt="wallet icon" className="wallet-icon"/>
                                        <p>{shortFormatAddr(accountInfo.address)}</p>
                                    </div>
                                </div>
                            ) : ( 
                            <div
                                className="col-lg-6"
                                key={idx}
                                role="presentation"
                                onClick={() => connect(connector)}
                            >
                                <div className={`wallet-item  external_wallet ${!connector.ready && "inactive"}`}>
                                    <img src={wallets[connector.id]?.icon} alt="wallet icon" className="wallet-icon"/>
                                    <p>{connector.ready ? wallets[connector.id]?.short : "Not supported"}</p>
                                </div>
                            </div>))}
                        </div>
                    </>
                    :
                    <div className="row">
                        <div className="col-lg-6 mt-2">
                            <div className={`destination_wallet ${selectedWallet === 'internal'? 'selected_wallet': ''}`}
                                role="button"
                                onClick={() => setSelectedWallet("internal")}
                                onKeyDown={() => setSelectedWallet("inernal")}
                            >
                                <div className="d-flex justify-content-end wallet_header">
                                    <span data-tip='tooltip' data-for='ndb_wallet_tooltip'>
                                        <Icon icon='bi:question-circle'/>
                                    </span>
                                    <ReactTooltip place="left" type="light" effect="solid" id='ndb_wallet_tooltip'>
                                        <div
                                            className="text-justify"
                                            style={{
                                                width: "200px",
                                            }}
                                        >
                                            {NDB_WALLET_TOOLTIP_CONTENT}
                                        </div>
                                    </ReactTooltip>
                                </div>
                                <div className="img_div">
                                    <img src={selectedWallet === 'internal'? NyyuWalletSelected: NyyuWallet} alt='nyyu wallet' />
                                </div>
                                <h4 className="text-center">
                                    NYYU WALLET
                                </h4>
                            </div>
                        </div>
                        <div className="col-lg-6 mt-2">
                            <div className={`destination_wallet`}
                                role="button"
                                onKeyDown={() => setSelectedWallet("external")}
                                onClick={() => setSelectedWallet("external")}
                            >
                                <div className="d-flex justify-content-end wallet_header">
                                    <span data-tip='tooltip' data-for='external_wallet_tooltip'>
                                        <Icon icon='bi:question-circle'/>
                                    </span>
                                    <ReactTooltip place="left" type="light" effect="solid" id='external_wallet_tooltip'>
                                        <div
                                            className="text-justify"
                                            style={{
                                                width: "200px",
                                            }}
                                        >
                                            {EXTERNAL_WALLET_TOOLTIP_CONTENT}
                                        </div>
                                    </ReactTooltip>
                                </div>
                                <div className="img_div">
                                    <Icon icon='carbon:wallet' />
                                </div>
                                <h4 className="text-center">
                                    EXTERNAL WALLET
                                </h4>
                            </div>
                        </div>
                    </div>
                }
            </div>
            
            <div className="custom-checkbox pb-10px d-flex align-items-center ">
                <CheckBox
                    type="checkbox"
                    name="allow_fraction"
                    // value={}
                    // onChange={handleAllowFraction}
                    id='remember_select_wallet'
                />
                <label className="custom-control-label" htmlFor="remember_select_wallet">Remember my selection</label>
            </div>
            {error && (
                <div className="mt-1 mb-2">
                    <div className="d-flex align-items-center gap-2">
                        <Icon className="icon-23px text-danger" icon='bx:error-circle' />
                        <p className="text-danger fw-500 text-[#959595]">
                            {error}
                        </p>
                    </div>
                </div>
            )}
            <button
                className="btn btn-outline-light rounded-0 text-uppercase w-100 fw-bold py-12px fs-20px"
                onClick={handlePresale}
                disabled={reqPending || !selectedWallet}
            >
                <div className="d-flex align-items-center justify-content-center gap-3">
                    {reqPending && <CustomSpinner />}
                    GO TO PAYMENT
                </div>
            </button>
        </div>
    )
}
>>>>>>> 34e88146a677b222e9639614901f57f31dbf7ba3
