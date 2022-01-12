import React, { useState } from "react"
import { navigate } from "gatsby"
import { wallets } from "../../utilities/staticData"
import { useConnect, useAccount } from "wagmi"
import { isMobile } from "react-device-detect"

const TRUST_URL =
    "https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url="
const currentURI = typeof window === "undefined" ? "" : window.location.href
const deepLink = `${TRUST_URL}${encodeURIComponent(currentURI)}`

export default function ConnectWalletTab() {
    const [{ data: connectData, error: connectError }, connect] = useConnect()
    const [{ data: accountData }, disconnect] = useAccount({
        fetchEns: true,
    })

    console.log("Connect Data", connectData)
    console.log("Account Data", accountData)

    return (
        <div className="connect-wallet">
            <h4>select wallet</h4>
            <div className="row">
                {accountData ? (
                    <div>
                        <div className="connected">
                            <img src={wallets[accountData.connector.id]?.icon} alt="wallet icon" />
                            <p>{accountData.address}</p>
                        </div>
                        <button className="btn-primary" onClick={disconnect}>
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <>
                        {connectData.connectors.map((x, idx) => (
                            <div
                                className="col-sm-6"
                                key={idx}
                                onClick={() => x.ready && connect(x)}
                                onKeyDown={() => x.ready && connect(x)}
                                role="presentation"
                            >
                                <div className={`wallet-item  ${!x.ready && "inactive"}`}>
                                    <img src={wallets[x.id]?.icon} alt="wallet icon" />
                                    <p>{x.ready ? wallets[x.id]?.desc : wallets[x.id]?.warn}</p>
                                </div>
                            </div>
                        ))}
                        <div
                            className="col-sm-6"
                            onClick={() => {
                                navigate(deepLink)
                            }}
                            onKeyDown={() => {}}
                            role="presentation"
                        >
                            <div className={`wallet-item  ${!isMobile && "inactive"}`}>
                                <img src={wallets.trustWallet.icon} alt="wallet icon" />
                                <p>
                                    {isMobile ? wallets.trustWallet.desc : wallets.trustWallet.warn}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {connectError && <div>{connectError?.message ?? "Failed to connect"}</div>}
            </div>
        </div>
    )
}
