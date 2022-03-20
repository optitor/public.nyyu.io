import * as types from './../actionTypes';

export const tempReducer = (state ={}, action) => {
    switch(action.type) {
      case types.SET_TEMP_DATA:
        return { ...action.payload };
      default:
        return state;
    }
}

export const profileTabReducer = (state = 0, action) => {
    switch(action.type) {
      case types.CREATE_NOTIFICATION_ROUTE:
        return 1;
      case types.DISABLE_NOTIFICATION_ROUTE:
        return 0;
      default:
        return state;
    }

}
