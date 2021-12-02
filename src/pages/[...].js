import React from 'react';
import { Router } from '@gatsbyjs/reach-router';

import Purchase from "./purchase/home";
import PurchaseWithSign from "./purchase/homeWithSign";

const Test = () => (<div>Test</div>)

const App = () => {
    return (
        <>
            <Router>
                <Purchase path="/purchase/home" />
                <PurchaseWithSign path="/purchase/homeWithSign" />
                <Test path="/test" /> 
            </Router>
        </>
    );
};

export default App;