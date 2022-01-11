import React from "react"
import Header from "../components/header"
import Accordion from "../components/common/Accordion"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"

const faq_tabs = [
    {
        value: "Token",
        label: "Token",
    },
    {
        value: "Auction FAQ",
        label: "Auction FAQ",
    },
]
const auction_faq_tabs = [
    {
        value: "NDB Token",
        label: "NDB Token",
    },
    {
        value: "Volt Token",
        label: "Volt Token",
    },
    {
        value: "Stake pool",
        label: "Stake pool",
    },
]
const faqs = [
    {
        question: "What is the Dual Token System?",
        answer: (
            <p>
                The Dual Token System combines two tokens, the NDB token, a fixed supply token, and
                the Volt Token, a variable supply token. The Dual token brings more incentives to
                the users and partners. For example, with this method we can provide to our partners
                more accurate measurements of the interest in their companies by utilizing our
                services and products from their customer’s perspective.
            </p>
        ),
    },
    {
        question: "What is Volt Token?",
        answer: (
            <p>
                The Volt token is the driving force behind the applications and interacts with NDB
                token. These tokens will be of variable supply, burnable and mintable and serve to
                power its applications. Through Volt token, the users will have the possibility to
                lease and access benefits from our products. Furthermore, the token can be used as
                an energy tracker for utility providers and consumers to earn rewards. There are
                also plans for this token to be used as a form of energy payment in the future.
            </p>
        ),
    },
    {
        question: "What is the NDB token?",
        answer: (
            <p>
                The NDB token is a tool for demonstrating the buyer’s interests in the partnership
                between companies inside our ecosystem. The inclusion of new proposals into our
                blockchain ecosystem enables people to stake their NDB tokens and support the
                project, company, or individuals. By staking NDB tokens on different Pools, you can
                earn dividends as Volt tokens over the staked amount.
            </p>
        ),
    },
    {
        question: "What is Airdrop?",
        answer: (
            <p>
                Our Airdrop function is the initial incentive for people to stake their NDB tokens
                into the Pools. The Airdrop will come as a reward for the interaction between the
                Pool entity and our products and services. As the ecosystem grows, more features
                will be announced, guaranteeing advantages on-chain and off-chain for the user’s
                interaction with specific Pools.
            </p>
        ),
    },
    {
        question: "What are the pools?",
        answer: (
            <p>
                Pools are the mechanism used for the token to gather and measure intention from
                users and organizations for us and our partners. The Pools act as quantifiers for
                value and will play an essential role in the early stages.
            </p>
        ),
    },
    {
        question: "What is the relationship between both tokens?",
        answer: (
            <p>
                NDB token interacts with Volt, both of which price-wise, interact freely on the open
                market. The interaction of NDB and Volt tokens will maintain the interest of users
                in the ecosystem, and create economic checks and balances to regulate the demand for
                tokens.
            </p>
        ),
    },
    {
        question: "What is the NDB Hub?",
        answer: (
            <p>
                NDB Hub is an institution governed by Voltamond SA based in Switzerland tasked with
                assessing and putting forward growth proposals related to energy applications. It is
                also responsible for maintaining and safeguarding the best interests of this project
                through oversight on maintaining developers, seeking feedback from the community,
                and searching for product improvement where needed. It will assess and seek
                potential partners that support the growth of the ecosystem. This initiative is the
                primary organization through which the NDB and Volt token operate.
            </p>
        ),
    },
    {
        question: "How can I earn more tokens?",
        answer: (
            <p>
                You can stake your NDB tokens on the different categories of Pools, to earn
                dividends as Volt tokens based on the staked value. In addition to that, you should
                bear in mind that NDB-powered devices constantly generate energy. That is why, when
                you have a device containing our products, you can earn Volt tokens for the unused
                energy sent to the grid when the device is inactive.
            </p>
        ),
    },
    {
        question: "How to send tokens to external sources?",
        answer: (
            <p>
                The in-built function of NDB App will allow users to move their tokens to private
                external wallets, or you can keep your tokens in custodian parties like crypto
                exchanges.
            </p>
        ),
    },
    {
        question: "Can I stake my NDB tokens without having an account on the NDB App?",
        answer: (
            <p>
                Safety and security of users of our platform is one of the top priorities for NDB.
                That is why, before you stake NDB tokens into a Pool of any kind, you must submit
                the required documents for the KYC process from our App.
            </p>
        ),
    },
    {
        question: "Which protocol are the tokens using?",
        answer: (
            <p>
                The NDB token is created in IBEP-20 protocol using the Binance Smart Chain network.
            </p>
        ),
    },
    {
        question: "Can I charge my devices with NDB token?",
        answer: (
            <p>
                No, NDB token serves as a tool to demonstrate the buyer’s interest in the
                partnership between companies inside the NDB ecosystem, but you can stake your NDB
                tokens to earn Volt. With Volt tokens you can lease and access benefits from NDB’s
                products.
            </p>
        ),
    },
]

const FAQ = () => {
    return (
        <main className="faq-page">
            <Header />
            <section className="container">
                <Tabs className="faq__tabs">
                    <TabList className="faq__tabs-list">
                        {faq_tabs.map((item, idx) => (
                            <Tab className="faq__tabs-tab" key={idx}>
                                {item.label}
                            </Tab>
                        ))}
                    </TabList>

                    <TabPanel>
                        <Tabs className="sub-faq__tabs">
                            <TabList className="sub-faq__tabs-list">
                                {auction_faq_tabs.map((item, idx) => (
                                    <Tab className="sub-faq__tabs-tab" key={idx}>
                                        {item.label}
                                    </Tab>
                                ))}
                            </TabList>
                            <TabPanel>
                                <h5 className="text-uppercase">
                                    <span className="txt-green">W</span>
                                    hy an NDB token?
                                </h5>
                                <p className="divide my-3"></p>
                                <p>
                                    <strong>
                                        Since the beginning of NDB’s project the vision is to
                                        provide clean green technologies to the world.
                                    </strong>{" "}
                                    The NDB token is not a security token nor does it represent any
                                    shares of NDB SA. By using NDB token you will be able to
                                    contribute to the development of our technologies and our
                                    vision. We plan to expand our ecosystem to multiple areas
                                    including deep space exploration, sustainable fashion, quantum
                                    computing, and more.
                                    <br />
                                    <br />
                                    We will issue 918.000.000 NDB tokens, new tokens will never be
                                    created,{" "}
                                    <strong>
                                        you will be able to change, interact, and transform your NDB
                                        token in the open market or inside our ecosystem boosting
                                        the advancement of research projects by either placing your
                                        NDB token inside a pool.
                                    </strong>{" "}
                                    Actual pools can be organised within our ecosystem and our
                                    partners, in this case putting your NDB tokens in a pool
                                    contributes to the development of the pool’s owner technologies
                                    and future products that will eventually be delivered in
                                    collaboration with NDB SA.
                                </p>
                            </TabPanel>
                            <TabPanel>
                                <p>Volt Token content</p>
                            </TabPanel>
                            <TabPanel>
                                <p>Stake pool content</p>
                            </TabPanel>
                        </Tabs>
                    </TabPanel>

                    <TabPanel>
                        <Tabs className="sub-faq__tabs">
                            <TabList className="sub-faq__tabs-list">
                                <Tab className="sub-faq__tabs-tab">Auction</Tab>
                            </TabList>
                            <TabPanel>
                                <p className="question-label">Question</p>
                                <div className="faq-list">
                                    {faqs?.map((question, idx) => (
                                        <Accordion {...question} key={idx} />
                                    ))}
                                </div>
                            </TabPanel>
                        </Tabs>
                    </TabPanel>
                </Tabs>
            </section>
        </main>
    )
}

export default FAQ
