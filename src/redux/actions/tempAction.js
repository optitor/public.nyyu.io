import * as types from './../actionTypes';

export const set_Temp_Data = data => dispatch => {
    dispatch({
        type: types.SET_TEMP_DATA,
        payload: { ...data }
    })
};

export const updateHiddenStatus = status => dispatch => {
    dispatch({
        type: types.UPDATE_HIDDEN_STATUS,
        payload: status
    })
}

export const changeEquity = equity => dispatch => {
    dispatch({
        type: types.CHANGE_EQUITY,
        payload: equity
    })
}