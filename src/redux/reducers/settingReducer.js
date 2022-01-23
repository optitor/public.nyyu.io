import * as types from "../actionTypes";

export const userTierReducer = (state = {}, action) => {
    switch(action.type) {
        case types.GET_USER_TIERS:
            return { ...state, ...action.payload };
        case types.CREATE_USER_TIER:
        case types.UPDATE_USER_TIER:
            return { ...state, [action.payload.level]: action.payload };
        case types.DELETE_USER_TIER:
            delete state[action.payload];
            return { ...state };
        default:
            return state;
    }
};
