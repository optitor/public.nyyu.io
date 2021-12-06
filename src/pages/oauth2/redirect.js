import React from "react";
import { navigate } from 'gatsby';
// import { ACCESS_TOKEN } from '../../constants';

const OAuth2RedirectHandler = (props) => {
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(props.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    
    const token = getUrlParameter('token');
    if(token) {
        localStorage.setItem("ACCESS_TOKEN", getUrlParameter('token'));
        navigate('/verify/');
    } else {
        navigate('/login/');
    }

    return <></>
}

export default OAuth2RedirectHandler;