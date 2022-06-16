import { FILL_USER_TIERS } from "../actionTypes";

export const tierReducer = (state = {}, action) => {
    switch(action.type) {
        case FILL_USER_TIERS:
            return action.payload;
        default:
            return state;
    }
}