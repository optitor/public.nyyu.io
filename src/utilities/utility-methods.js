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
    const payload = {
        reference,
    }

    const token = btoa(`${CLIENT_ID}:${SECRET}`);

    const { data } = await axios.post('https://api.shuftipro.com/status', payload, {
        headers: {
            'Authorization': `Basic ${token}`
        },
    })

    console.log(data)

    return data
}