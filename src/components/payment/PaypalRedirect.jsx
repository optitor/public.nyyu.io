import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { useMutation } from '@apollo/client';

import * as Mutation from '../../apollo/graphqls/mutations/Payment';
import { getCookie, NDB_Paypal_TrxType, NDB_Auction, NDB_Presale, NDB_Deposit } from '../../utilities/cookies';
import { ROUTES } from '../../utilities/routes';

const TIMEOUT = 1500;

const PaypalRedirect = () => {

    const [captureOrderForAuction] = useMutation(Mutation.CAPTURE_ORDER_FOR_AUCTION, {
        onCompleted: (data) => {
            if (data.captureOrderForAuction) {
                alert("Your paypal payment for Auction was done successfully!");
            } else {
                console.log("Error in checkout with PayPal in complete");
            }
            setTimeout(() => {
                navigate(ROUTES.auction);
            }, TIMEOUT);
        },
        onError: (err) => {
            alert("Error in checkout with PayPal");
            setTimeout(() => {
                navigate(ROUTES.auction);
            }, TIMEOUT);
        },
    });

    const [captureOrderForPresale] = useMutation(Mutation.CAPTURE_ORDER_FOR_PRESALE, {
        onCompleted: data => {
            if (data.captureOrderForPresale) {
                alert("Your paypal payment for Presale was done successfully!");
            } else {
                console.log("Error in checkout with PayPal in complete");
            }
            setTimeout(() => {
                navigate(ROUTES.auction);
            }, TIMEOUT);
        },
        onError: err => {
            alert('Error in checkout with PayPal');
            setTimeout(() => {
                navigate(ROUTES.auction);
            }, TIMEOUT);
        }
    });

    const [captureOrderForDeposit] = useMutation(Mutation.CAPTURE_ORDER_FOR_DEPOSIT, {
        onCompleted: data => {
            if (data.captureOrderForDeposit) {
                alert("Your paypal payment for Deposit was done successfully!");
            } else {
                console.log("Error in checkout with PayPal in complete");
            }
            setTimeout(() => {
                navigate(ROUTES.wallet);
            }, TIMEOUT);
        },
        onError: err => {
            alert('Error in checkout with PayPal');
            setTimeout(() => {
                navigate(ROUTES.wallet);
            }, TIMEOUT);
        }
    });

    useEffect(() => {
        if (
            window.location.href.includes("token=")
        ) {
            const url = new URL(window.location.href);
            const token = url.searchParams.get("token");
            const paypalTrxType = getCookie(NDB_Paypal_TrxType);
            console.log(paypalTrxType, token)
            switch(paypalTrxType) {
                case NDB_Auction:
                    captureOrderForAuction({ variables: { orderId: token } });
                    break;
                case NDB_Presale:
                    captureOrderForPresale({ variables: { orderId: token } });
                    break;
                case NDB_Deposit:
                    captureOrderForDeposit({ variables: { orderId: token } });
                    break;
                default:
                    break
            }
        }
    }, [captureOrderForAuction, captureOrderForPresale, captureOrderForDeposit]);

    return (
        <div></div>
    );
};

export default PaypalRedirect;