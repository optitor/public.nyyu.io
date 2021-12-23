import React from 'react';
import styled from 'styled-components';

const NotFound = () => {
    const goBackHistory = () => {
        window.history.back();
    };

    return (
        <NotFoundDiv>
            <h3>404: Not Found</h3>
            <p>Sorry. There is no page that you are looking for. <span>&#128543;</span></p>
            <Button onClick={goBackHistory}>Go back</Button>
        </NotFoundDiv>
    )
};

export default NotFound;

const NotFoundDiv = styled.div`
    margin-top: 30vh;
    text-align: center;
    h3 {
        margin-bottom: 10px
    }
    p {
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
    &:hover {
        border: 3px solid #23c865;
    }
`;