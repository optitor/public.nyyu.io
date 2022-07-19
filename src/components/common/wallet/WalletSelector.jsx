import React, { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import ReactTooltip from "react-tooltip";
import { BsQuestionCircle } from "@react-icons/all-files/bs/BsQuestionCircle";
import { BiWallet } from "@react-icons/all-files/bi/BiWallet";

import { wallets, NDB_WALLET_TOOLTIP_CONTENT, EXTERNAL_WALLET_TOOLTIP_CONTENT } from "../../../utilities/staticData";
import { NyyuWallet, NyyuWalletSelected } from "../../../utilities/imgImport";

const shortFormatAddr = (addr) => {
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
}

const WalletSelector = ({selectedWallet, walletChanged}) => {
    // wagmi connectors
    const { connect, connectors, isConnected } = useConnect();
    const { data: accountInfo } = useAccount();

    if(!isConnected) {
        walletChanged({selectedWallet, address: null});
    }

    if(isConnected) {
        walletChanged({selectedWallet, address: accountInfo?.address});
    }

    // selected wallet type, Nyyu or external
    const onChangeWallet = (wallet) => {
        walletChanged({ selectedWallet: wallet, address: accountInfo?.address });
    }
    
    return <div className="mb-3 wallet_content">
        {selectedWallet === 'external'?
            <>
                <div className="row">
                    {connectors?.map((connector, idx) => (accountInfo && (accountInfo?.connector.name === connector.name)) ? (
                        <div className="col-lg-6 mb-10px" key={idx}>
                            <div className="presale-connected external_wallet">
                                <img src={wallets[accountInfo.connector.id]?.icon} alt="wallet icon" className="wallet-icon"/>
                                <p className="txt-green">{shortFormatAddr(accountInfo.address)}</p>
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
                    <button className={`destination_wallet ${selectedWallet === 'internal'? 'selected_wallet': ''}`}
                        onClick={() => onChangeWallet("internal")}
                    >
                        <div className="d-flex justify-content-end wallet_header">
                            <span data-tip='tooltip' data-for='ndb_wallet_tooltip'>
                                <BsQuestionCircle />
                            </span>
                            <ReactTooltip place="left" type="light" effect="solid" id='ndb_wallet_tooltip'>
                                <div
                                    className="text-justify"
                                    style={{
                                        width: "220px",
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
                    </button>
                </div>
                <div className="col-lg-6 mt-2">
                    <button className={`destination_wallet`}
                        onClick={() => onChangeWallet("external")}
                        // disabled={true}
                    >
                        <div className="d-flex justify-content-end wallet_header">
                            <span data-tip='tooltip' data-for='external_wallet_tooltip'>
                                <BsQuestionCircle />
                            </span>
                            <ReactTooltip place="left" type="light" effect="solid" id='external_wallet_tooltip'>
                                <div
                                    className="text-justify"
                                    style={{
                                        width: "220px",
                                    }}
                                >
                                    {EXTERNAL_WALLET_TOOLTIP_CONTENT}
                                </div>
                            </ReactTooltip>
                        </div>
                        <div className="img_div">
                            <BiWallet />
                        </div>
                        <h4 className="text-center">
                            EXTERNAL WALLET
                        </h4>
                    </button>
                </div>
            </div>
        }
    </div>
}

export default WalletSelector;