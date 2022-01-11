import React from "react"
import Header from "../components/header"
import { FAQ_CONTENT } from "../utilities/staticData"
import Accordion from "../components/common/Accordion"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"

const FAQ = () => {
    return (
        <main className="faq-page">
            <Header />
            <section className="container">
                <Tabs className="faq__tabs">
                    <TabList className="faq__tabs-list">
                        <Tab className="faq__tabs-tab">Auction FAQ</Tab>
                    </TabList>
                    <TabPanel>
                        <Tabs className="sub-faq__tabs">
                            <TabList className="sub-faq__tabs-list">
                                <Tab className="sub-faq__tabs-tab">Auction</Tab>
                            </TabList>
                            <TabPanel>
                                <p className="question-label">Question</p>
                                <div className="faq-list">
                                    {FAQ_CONTENT?.map((question, idx) => (
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
