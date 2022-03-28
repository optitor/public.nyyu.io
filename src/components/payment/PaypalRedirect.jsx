import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useMutation } from '@apollo/client';

import { CAPTURE_ORDER_FOR_AUCTION } from '../../apollo/graphqls/mutations/Payment';

const PaypalRedirect = () => {
    useEffect(() => {
        console.log(window.location.href);
        if(window.location.href.includes('token')) {
            navigate('/app/wallet/')
        }
    }, []);

    const [captureOrderForAuction] = useMutation(CAPTURE_ORDER_FOR_AUCTION, {
        onCompleted: (data) => {
            console.log(data);
            if (data.captureOrderForAuction) {
                alert("Your checkout was successfully!");
            } else {
                console.log("Error in checkout with PayPal in complete");
            }
        },
        onError: (err) => {
            alert("Error in checkout with PayPal");
        },
    });

    useEffect(() => {
        console.log(window.location.href)
        if (
            window.location.href.includes("token=")
        ) {
            const url = new URL(window.location.href);
            const token = url.searchParams.get("token");
            console.log(token)
            captureOrderForAuction({ variables: { orderId: token } });
        }
    }, []);

    return (
        <div></div>
    );
};

export default PaypalRedirect;