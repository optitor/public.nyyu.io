import { gql, useQuery, useMutation } from '@apollo/client';
import { CAPTURE_ORDER_FOR_DEPOSIT } from "../apollo/graghqls/mutations/Payment";
import fetch from "node-fetch";
import { API_BASE_URL } from '../utilities/staticData';

export default async function handler(req, res) {
    const url = `${API_BASE_URL}/graphql`;
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CLIENT_TOKEN}`,
    }

    let orderId = req.query.token;

    try {
        const result = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                query: `
                  mutation CaptureOrderForDeposit {
                    captureOrderForDeposit(orderId: "${orderId}")
                  }`,
              }),
        }).then(res => {
            return res.json()
        })
        res.json(result)
    } catch (error) {
        res.status(500).send(error)
    }
}
