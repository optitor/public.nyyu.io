import React from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

const NotFound = () => {
    const goBackHistory = () => {
        window.history.back();
    };

    return (
        <NotFoundDiv>
            <h3>Something went wrong! &#128543;</h3>
            <p>Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</p>
            <Button onClick={goBackHistory}>
                <Icon icon="akar-icons:arrow-back-thick" />
                Go back
            </Button>
        </NotFoundDiv>
    )
};

export default NotFound;

const NotFoundDiv = styled.div`
    margin-top: 30vh;
    text-align: center;
    h3 {
        padding: 5px;
        margin-bottom: 10px
    }
    p {
        padding: 5px;
        margin-bottom: 20px;
        span {
            font-size: 25px;
        }
    }
`;

const Button = styled.button`
    border: 3px solid white;
    border-radius: 7px;
    background-color: transparent;
    width: 200px;
    height: 60px;
    font-size: 20px;
    font-weight: 600;
    svg {
        font-size: 28px;
        margin-right: 10px;
    }
    &:hover {
        border: 3px solid #23c865;
    }
`;