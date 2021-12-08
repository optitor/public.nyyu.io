import React, { useState, useEffect } from "react"
import Header from "../components/common/header"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { getSecTomorrow, numberWithLength } from "../utilities/number"
import Slider from "rc-slider"
import { Chart, Qmark } from "../utilities/imgImport"
import Select from "react-select"

const ndb_token = `Since the beginning of NDB’s project the vision is to provide clean green technologies to the world. The NDB token is not a security token nor does it represent any shares of NDB SA.

By using NDB token you will be able to contribute to the development of our technologies and our vision. We plan to expand our ecosystem to multiple areas including deep space exploration, sustainable fashion, quantum computing, and more. 
`
const statistics = [
    {
        rank: 1,
        placement: "TeslaFirst",
        bid: "1300",
    },
    {
        rank: 2,
        placement: "Volta Pancake",
        bid: "850",
    },
    {
        rank: 3,
        placement: "Meitner Cat",
        bid: "400",
    },
    {
        rank: 4,
        placement: "Curie Mobile",
        bid: "305",
    },
    {
        rank: 5,
        placement: "Tesla.12",
        bid: "100",
    },
    {
        rank: 99,
        placement: "You",
        bid: "5",
    },
]
const options = [
    { value: "statistics", label: "STATISTICS" },
    { value: "ndb_token", label: "NDB TOKEN" },
    { value: "bid_performance", label: "BID PERFORMANCE" },
]

const Auction = () => {
    const [tabIndex, setTabIndex] = useState(0)
    const duration = 86400
    const [curTime, setCurTime] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    const [amount, setAmount] = useState(0)
    const [price, setPrice] = useState(0)
    const distanceToDate = getSecTomorrow()
    const percentage = (distanceToDate / duration) * 100

    useEffect(() => {
        const id = setInterval(() => {
            setCurTime({
                hours: parseInt(getSecTomorrow() / (60 * 60)),
                minutes: parseInt((getSecTomorrow() % (60 * 60)) / 60),
                seconds: parseInt(getSecTomorrow() % 60),
            })
        }, 1000)
        return () => {
            clearInterval(id)
        }
    }, [])

    return (
        <main className="auction-page">
            <Header />
            <section className="section-auction container">
                <div className="row">
                    <div className="auction-left col-lg-4 col-md-5">
                        <Tabs className="round-tab">
                            <TabList>
                                <Tab>Round 19</Tab>
                                <Tab>Round 20</Tab>
                                <Tab>Round 21</Tab>
                            </TabList>
                            <TabPanel>
                                Token Available <span className="fw-bold">8000</span>
                            </TabPanel>
                            <TabPanel>
                                Token Available <span className="fw-bold">7000</span>
                            </TabPanel>
                            <TabPanel>
                                Token Available <span className="fw-bold">6000</span>
                            </TabPanel>
                        </Tabs>
                        <Tabs
                            className="statistics-tab"
                            selectedIndex={tabIndex}
                            onSelect={(index) => setTabIndex(index)}
                        >
                            <TabList>
                                <Tab>Ndb token</Tab>
                                <Tab>StatiStics</Tab>
                                <Tab>Bids history</Tab>
                            </TabList>
                            <TabPanel>
                                <p className="text">{ndb_token}</p>
                                <div className="timeframe-bar">
                                    <div
                                        className="timeleft"
                                        style={{
                                            width: percentage + "%",
                                            background:
                                                "linear-gradient(270deg, #941605 60%, #de4934 86.3%)",
                                            transform: "rotate(-180deg)",
                                        }}
                                    ></div>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <div>
                                        <p className="caption">Minimum bid</p>
                                        <p className="value">15 ETH</p>
                                    </div>
                                    <div>
                                        <p className="caption">Available Until</p>
                                        <p className="value">
                                            {numberWithLength(curTime.hours, 2)}:
                                            {numberWithLength(curTime.minutes, 2)}:
                                            {numberWithLength(curTime.seconds, 2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center mt-5 mb-5">
                                    <button className="btn-primary btn-increase">
                                        Increase bid
                                    </button>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Placement</th>
                                            <th>Highest bid per token</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {statistics.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.rank + ". " + item.placement}</td>
                                                <td>
                                                    {item.bid}
                                                    <span className="txt-green"> $</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="timeframe-bar">
                                    <div
                                        className="timeleft"
                                        style={{
                                            width: percentage + "%",
                                            background:
                                                "linear-gradient(270deg, #FFFFFF 0%, #23C865 62.5%)",
                                        }}
                                    ></div>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <div>
                                        <p className="caption">Minimum bid</p>
                                        <p className="value">15 ETH</p>
                                    </div>
                                    <div>
                                        <p className="caption">Available Until</p>
                                        <p className="value">
                                            {numberWithLength(curTime.hours, 2)}:
                                            {numberWithLength(curTime.minutes, 2)}:
                                            {numberWithLength(curTime.seconds, 2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center mt-5 mb-5">
                                    <button className="btn-primary btn-increase">
                                        Increase bid
                                    </button>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <p className="text">{ndb_token}</p>
                                <div className="timeframe-bar">
                                    <div
                                        className="timeleft"
                                        style={{
                                            width: percentage + "%",
                                            background:
                                                "linear-gradient(270deg, #FFFFFF 0%, #23C865 62.5%)",
                                        }}
                                    ></div>
                                </div>
                                <div className="d-flex justify-content-between mt-4">
                                    <div>
                                        <p className="caption">Minimum bid</p>
                                        <p className="value">15 ETH</p>
                                    </div>
                                    <div>
                                        <p className="caption">Available Until</p>
                                        <p className="value">
                                            {numberWithLength(curTime.hours, 2)}:
                                            {numberWithLength(curTime.minutes, 2)}:
                                            {numberWithLength(curTime.seconds, 2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center mt-5">
                                    <button className="btn-primary btn-increase">
                                        Increase bid
                                    </button>
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                    <div className="auction-right col-lg-8 col-md-7">
                        {tabIndex === 0 && (
                            <div className="place-bid">
                                <h3 className="range-label">amount of Token</h3>
                                <div className="d-flex align-items-center mb-4">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="range-input"
                                    />
                                    <Slider
                                        value={amount}
                                        onChange={(value) => setAmount(value)}
                                        min={0}
                                        max={10000}
                                        step={100}
                                    />
                                </div>
                                <h3 className="range-label">Per token price</h3>
                                <div className="d-flex align-items-center mb-4">
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => e.target.value}
                                        className="range-input"
                                    />
                                    <Slider
                                        value={price}
                                        onChange={(value) => setPrice(value)}
                                        min={0}
                                        max={10000}
                                        step={100}
                                    />
                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="range-label">Total price</span>
                                    <input
                                        className="total-input"
                                        type="number"
                                        value={price * amount}
                                        readOnly
                                    />
                                </div>
                                <button className="btn-primary text-uppercase w-100">
                                    Place Bid
                                </button>
                            </div>
                        )}
                        {tabIndex === 1 && (
                            <div className="chart-area">
                                <div className="d-flex align-items-center">
                                    <Select options={options} value={options[0]} />
                                    <img src={Qmark} alt="question" className="ms-3" />
                                </div>
                                <img src={Chart} alt="chart " className="w-100" />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Auction
