import _ from 'lodash';
import { client } from "../../apollo/client";
import * as Mutation from './../../apollo/graphqls/mutations/Auction';
import * as Query from './../../apollo/graphqls/querys/Approval';
import { showFailAlarm, showSuccessAlarm } from "../../components/admin/AlarmModal";
import * as types from '../actionTypes';

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