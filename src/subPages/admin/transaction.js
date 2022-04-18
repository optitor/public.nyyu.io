import React from "react";
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

import Seo from "./../../components/seo";
import LayoutWithMenu from "../../components/admin/LayoutWithMenu";
import BankDepositTable from "../../components/admin/transaction/BankDepositTable";
import CryptoWithdrawTable from "../../components/admin/transaction/CryptoWithdrawTable";
import PaypalWithdrawTable from "../../components/admin/transaction/PayPalWithdrawTable";
import BankWithdrawTable from "../../components/admin/transaction/BankWithdrawTable";

const IndexPage = () => {

    return (
        <>
            <Seo title="Admin Transaction" />
            <main className="admin-transaction-page">
                <LayoutWithMenu>
                    <div className="tabs_container">
                        <Tabs>
                            <TabList>
                                <Tab>Bank Deposit</Tab>
                                <Tab>Crypto Withdraw</Tab>
                                <Tab>Paypal Withdraw</Tab>
                                <Tab>Bank Withdraw</Tab>
                            </TabList>
                            <TabPanel>
                                <BankDepositTable />
                            </TabPanel>
                            <TabPanel>
                                <CryptoWithdrawTable />
                            </TabPanel>
                            <TabPanel>
                                <PaypalWithdrawTable />
                            </TabPanel>
                            <TabPanel>
                                <BankWithdrawTable />
                            </TabPanel>
                        </Tabs>
                    </div>                    
                </LayoutWithMenu>
            </main>
        </>
    )
}

export default IndexPage
