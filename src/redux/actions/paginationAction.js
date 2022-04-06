import * as types from "../actionTypes";

export const set_Page = (page = 1, limit = 5, total = 0) => dispatch => {
    dispatch({
        type: types.PAGINATION_SET_PAGE,
        payload: { page, limit, total }
    })
};