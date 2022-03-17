/* eslint-disable */

import React, { useReducer, useCallback } from "react";
import { useQuery } from "@apollo/client";
import Header from "./../header";
import Select, { components } from "react-select";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
    BTC,
    DOGE,
    ETH,
    Airdrop,
    Address,
    Copy2,
    CloseIcon,
} from "../../utilities/imgImport";
import Modal from "react-modal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Input } from "../common/FormControl";
import { useWindowSize } from "../../utilities/customHook";
import AirdropDetail from "../AirdropDetail";
import MarketTab from "../wallet/market-tab";
import Transactions from "./transactions/transactions-tab";
import ReferralTab from "../wallet/referral-tab";
import StakeTab from "../wallet/stake-tab";
import BidActivityTab from "../wallet/bid-activity-tab";
import { GET_BID_LIST_BY_USER } from "../../apollo/graghqls/querys/Bid";
import InternalWallet from "../wallet/internal-wallet";
import Seo from "../seo";
import TransactionsProvider from "./transactions/transactions-context";
import * as Mutation from "../../apollo/graghqls/mutations/Payment";
import { useMutation } from '@apollo/client';


const airdrops = [
    {
        icon: Airdrop,
        name: "ICON (ICX)",
        desc: "General-purpose blockchain protocol",
        status: "Active",
        end: "14 Apr 2022",
        reward: 150,
        participants: 60,
        winners: 20,
    },
    {
        icon: Airdrop,
        name: "BtcEX (BXC)",
        desc: "Crypto exchange platform",
        status: "Active",
        end: "14 Apr 2022",
        reward: 300,
        participants: 60,
        winners: 20,
    },
    {
        icon: Airdrop,
        name: "Publish0x",
        desc: "Crypto-publishing platform",
        status: "Ended",
        end: "Unkown",
        reward: 100,
        participants: 60,
        winners: 20,
    },
];
const coins = [
    { value: "eth", label: "Ethereum", icon: ETH },
    { value: "btc", label: "Bitcoin", icon: BTC },
    { value: "doge", label: "Dogecoin", icon: DOGE },
];
const joins = [
    {
        label: "Connect your MetaMask wallet",
        btnName: "Connect metamask wallet",
    },
    {
        label: "Connect your BitMEX API key",
        btnName: "Connect ",
    },
    {
        label: "Follow Facebook account",
        btnName: "Follow",
    },
    {
        label: "Join Telegram channel",
        btnName: "Join",
    },
];

// Select option customization
const { Option, SingleValue } = components;
const IconOption = (props) => (
    <Option {...props}>
        <img
            src={props.data.icon}
            style={{ width: 24, marginRight: "4px" }}
            alt={props.data.label}
        />
        {props.data.label}
    </Option>
);
const SelectedValue = (props) => {
    return (
        <SingleValue {...props}>
            <img
                src={props.data.icon}
                style={{ width: 24 }}
                alt={props.data.label}
            />
            <p>{props.data.label}</p>
        </SingleValue>
    );
};

const Wallet = () => {
    const size = useWindowSize();
    const { data: bidList } = useQuery(GET_BID_LIST_BY_USER);

    const copyText = "kjY602GgjsKP23mhs09oOp63bd3n34fsla";

    const [state, setState] = useReducer(
        (old, action) => ({ ...old, ...action }),
        {
            amount: "",
            detail_show: false,
            index: 0,
            coin: coins[0],
            copied: false,
            modalIsOpen: false,
            airdropModal: false,
            joinAirdrop: false,
            facebook_handle: "",
            telegram_handle: "",
        }
    );
    const {
        amount,
        detail_show,
        index,
        coin,
        copied,
        modalIsOpen,
        airdropModal,
        joinAirdrop,
        facebook_handle,
        telegram_handle,
    } = state;

    const handleClick = (idx) => {
        setState({ detail_show: true });
        setState({ index: idx });
    };
    const handleInput = useCallback((e) => {
        e.preventDefault();
        setState({ [e.target.name]: e.target.value });
    }, []);

    const handleJoinAirdrop = () => {
        setState({ joinAirdrop: true });
    };

    const [captureOrderForDeposit] = useMutation(Mutation.CAPTURE_ORDER_FOR_DEPOSIT, {
        onCompleted: (data) => {
            if (data.captureOrderForDeposit) {
                alert('Your checkout was successfully!')
            } else {
                alert('Error in checkout with PayPal');
            }
        },
        onError: (err) => {
            alert('Error in checkout with PayPal');
        },
    });

    let orderCaptured = false;

    if (window.location.href.includes('token=') && !orderCaptured) {
        var url = new URL(window.location.href);
        let token = url.searchParams.get("token");
        orderCaptured = true;
        captureOrderForDeposit({variables: {orderId: token}});
    }

    if (localStorage.getItem('PayPalDepositToken') != null && localStorage.getItem('PayPalDepositToken') != undefined && !orderCaptured) {
        orderCaptured = true;
        let possibleToken = localStorage.getItem('PayPalDepositToken');
        captureOrderForDeposit({variables: {orderId: possibleToken}});
        localStorage.setItem('PayPalDepositToken', null);
        localStorage.removeItem('PayPalDepositToken');
    }

    return (
        <>
            <Seo title="Wallet" />
            <main className="history-page">
                <Header />
                <section className="container">
                    <div className="section-history row">
                        <div className="section-history__left col-lg-4 col-md-5">
                            <InternalWallet />
                        </div>
                        <div className="section-history__right col-lg-8 col-md-7">
                            <Tabs
                                onSelect={() =>
                                    setState({ detail_show: false })
                                }
                            >
                                <div className="tab-top">
                                    <TabList>
                                        <Tab>market</Tab>
                                        <Tab>stake</Tab>
                                        <Tab>referral</Tab>
                                        <Tab>airdrops</Tab>
                                        <Tab>transaction</Tab>
                                        <Tab>bid activity</Tab>
                                    </TabList>
                                </div>
                                <TabPanel>
                                    <MarketTab />
                                </TabPanel>
                                <TabPanel className="px-0">
                                    <StakeTab />
                                </TabPanel>
                                <TabPanel>
                                    <ReferralTab />
                                </TabPanel>
                                <TabPanel>
                                    <table
                                        className={`${
                                            detail_show &&
                                            (size.width > 1024 ||
                                                size.width <= 576) &&
                                            "d-none"
                                        }`}
                                    >
                                        <thead>
                                            <tr>
                                                <th className="w-50">
                                                    Airdrop
                                                </th>
                                                <th>Status</th>
                                                <th className="laptop-not">
                                                    End
                                                </th>
                                                <th>Reward</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {airdrops.map((item, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="airdrop-link"
                                                    onClick={() => {
                                                        handleClick(idx);
                                                        setState({
                                                            airdropModal: true,
                                                        });
                                                    }}
                                                >
                                                    <td className="w-50">
                                                        <div className="d-flex align-items-start ps-2">
                                                            <img
                                                                src={item.icon}
                                                                alt="coin icon"
                                                                className="me-2"
                                                            />
                                                            <div>
                                                                <p className="coin-abbr">
                                                                    {item.name}
                                                                </p>
                                                                <p className="coin-name mobile-not">
                                                                    {item.desc}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        className={
                                                            item.status ===
                                                            "Active"
                                                                ? "coin-status active"
                                                                : "coin-status deactive"
                                                        }
                                                    >
                                                        {item.status}
                                                    </td>
                                                    <td className="laptop-not">
                                                        {item.end}
                                                    </td>
                                                    <td className="coin-reward">
                                                        ={item.reward} USD
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <AirdropDetail
                                        clsName={
                                            (size.width > 1024 ||
                                                size.width <= 576) &&
                                            detail_show
                                                ? "d-block"
                                                : "d-none"
                                        }
                                        airdrop={airdrops[index]}
                                        onJoinClick={handleJoinAirdrop}
                                    />
                                </TabPanel>
                                <TabPanel className="border-0">
                                    <TransactionsProvider>
                                        <Transactions />
                                    </TransactionsProvider>
                                </TabPanel>
                                <TabPanel>
                                    <BidActivityTab
                                        bids={bidList?.getBidListByUser}
                                    />
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </section>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setState({ modalIsOpen: false })}
                    ariaHideApp={false}
                    className="deposit-modal"
                    overlayClassName="deposit-modal__overlay"
                >
                    <div className="pwd-modal__header">
                        Desposits and withdrawals
                        <div
                            onClick={() => setState({ modalIsOpen: false })}
                            onKeyDown={() => setState({ modalIsOpen: false })}
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
                    <Select
                        className="cryptocoin-select"
                        options={coins}
                        value={coin}
                        onChange={(v) => setState({ coin: v })}
                        components={{
                            Option: IconOption,
                            SingleValue: SelectedValue,
                        }}
                    />
                    <Tabs className="deposit-tab">
                        <TabList>
                            <Tab>Deposit</Tab>
                            <Tab>Withdraw</Tab>
                        </TabList>
                        <TabPanel className="deposit-panel">
                            <CopyToClipboard
                                onCopy={() => setState({ copied: true })}
                                text={copyText}
                                options={{ message: "copied" }}
                            >
                                <div
                                    className="clipboard"
                                    onClick={() => setState({ copied: true })}
                                    onKeyDown={() => setState({ copied: true })}
                                    role="presentation"
                                >
                                    <div>
                                        <p>Deposit Address</p>
                                        <code>{copyText}</code>
                                    </div>
                                    <img src={Copy2} alt="copy" />
                                </div>
                            </CopyToClipboard>
                            {copied ? (
                                <span style={{ color: "white" }}>Copied.</span>
                            ) : null}
                            <div className="bitcoin-address">
                                <img src={Address} alt="bitcoin address" />
                                <p>Send only Bitcoin to this deposit adress</p>
                            </div>
                            <button className="btn-second w-100">
                                Share Address
                            </button>
                        </TabPanel>
                        <TabPanel className="withdraw-panel">
                            <Input
                                type="number"
                                name="amount"
                                value={amount}
                                onChange={handleInput}
                                placeholder="Deposit amount"
                            />
                            <div className="my-3">
                                <div className="available-balance">
                                    <p>Available balance</p>
                                    <p>5.0054 BTC</p>
                                </div>
                                <div className="minimum-transfer">
                                    <p>Minimum transfer</p>
                                    <p>0.00200 BTC</p>
                                </div>
                            </div>
                            <Select
                                className="cryptocoin-select"
                                options={coins}
                                value={coin}
                                onChange={(v) => setState({ coin: v })}
                                components={{
                                    Option: IconOption,
                                    SingleValue: SelectedValue,
                                }}
                            />
                            <button className="btn-second w-100">
                                Withdraw
                            </button>
                        </TabPanel>
                    </Tabs>
                </Modal>
                <Modal
                    isOpen={airdropModal}
                    onRequestClose={() => setState({ airdropModal: false })}
                    ariaHideApp={false}
                    className="airdrop-modal"
                    overlayClassName="airdrop-modal__overlay"
                >
                    <div className="tfa-modal__header">
                        <div
                            onClick={() => setState({ airdropModal: false })}
                            onKeyDown={() => setState({ airdropModal: false })}
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
                    <AirdropDetail
                        clsName={
                            size.width <= 1024 && airdropModal
                                ? "d-block"
                                : "d-none"
                        }
                        airdrop={airdrops[index]}
                        onJoinClick={handleJoinAirdrop}
                    />
                </Modal>
                <Modal
                    isOpen={joinAirdrop}
                    onRequestClose={() => setState({ joinAirdrop: false })}
                    ariaHideApp={false}
                    className="join-modal"
                    overlayClassName="join-modal__overlay"
                >
                    <div className="pwd-modal__header">
                        <div className="d-flex align-items-center">
                            <img
                                src={airdrops[index].icon}
                                alt="coin icon"
                                className="detail-header__icon me-2"
                            />
                            <p className="detail-header__name">
                                {airdrops[index].name}
                            </p>
                        </div>

                        <div
                            onClick={() => setState({ joinAirdrop: false })}
                            onKeyDown={() => setState({ joinAirdrop: false })}
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
                    <div className="join-airdrop">
                        <ul className="join-list">
                            {joins.map((item, idx) => (
                                <li key={idx}>
                                    <p>{item.label}</p>
                                    <button className="btn-green">
                                        {item.btnName}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="my-3">
                            <Input
                                type="text"
                                name="facebook_handle"
                                label="Facebook handle "
                                value={facebook_handle}
                                onChange={handleInput}
                                placeholder="Enter Facebook handle"
                            />
                            <Input
                                type="text"
                                name="telegram_handle"
                                label="Facebook handle "
                                value={telegram_handle}
                                onChange={handleInput}
                                placeholder="Enter Telegram"
                            />
                        </div>
                        <div className="text-center">
                            <button className="btn-primary">
                                Join Airdrop
                            </button>
                        </div>
                    </div>
                </Modal>
            </main>
        </>
    );
};

export default Wallet;
