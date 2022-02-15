import axios from "axios"
import { CLIENT_ID, SECRET } from "./staticData"

export const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

export const getCurrentDate = () => {
    let today = new Date()
    const dd = String(today.getDate()).padStart(2, "0")
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const yyyy = today.getFullYear()

    today = mm + "/" + dd + "/" + yyyy
    return today
}

export const getShuftiStatusByReference = async (reference) => {
    if (!reference) return "INVALID"
    const output = {}
    const response = await axios
        .post(
            "https://api.shuftipro.com/status",
            {
                reference,
            },
            {
                headers: {
                    Authorization: `Basic ${btoa(`${CLIENT_ID}:${SECRET}`)}`,
                },
            }
        )
        .catch((error) => (output["event"] = "request.invalid"))

    if ("event" in output) {
        output["docStatus"] = false
        output["addrStatus"] = false
        output["conStatus"] = false
        output["selfieStatus"] = false
        return output
    }
    if (response && "data" in response) {
        const { data } = response
        if ("verification_result" in data && "event" in data) {
            output["event"] = data.event

            output["docStatus"] =
                data.verification_result.document.document === 1 ||
                (data.verification_result.document.document_must_not_be_expired === 1 &&
                    data.verification_result.document.document_visibility === 1 &&
                    data.verification_result.document.selected_type)

            output["addrStatus"] =
                data.verification_result.address.full_address === 1 &&
                data.verification_result.address.match_address_proofs_with_document_proofs === 1 &&
                data.verification_result.address.address_document_must_not_be_expired === 1 &&
                data.verification_result.address.selected_type &&
                data.verification_result.address.address_document_visibility === 1 &&
                data.verification_result.address.address_document === 1

            output["conStatus"] =
                data.verification_result.consent.consent === 1 &&
                data.verification_result.consent.selected_type

            output["selfieStatus"] = data.verification_result.face === 1

            return output
        }
        return "INVALID"
    }

    return "UNSET"
}
