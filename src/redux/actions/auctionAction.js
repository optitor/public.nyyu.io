import _ from 'lodash';
import { client } from "../../apollo/client";
import * as Mutation from './../../apollo/graghqls/mutations/Auction';
import * as Query from './../../apollo/graghqls/querys/Auction';
import { showFailAlarm, showSuccessAlarm } from "../../components/admin/AlarmModal";
import { FETCH_DATA } from '../actionTypes';

export const create_Auction = createData => async dispatch => {
    try {
        await client.mutate({
            mutation: Mutation.CREATE_AUCTION,
            variables: { ...createData }
        });
        showSuccessAlarm('Auction created successfully');
    } catch(err) {
        console.log(err.message);
        showFailAlarm('Action failed', err.message);
    }
};

export const get_Auctions = () => async dispatch => {
    try {
        const { data } = await client.query({
            query: Query.GET_AUCTIONS
        });
        const dataList = _.mapKeys(data.getAuctions, 'id');
        dispatch({
            type: FETCH_DATA,
            payload: dataList
        });
    } catch(err) {
        console.log(err.message);
        showFailAlarm('Action failed', err.message);
    }
};