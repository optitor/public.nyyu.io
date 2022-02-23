import * as types from './../actionTypes';

export const set_Temp_Data = data => dispatch => {
    dispatch({
        type: types.SET_TEMP_DATA,
        payload: { ...data }
    })
};