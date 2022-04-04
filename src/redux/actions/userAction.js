import { client } from "../../apollo/client";
import _ from 'lodash';
import { showFailAlarm, showSuccessAlarm } from "../../components/admin/AlarmModal";
import * as Mutation from './../../apollo/graphqls/mutations/User';
import * as Query from '../../apollo/graphqls/querys/User';
import * as types from '../actionTypes';

export const create_New_User = createData => async dispatch => {
    try {
        const { data } = await client.mutate({
            mutation: Mutation.CREATE_NEW_USER,
            variables: { ...createData }
        });
        if(data.createNewUser) {
            showSuccessAlarm('User created successfully');
        }
    } catch(err) {
        if(err.message === 'already_exists') {
            showFailAlarm('Action failed', 'User with this email already exists');
        } else {
            showFailAlarm('Action failed', 'Ops! Something went wrong!');
        }
    }
};

export const get_Users = () => async dispatch => {
    try {
        const { data } = await client.query({
            query: Query.GET_USERS
        });
        if(data.getPaginatedUsers) {
            const users = _.mapKeys(data.getPaginatedUsers, 'id');
            dispatch({
                type: types.FETCH_DATA,
                payload: users
            });
        }
    } catch(err) {
        console.log(err.message);
    }
};