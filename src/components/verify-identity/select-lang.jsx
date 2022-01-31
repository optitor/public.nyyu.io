import React from "react"
import Select from "react-select"

export default function SelectLang({ languages, langKey, onLangChange, ...rest }) {
    const langs = Object.keys(languages).map((key) => {
        return { label: languages[key].name, value: key }
    })

    return (
        <Select
            {...rest}
            options={langs}
            value={{ label: languages[langKey]?.name, value: langKey }}
            onChange={(res) => onLangChange(res)}
        />
    )
}
