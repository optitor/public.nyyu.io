import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ethers } from "ethers"
import { useMutation, useQuery } from "@apollo/client"
import { useConnect, useAccount, useBalance, useTransaction } from "wagmi"
import { navigate } from "gatsby"
import { isMobile } from "react-device-detect"
import ReactTooltip from "react-tooltip"
import axios from "axios"
import _ from "lodash"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/fontawesome-free-regular"

import { set_Temp_Data } from "../../redux/actions/tempAction"
import { CheckBox } from "../common/FormControl"
import CustomSpinner from "../common/custom-spinner"
import * as Query from "../../apollo/graghqls/querys/Payment"
import { QUOTE, TICKER_24hr, TRUST_URL } from "./data"
import * as Mutation from "../../apollo/graghqls/mutations/Payment"
import { PAYMENT_FRACTION_TOOLTIP_CONTENT, wallets } from "../../utilities/staticData"
import { SUPPORTED_COINS } from "../../utilities/staticData2"
import { ROUTES as Routes } from "../../utilities/routes"

export default function PaymentExternalWalletTab({ currentRound, bidAmount }) {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const { allFees } = useSelector(state => state)

    const [fooCoins, setFooCoins] = useState([])
    const [BTCPrice, setBTCPrice] = useState(null)
    const [depositAddress, setDepositAddress] = useState("")
    const [coin, setCoin] = useState({})
    const [coinQuantity, setCoinQuantity] = useState(0)
    const [paymentId, setPaymentId] = useState(null)
    const [pending, setPending] = useState(false)
    const [startedTransaction, setStartedTransaction] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [state, setState] = useReducer(
        (old, action) => ({ ...old, ...action }),
        {
            allow_fraction: false,
            getAddress: false
        }
    )
    const { allow_fraction } = state

    // Wagmi connect, balance, transaction hooks
    const [{ data, error: connectError }, connect] = useConnect()
    const [{ data: accountInfo }, disconnect] = useAccount({
        fetchEns: false
    })
    const [{ data: balanceInfo }, getBalance] = useBalance({
        addressOrName: accountInfo?.address
    })

    const [{ data: transactionInfo, error: transactionError, loading: transactionLoading }, sendTransaction] = useTransaction({
        request: {
            to: depositAddress,
            value: coinQuantity ? ethers.utils.parseEther(coinQuantity.toString()) : null
        }
    })
    const loadingData = _.isEmpty(fooCoins) || _.isEmpty(allFees)

    //Get the transaction fee based on the bidAmount, tierlevel, fee
    const transactionFee = useMemo(() => {
        const fee = user && allFees[user?.tierLevel]?.fee
        const txnFee = (bidAmount * (0.5 + fee)) / 100
        if (isNaN(txnFee)) return null
        return txnFee.toFixed(4)
    }, [allFees, bidAmount, user])

    useEffect(() => {
        if (connectError) {
            setErrorMessage("Failed to Connect, try again.")
            setTimeout(() => setErrorMessage(""), 5000)
        }
        if (transactionError) {
            setErrorMessage("Failed for Transaction, try again.")
            setTimeout(() => setErrorMessage(""), 5000)
        }
    }, [connectError, transactionError])

    useEffect(() => {
        if (fooCoins && balanceInfo) {
            const coinInfo = fooCoins.filter(item => item.value === balanceInfo.symbol)[0]
            setCoin(coinInfo)
        }
    }, [fooCoins, balanceInfo])

    //Fetch the price of BTC
    useEffect(() => {
        (async function() {
            const { data: BTCPriceData } = await axios.get(TICKER_24hr, {
                params: { symbol: "BTC" + QUOTE }
            })
            setBTCPrice(BTCPriceData.lastPrice)
        })()
    }, [])

    useEffect(() => {
        if (startedTransaction && !transactionLoading && !transactionError) {
            navigate(Routes.auction)
        }
    }, [startedTransaction, transactionLoading, transactionError])

    //Get the Exchange rate of various coins
    useQuery(Query.GET_EXCHANGE_RATE, {
        onCompleted: (data) => {
            if (data.getExchangeRate) {
                const temp = JSON.parse(data.getExchangeRate)
                const coins = SUPPORTED_COINS?.map((item) => {
                    return { ...item, detail: temp?.result[item.value] }
                })
                setFooCoins(coins)
            }
        },
        onError: (err) => {
            console.log("get exchange rate: ", err)
        }
    })

    //Get the exact coin quantity based on the btc price
    useEffect(() => {
        let coinPrice = BTCPrice * coin?.detail?.rate_btc

        let precision = 4
        if (coin?.value === "BTC") precision = 8

        let quantity = parseFloat((bidAmount / coinPrice).toFixed(precision))
        if (quantity === Infinity) quantity = null
        setCoinQuantity(quantity)

        const tempData = {
            coinValue: quantity,
            coinSymbol: coin?.value,
            paymentId,
            transactionFee
        }
        dispatch(set_Temp_Data(tempData))
    }, [bidAmount, coin, BTCPrice, paymentId, transactionFee, dispatch])

    //Get the deposit Address for each coin
    const [createCryptoPaymentMutation] = useMutation(
        Mutation.CREATE_CRYPTO_PAYMENT,
        {
            onCompleted: (data) => {
                if (data.createCryptoPaymentForAuction) {
                    const resData = data.createCryptoPaymentForAuction

                    setDepositAddress(resData?.depositAddress)
                    setPaymentId(resData?.id)
                    setPending(false)
                }
            },
            onError: (err) => {
                console.log("get deposit address: ", err)
                setPending(false)
            }
        }
    )


    const create_Crypto_Payment = () => {
        setPending(true)
        const createData = {
            roundId: currentRound,
            amount: bidAmount,
            cryptoType: coin.value,
            network: "ERC20",
            coin: "ETH"
        }
        createCryptoPaymentMutation({
            variables: { ...createData }
        })
    }

    const handleWallet = (connector) => {
        connector.ready && connect(connector)
        getBalance()
        create_Crypto_Payment()
    }

    const handleTransaction = () => {
        setStartedTransaction(true)
        sendTransaction()
    }

    const handleAllowFraction = useCallback(
        (e) => {
            e.preventDefault()
            setState({ allow_fraction: !allow_fraction })
        },
        [allow_fraction]
    )

    return (loadingData ? <div className="text-center">
        <CustomSpinner/>
    </div> : <div className="row">
        <>
            {data.connectors.map((connector, idx) => (accountInfo && (accountInfo.connector.name === connector.name)) ? (
                <div className="col-sm-6 mb-10px" key={idx}>
                    <div className="connected">
                        <img src={wallets[accountInfo.connector.id]?.icon} alt="wallet icon"/>
                        <p>{accountInfo.address}</p>
                        <button className="small-btn disconnect" onClick={disconnect}>
                            Disconnect
                        </button>
                        <button className="small-btn payment" onClick={handleTransaction}>
                            Pay
                        </button>
                    </div>
                </div>
            ) : (<div
                className="col-sm-6"
                key={idx}
                onClick={() => handleWallet(connector)}
                onKeyDown={() => handleWallet(connector)}
                role="presentation"
            >
                <div className={`wallet-item  ${!connector.ready && "inactive"}`}>
                    <img src={wallets[connector.id]?.icon} alt="wallet icon"/>
                    <p>{connector.ready ? wallets[connector.id]?.desc : wallets[connector.id]?.warn}</p>
                </div>
            </div>))}
            <div
                className="col-sm-6"
                onClick={() => {
                    isMobile && navigate(TRUST_URL)
                }}
                onKeyDown={() => {
                    isMobile && navigate(TRUST_URL)
                }}
                role="presentation"
            >
                <div className={`wallet-item  ${!isMobile && "inactive"}`}>
                    <img src={wallets.trustWallet.icon} alt="wallet icon"/>
                    <p>{isMobile ? wallets.trustWallet.desc : wallets.trustWallet.warn}</p>
                </div>
            </div>
        </>
        <div className="py-2" style={{ color: connectError || transactionError ? "#E8503A" : "#23C865" }}>
            {errorMessage}
        </div>
        <div className="mt-1 d-flex justify-content-between">
            <div className="d-flex flex-row text-white">
                <CheckBox
                    type="checkbox"
                    name="allow_fraction"
                    value={allow_fraction}
                    onChange={
                        handleAllowFraction
                    }
                    className="text-uppercase"
                />
                <div className="allow-text">
                    Do you allow fraction of
                    order completion?
                </div>
                <ReactTooltip
                    place="right"
                    type="light"
                    effect="solid"
                >
                    <div
                        className="text-justify"
                        style={{
                            width: "300px"
                        }}
                    >
                        {
                            PAYMENT_FRACTION_TOOLTIP_CONTENT
                        }
                    </div>
                </ReactTooltip>
                <FontAwesomeIcon
                    data-tip="React-tooltip"
                    icon={faQuestionCircle}
                    className="fa-xl ms-2 cursor-pointer"
                />
            </div>
            <p className="payment-expire my-auto">
                payment expires in{" "}
                <span className="txt-green">
                    10 minutes
                </span>
            </p>
        </div>
    </div>)

}
