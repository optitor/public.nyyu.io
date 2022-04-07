import axios from "axios";

export const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const getCurrentDate = () => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    return today;
};

export const getShuftiStatusByReference = async (reference) => {
    if (!reference) return "INVALID";
    const clientId = process.env.GATSBY_SHUFTI_CLIENT;
    const secret = process.env.GATSBY_SHUFTI_SECRET;
    const output = {};
    const response = await axios
        .post(
            "https://api.shuftipro.com/status",
            {
                reference,
            },
            {
                headers: {
                    Authorization: `Basic ${btoa(`${clientId}:${secret}`)}`,
                },
            }
        )
        .catch((error) => (output["event"] = "request.invalid"));

    if ("event" in output) {
        output["docStatus"] = false;
        output["addrStatus"] = false;
        output["conStatus"] = false;
        output["selfieStatus"] = false;
        return output;
    }
    if (response && "data" in response) {
        const { data } = response;
        if ("verification_result" in data && "event" in data) {
            if (data.event === null) output["event"] = "request.invalid";
            else output["event"] = data.event;

            // Document
            if ("document" in data.verification_result)
                output["docStatus"] =
                    data.verification_result.document.document === 1 ||
                    (data.verification_result.document
                        .document_must_not_be_expired === 1 &&
                        data.verification_result.document
                            .document_visibility === 1);
            else output["docStatus"] = true;

            // Address
            if ("address" in data.verification_result)
                output["addrStatus"] =
                    data.verification_result.address.full_address === 1 &&
                    data.verification_result.address
                        .match_address_proofs_with_document_proofs === 1 &&
                    data.verification_result.address
                        .address_document_must_not_be_expired === 1 &&
                    data.verification_result.address
                        .address_document_visibility === 1 &&
                    data.verification_result.address.address_document === 1;
            else output["addrStatus"] = true;

            //Consent
            if ("consent" in data.verification_result)
                output["conStatus"] =
                    data.verification_result.consent.consent === 1;
            else output["conStatus"] = true;

            // Selfie
            if ("face" in data.verification_result)
                output["selfieStatus"] = data.verification_result.face === 1;
            else output["selfieStatus"] = true;

            return output;
        }
        return "PENDING";
    }

    return "UNSET";
};

export const createPaymentIntent = (paymentMethodId, amount) => {
    const apiBaseUrl = "https://api.stripe.com/v1/payment_intents";
    const response = axios.post(apiBaseUrl, {
        paymentMethodId,
        amount,
        currency: "usd",
        confirmation_method: "manual",
        confirm: "true",
    });
    if (response && "data" in response) {
    }
};

export const getStripePaymentFee = (user, allFees, bidAmount) => {
    // finding the fee.
    let userTierLevel = user?.tierLevel;
    if (userTierLevel === 0)
        userTierLevel = 1
    const userFee = allFees[userTierLevel]?.fee;
    const stripePaymentFee = ((2.9 + userFee) * bidAmount) / 100 + 0.3;
    return stripePaymentFee.toFixed(2);
};

export const getPaypalPaymentFee = (user, allFees, bidAmount) => {
    const PaypalTrxFee = 5;
    // finding the fee.
    let userTierLevel = user?.tierLevel;
    if (userTierLevel === 0)
        userTierLevel = 1
    const userFee = allFees[userTierLevel]?.fee;
    const paypalPaymentFee = ((PaypalTrxFee + userFee) * bidAmount) / 100 + 0.3;
    return paypalPaymentFee.toFixed(2);
};

export const createDateFromDateObject = (newDate = new Date()) => {
    const today = newDate
    let month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    let day = today.getDate();
    if (day < 10) day = "0" + day;
    let year = today.getFullYear();

    return year + "-" + month + "-" + day;
};
export const getNDBWalletPaymentFee = (user, allFees, bidAmount) => {
    // Finding the fee based on the user.
    const allFeesArray = Object.values(allFees)
    let userTierLevel = user?.tierLevel;
    if (userTierLevel === 0)
        userTierLevel = 1
    const userFee = allFeesArray.filter(
        (item) => item?.tierLevel === userTierLevel
    )[0]?.fee;

    return ((userFee * bidAmount) / 100)
}

export const getCurrentMarketCap = async () => {
    const { data } = await axios.get("https://api.dev.nyyu.io/marketcap")
    if (data)
        return data
    return null
}