import React,{useEffect} from "react";
import { navigate } from 'gatsby';
import { useDispatch, useSelector } from "../../context/store"
import * as Actions from '../../context/actions'

const OAuth2RedirectHandler = (props) => {
    const getUrlParameter = (name) => {
        name = name.replace(/\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(props.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    const token = getUrlParameter('token');
    
    const dispatch = useDispatch();

    const userData = useSelector(state=>state.user)

    
    useEffect(()=>{
        handleToken(token)
    },[token])
    
    const handleToken = (token) => {
        console.log("token", userData)
        if(token) {
            dispatch(Actions.setUserInfo({...userData, token: token}))
            navigate("/onetime-pwd");
        } else {
            navigate("/signin");
        }
    }
    

    return <></>
}

export default OAuth2RedirectHandler;