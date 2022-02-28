import * as types from './../actionTypes';

export const tempReducer = (state ={}, action) => {
    switch(action.type) {
      case types.SET_TEMP_DATA:
        return { ...action.payload };
      default:
        return state;
    }
}