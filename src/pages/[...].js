import React from 'react';
import { Router } from '@gatsbyjs/reach-router';

import Purchase from "./purchase/home";
import PurchaseWithSign from "./purchase/homeWithSign";
import Auction from "./purchase/auction";



const App = () => {
    return (
        <>
            <Router>
                <Purchase path="/purchase/home" />
                <PurchaseWithSign path="/purchase/homeWithSign" />
                <Auction path="/purchase/auction" /> 
            </Router>
        </>
    );
};

export default App;