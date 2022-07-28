import React from "react"
import { navigate } from "gatsby"
import { wallets } from "../../utilities/staticData"
import { useConnect, useAccount, useDisconnect } from "wagmi"
import { isMobile } from "react-device-detect"

const TRUST_URL = `https://link.trustwallet.com/open_url?coin_id=60&url=${process.env.GATSBY_SITE_URL}`;

export default function ConnectWalletTab() {
    const { data: accountData } = useAccount();
    const { connect, connectors, error } = useConnect();
    const { disconnect } = useDisconnect();

    return (
        <div className="row">
            {accountData?.connector ? (
                <div className="mb-10px">
                    <div className="connected">
                        <img src={wallets[accountData.connector.id]?.icon} alt="wallet icon" />
                        <p>{accountData?.address}</p>
                    </div>
                    <button className="btn-primary" onClick={disconnect}>
                        Disconnect
                    </button>
                </div>
            ) : (
                <>
                    {connectors.map((x, idx) => (
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
                            isMobile && navigate(TRUST_URL)
                        }}
                        onKeyDown={() => {
                            isMobile && navigate(TRUST_URL)
                        }}
                        role="presentation"
                    >
                        <div className={`wallet-item  ${!isMobile && "inactive"}`}>
                            <img src={wallets.trustWallet.icon} alt="wallet icon" />
                            <p>{isMobile ? wallets.trustWallet.desc : wallets.trustWallet.warn}</p>
                        </div>
                    </div>
                </>
            )}
            {error && (
                <div className="py-2" style={{ color: "#e8503a" }}>
                    {error?.message ?? "Failed to connect"}
                </div>
            )}
        </div>
    )
}
