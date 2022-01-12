import { LOGIN_SUCCESS, LOGOUT_USER } from "../actionTypes";

export const logInUser = authInfo => dispatch => {
    dispatch({
        type: LOGIN_SUCCESS,
        payload: {
            isAuthenticated: true,
            user: authInfo
        }
    });
};

export const logOutUser = () => dispatch => {
    dispatch({
        type: LOGOUT_USER
    });
};

export const setCurrentAuthInfo = authInfo => dispatch => {
    dispatch({
        type: LOGIN_SUCCESS,
        payload: {
            isAuthenticated: true,
            user: authInfo
        }
    });
};

