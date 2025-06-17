import React, { useCallback, useState } from "react";
import { navigate } from "gatsby";
import { wallets } from "../../utilities/staticData";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { isMobile } from "react-device-detect";

const TRUST_URL = `https://link.trustwallet.com/open_url?coin_id=60&url=${process.env.GATSBY_SITE_URL}`;

export default function ConnectWalletTab() {
    const { data: accountData } = useAccount();
    const { connect, connectors, error, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const [connectingId, setConnectingId] = useState(null);

    const handleConnect = useCallback(
        async (connector) => {
            if (isPending || connectingId) return;

            try {
                setConnectingId(connector.id);
                console.log(
                    "Attempting to connect with:",
                    connector.name,
                    connector.id,
                );

                await connect({ connector });
            } catch (err) {
                console.error("Connection failed:", err);
            } finally {
                setConnectingId(null);
            }
        },
        [connect, isPending, connectingId],
    );

    const handleTrustWallet = useCallback(() => {
        if (isMobile) {
            navigate(TRUST_URL);
        }
    }, []);

    return (
        <div className="row">
            {accountData?.connector ? (
                <div className="mb-10px">
                    <div className="connected">
                        <img
                            src={wallets[accountData.connector.id]?.icon}
                            alt="wallet icon"
                        />
                        <p>{accountData?.address}</p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => disconnect()}
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                <>
                    {connectors.map((connector, idx) => {
                        const isConnecting = connectingId === connector.id;
                        const isReady =
                            connector.type !== "unknown" &&
                            typeof connector.connect === "function";

                        return (
                            <div
                                className="col-sm-6"
                                key={`${connector.id}-${idx}`}
                                onClick={() =>
                                    isReady &&
                                    !isConnecting &&
                                    handleConnect(connector)
                                }
                                onKeyDown={(e) => {
                                    if (
                                        (e.key === "Enter" || e.key === " ") &&
                                        isReady &&
                                        !isConnecting
                                    ) {
                                        e.preventDefault();
                                        handleConnect(connector);
                                    }
                                }}
                                role="button"
                                tabIndex={isReady ? 0 : -1}
                                style={{
                                    cursor: isReady ? "pointer" : "not-allowed",
                                }}
                            >
                                <div
                                    className={`wallet-item ${!isReady ? "inactive" : ""} ${isConnecting ? "connecting" : ""}`}
                                >
                                    <img
                                        src={
                                            wallets[connector.id]?.icon ||
                                            wallets[
                                                connector.name?.toLowerCase()
                                            ]?.icon
                                        }
                                        alt="wallet icon"
                                    />
                                    <p>
                                        {isConnecting
                                            ? "Connecting..."
                                            : isReady
                                              ? wallets[connector.id]?.desc ||
                                                wallets[
                                                    connector.name?.toLowerCase()
                                                ]?.desc ||
                                                `Connect ${connector.name}`
                                              : wallets[connector.id]?.warn ||
                                                wallets[
                                                    connector.name?.toLowerCase()
                                                ]?.warn ||
                                                "Not supported"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div
                        className="col-sm-6"
                        onClick={handleTrustWallet}
                        onKeyDown={(e) => {
                            if (
                                (e.key === "Enter" || e.key === " ") &&
                                isMobile
                            ) {
                                e.preventDefault();
                                handleTrustWallet();
                            }
                        }}
                        role="button"
                        tabIndex={isMobile ? 0 : -1}
                        style={{ cursor: isMobile ? "pointer" : "not-allowed" }}
                    >
                        <div
                            className={`wallet-item ${!isMobile ? "inactive" : ""}`}
                        >
                            <img
                                src={wallets.trustWallet.icon}
                                alt="wallet icon"
                            />
                            <p>
                                {isMobile
                                    ? wallets.trustWallet.desc
                                    : wallets.trustWallet.warn}
                            </p>
                        </div>
                    </div>
                </>
            )}
            {error && (
                <div className="py-2" style={{ color: "#e8503a" }}>
                    {error?.message ?? "Failed to connect"}
                </div>
            )}
            {isPending && (
                <div className="py-2" style={{ color: "#17a2b8" }}>
                    Connecting to wallet...
                </div>
            )}
        </div>
    );
}
