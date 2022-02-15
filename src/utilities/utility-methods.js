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

export const getShuftiStatusByReference = async (reference) => {
    if (!reference) return null

    const { data } = await axios.post(
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

    if ("verification_result" in data) {
        const output = {
            docStatus:
                data.verification_result.document.document === 1 ||
                (data.verification_result.document.document_must_not_be_expired === 1 &&
                    data.verification_result.document.document_visibility === 1 &&
                    data.verification_result.document.selected_type),
            addrStatus:
                data.verification_result.address.full_address === 1 ||
                (data.verification_result.address.match_address_proofs_with_document_proofs === 1 &&
                    data.verification_result.address.address_document_must_not_be_expired === 1 &&
                    data.verification_result.address.selected_type &&
                    data.verification_result.address.address_document_visibility === 1 &&
                    data.verification_result.address.address_document === 1),
            conStatus:
                data.verification_result.consent.consent === 1 &&
                data.verification_result.consent.selected_type,
            selfieStatus: data.verification_result.face === 1,
        }
        console.log(output)
        return output
    }

    return null
}
