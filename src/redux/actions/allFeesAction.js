import * as types from './../actionTypes';

export const set_All_Fees = data => dispatch => {
    dispatch({
        type: types.SET_ALL_FEES,
        payload: { ...data }
    })
};