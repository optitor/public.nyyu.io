import React, { useState, useMemo } from "react"
import { Link } from "gatsby"
import { Icon } from '@iconify/react';
import validator from "validator";

import Seo from "../../../components/seo"
import Stepper from "../../../components/admin/Stepper";
import LayoutForCreate from "../../../components/admin/LayoutForCreate";

import Alert from '@mui/material/Alert';
import Select from 'react-select';
import { countryList } from "../../../utilities/countryAlpha2";

const Countries = countryList.map(item => {
    return {label: item.name, value: item["alpha-2"]};
});

const Roles = [
    {label: 'USER', value: 'user'},
    {label: 'ADMIN', value: 'admin'}
];

const IndexPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showError, setShowError] = useState(false);

    //------- Round Data and Validation
    // Round Data
    const initialDetails = {
        email: '',
        country: {},
        role: {}
    };
    const [details, setDetails] = useState(initialDetails);

    // Details Data Validation
    const detailsDataError = useMemo(() => {
        if(!details.email) return {email: 'Email is required'};
        if(!validator.isEmail(details.email)) return {email: 'Email is invalid'};
        if(!details.country.value) return {country: 'Please select country'};
        if(!details.role.value) return {role: 'Please select role'};
        return {};
    }, [details]);    

    //-------- Token Data and Validation
    // Token Data
    const initialTokenData = { tokenAmount: '', ReservedPrice: '', totalTokenAmount: '', prevReservedPrice: '' };
    const [tokenData, setTokenData] = useState(initialTokenData);

    // Token Data Validation
    let tokenDataError = {};
    tokenDataError = useMemo(() => {
        if(!tokenData.tokenAmount) return {tokenAmount: 'Token Amount is required'};
        if(!validator.isNumeric(tokenData.tokenAmount)) return {tokenAmount: 'Token Amount must be number'};
        if(!tokenData.ReservedPrice) return {ReservedPrice: 'Reserved Price is required'};
        if(!validator.isNumeric(tokenData.ReservedPrice)) return {ReservedPrice: 'Reserved Price must be number'};
        return {};
    }, [tokenData]);

    //--------- Avatar Data
    const avatars = [
        { value: 'tesla.svg', label: 'Tesla' },
        { value: 'volta.svg', label: 'Volta' },
        { value: 'meitner.svg', label: 'Meitner' },
        { value: 'johnson.svg', label: 'Johnson' },
        { value: 'fermi.svg', label: 'Fermi' },
        { value: 'failla.svg', label: 'Failla' },
        { value: 'curie.svg', label: 'Curie' },
        { value: 'cruto.svg', label: 'Cruto' },
    ];
    const [avatar, setAuctionAvatar] = useState(avatars[0]);
    


    const setUserDetails = () => {
        // if(Object.values(detailsDataError)[0]) {
        //     setShowError(true);
        //     return;
        // }
        console.log(details)
        setCurrentStep(2);
        setShowError(false);
    };

    const setAvatar = () => {
        // if(Object.values(tokenDataError)[0]) {
        //     setShowError(true);
        //     return;
        // }
        setCurrentStep(3);
        setShowError(false);
    };

    const setUserName = () => {
        setCurrentStep(4);
    };

    const handleSubmit = () => {
        alert('Created Auction Successfully')
    };

    return (
        <>
            <Seo title="Create User" />
            <main className="create-user-page">
                <LayoutForCreate>
                    <Link className="close" to="/admin"><Icon icon="codicon:chrome-close" /></Link>
                    <p className="subtitle">Create a User</p>
                    <Stepper currentStep={currentStep} texts={['User Details', 'Avatar', 'Name']}/>
                    {currentStep === 1 && (
                        <>
                            <div className="input_div">
                                {showError? (Object.values(detailsDataError)[0]? <Alert severity="error">{Object.values(detailsDataError)[0]}</Alert>: <Alert severity="success">Success! Please click Next Button</Alert>): ''}
                                <div className="div1">
                                    <div>
                                        <p>Email</p>
                                        <input className={`black_input ${showError && detailsDataError.email? 'error': ''}`}
                                            value={details.email} 
                                            onChange={e => setDetails({...details, email: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <p>Country of residence</p>
                                        <Select
                                            className={`black_input ${showError && detailsDataError.country? 'error': ''}`}
                                            value={details.country}
                                            onChange={selected => {
                                                setDetails({...details, country: selected});
                                            }}
                                            options={Countries}
                                            styles={customSelectStyles}
                                        />
                                    </div>                                    
                                </div>
                                <div className="div1 mt-3">
                                    <div>
                                        <p>Role</p>
                                        <Select
                                            className={`black_input ${showError && detailsDataError.role? 'error': ''}`}
                                            value={details.role}
                                            onChange={selected => {
                                                setDetails({...details, role: selected});
                                            }}
                                            options={Roles}
                                            styles={customSelectStyles}

                                        />
                                    </div>
                                    <div>
                                        <p className="disabled">Password</p>
                                        <input  className='black_input disabled' disabled
                                            placeholder="Auto generated and send to email"
                                        />
                                    </div>                                    
                                </div>
                            </div>
                            <div className="button_div">
                                <Link className="btn previous" to="/admin">Cancel</Link>
                                <button className="btn next" onClick={setUserDetails}>Next</button>
                            </div>
                        </>
                    )}
                    {currentStep === 2 && (
                        <>
                            <div className="input_div">
                            {showError? (Object.values(tokenDataError)[0]? <Alert severity="error">{Object.values(tokenDataError)[0]}</Alert>: <Alert severity="success">Success! Please click Next Button</Alert>): ''}
                                
                            </div>
                            <div className="button_div">
                                <button className="btn previous" onClick={() => setCurrentStep(1)}>Previous</button>
                                <button className="btn next" onClick={setAvatar}>Next</button>
                            </div>
                        </>
                    )}
                    {currentStep === 3 && (
                        <>
                            <div className="input_div">
                                
                            </div>
                            <div className="button_div">
                                <button className="btn previous" onClick={() => setCurrentStep(2)}>Previous</button>
                                <button className="btn next" onClick={setUserName}>Next</button>
                            </div>
                        </>
                    )}
                    {currentStep === 4 && (
                        <>
                            <div className="input_div">                               
                                
                            </div>
                            <div className="button_div">
                                <button className="btn previous" onClick={() => setCurrentStep(3)}>Previous</button>
                                <button className="btn next" onClick={handleSubmit}>Save</button>
                            </div>
                        </>
                    )}
                </LayoutForCreate>
            </main>
        </>
    )
}

export default IndexPage;

const customSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: 'white',
      backgroundColor: state.isSelected ? '#23c865' : '#1e1e1e',
      fontSize: 14
    }),
    control: provided => ({
      ...provided,
      backgroundColor: '#1e1e1e',
      border: 'none',
      borderRadius: 0
    }),
    menu: provided => ({
        ...provided,
        backgroundColor: '#1e1e1e',
        border: '1px solid white',
    }),
    singleValue: provided => ({
        ...provided,
        color: 'white',
    }),
    input: provided => ({
        ...provided,
        color: 'white'
    })
};