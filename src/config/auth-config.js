import { useApolloClient } from "@apollo/client";
import { useDispatch, useSelector } from "../context/store"
import * as Actions from "../context/actions"

// custom hook to handle authToken - we use compositon to decouple the auth system and it's storage
export const useAuthToken = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state) => state?.user)

    const setAuthToken = (token) => dispatch(Actions.setUserInfo({ ...userData, token }))
    return [userData.token, setAuthToken];
};

export const useAuthEmail = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state) => state?.user)

    const setAuthEmail = (email) => dispatch(Actions.setUserInfo({ ...userData, email }))
    return [userData.email, setAuthEmail];
};

export const useLogout = () => {
    const [ , , removeAuthToken] = useAuthToken();
    const apolloClient = useApolloClient();

    const logout = async () => {
        await apolloClient.clearStore(); // we remove all information in the store
        removeAuthToken();
    };
    return logout;
};
