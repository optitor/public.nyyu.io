import React from "react"
import Header from "../components/header"
import { FAQ_CONTENT } from "../utilities/staticData"
import Accordion from "../components/common/Accordion"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { SupportReset } from "../utilities/imgImport"

const FAQ = () => {
    return (
        <main className="faq-page">
            <Header />
            <section className="container px-sm-5 px-4 pb-5 pb-sm-0">
                <Tabs className="faq__tabs">
                    <TabList className="faq__tabs-list">
                        <Tab className="faq__tabs-tab w-100 pb-2 pb-sm-0">help center</Tab>
                    </TabList>
                    <TabPanel>
                        <Tabs className="sub-faq__tabs">
                            <TabList className="sub-faq__tabs-list">
                                <Tab className="sub-faq__tabs-tab text-uppercase">self-service</Tab>
                                <Tab className="sub-faq__tabs-tab text-uppercase">faq</Tab>
                                <Tab className="sub-faq__tabs-tab text-uppercase">news</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="row">
                                    <div className="text-light border border-1 border-light text-center support-self-security-item">
                                        <img src={SupportReset} alt="reset" />
                                        <div>Reset Password</div>
                                    </div>
                                    <div className="text-light border border-1 border-light text-center support-self-security-item">
                                        <img src={SupportReset} alt="reset" />
                                        <div>Reset Password</div>
                                    </div>
                                    <div className="text-light border border-1 border-light text-center support-self-security-item">
                                        <img src={SupportReset} alt="reset" />
                                        <div>Reset Password</div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <p className="question-label d-sm-block d-none">Question</p>
                                <div className="faq-list">
                                    {FAQ_CONTENT?.map((question, idx) => (
                                        <Accordion {...question} key={idx} />
                                    ))}
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <p className="question-label d-sm-block d-none">Question</p>
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
