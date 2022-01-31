import React, { useState } from "react"
import { Input } from "../common/FormControl"
import Select from "react-select"
import { countryList } from "../../utilities/countryAlpha2"
import { getCountryCallingCode } from "react-phone-number-input/input"

const Countries = countryList.map((item) => {
    return { label: item.name, value: item["alpha-2"] }
})

export default function ConnectMobile({ confirm }) {
    const [country, setCountry] = useState(null)
    const [countryCode, setCountryCode] = useState("")
    const [mobile, setMobile] = useState("")
    return (
        <div className="input_mobile form-group">
            <h3>Connect Mobile</h3>
            <div className="mobile-input-field">
                <div className="country-code-select">
                    <svg
                        className="search-icon text-light"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                    </svg>
                    <Select
                        className="mb-2"
                        options={Countries}
                        value={country}
                        onChange={(selected) => {
                            const code = `+${getCountryCallingCode(selected?.value)} `
                            setCountry(selected)
                            setCountryCode(code)
                            setMobile(code)
                        }}
                    />
                </div>
                <Input
                    type="text"
                    value={mobile}
                    onChange={(e) => {
                        const input = e.target.value
                        setMobile(countryCode + input.substr(countryCode.length))
                    }}
                />
            </div>
            <p>You will receive a sms code to the number above</p>
            <button className="btn-primary next-step mt-4" onClick={() => confirm(mobile)}>
                Confirm Number
            </button>
        </div>
    )
}
