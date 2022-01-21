import {
  FETCH_DATA,
  UPDATE_DATUM,
  DELETE_DATUM
} from './../actionTypes';

export const dataReducer = (state = {}, action) => {
  switch(action.type) {
    case FETCH_DATA:
      state = action.payload;
      return { ...state };
    case UPDATE_DATUM:
      return { ...state, [action.payload.id]: action.payload };
    case DELETE_DATUM:
      delete state[action.payload];
      return { ...state };
    default:
      return state;
  }
};
