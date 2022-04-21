import _ from 'lodash';
import { client } from "../../apollo/client";
import * as Mutation from './../../apollo/graphqls/mutations/Approval';
import * as Query from './../../apollo/graphqls/querys/Approval';
import { showFailAlarm, showSuccessAlarm } from "../../components/admin/AlarmModal";
import * as types from '../actionTypes';

export const get_All_BankDeposit_Txns = () => async dispatch => {
    try {
        const { data } = await client.query({
            query: Query.GET_ALL_BANKDEPOSIT_TXNS
        });
        const dataListObject = _.mapKeys(data.getAllBankDepositTxns, 'id');
        dispatch({
            type: types.FETCH_DATA,
            payload: dataListObject
        });
    } catch(err) {
        showFailAlarm('Action failed', err.message);
    }
};

export const get_Unconfirmed_BankDeposit_Txns = () => async dispatch => {
    try {
        const { data } = await client.query({
            query: Query.GET_UNCONFIRMED_BANKDEPOSIT_TXNS
        });
        const dataListObject = _.mapKeys(data.getUnconfirmedBankDepositTxns, 'id');
        dispatch({
            type: types.FETCH_DATA,
            payload: dataListObject
        });
    } catch(err) {
        // console.log(err.message);
        showFailAlarm('Action failed', err.message);
    }
};

export const confirm_Bank_Deposit = confirmData => async dispatch => {
    try {
        const { data } = await client.mutate({
            mutation: Mutation.CONFIRM_BANK_DEPOSIT,
            variables: { ...confirmData }
        });
        if(data.confirmBankDeposit) {
            showSuccessAlarm('Bank Deposit approved successfully.')
            dispatch({
                type: types.UPDATE_DATUM,
                payload: data.confirmBankDeposit
            });
        }
    } catch(err) {
        console.log(err.message);
        showFailAlarm('Action failed', err.message);
    }
};

export const get_All_Crypto_Withdraws = () => async dispatch => {
    try {
        const { data } = await client.query({
            query: Query.GET_ALL_CRYPTO_WITHDRAWS
        });
        const dataListObject = _.mapKeys(data.getAllCryptoWithdraws, 'id');
        dispatch({
            type: types.FETCH_DATA,
            payload: dataListObject
        });
    } catch(err) {
        // console.log(err.message);
        showFailAlarm('Action failed', err.message);
    }
};

export const get_All_Paypal_Withdraws = () => async dispatch => {
    try {
        const { data } = await client.query({
            query: Query.GET_ALL_PAYPAL_WITHDRAWS
        });
        const dataListObject = _.mapKeys(data.getAllPaypalWithdraws, 'id');
        dispatch({
            type: types.FETCH_DATA,
            payload: dataListObject
        });
    } catch(err) {
        // console.log(err.message);
        showFailAlarm('Action failed', err.message);
    }
};