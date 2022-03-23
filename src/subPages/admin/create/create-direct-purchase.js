import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "gatsby";
import { Icon } from '@iconify/react';
import { useQuery } from "@apollo/client";
import validator from "validator";
import NumberFormat from "react-number-format";

import Seo from "../../../components/seo"
import Stepper from "../../../components/admin/Stepper";
import LayoutForCreate from "../../../components/admin/LayoutForCreate";
import { secondsToDhms } from "../../../utilities/number";

import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { MobileDateTimePicker   } from '@mui/lab';
import * as Query from "../../../apollo/graghqls/querys/Auction";
import { create_New_Presale } from "../../../redux/actions/auctionAction";

const IndexPage = () => {
    const dispatch = useDispatch();

    const [currentStep, setCurrentStep] = useState(1);
    const [showError, setShowError] = useState(false);
    const [pending, setPending] = useState(false);
    const totalTokenAmount = 1000000;
    const prevReservedPrice = 100;

    //------- Round Data and Validation
    // Round Data
    const initialRoundData = { roundNumber: '', startTime:  Date.now(), endTime:  Date.now() };
    const [roundData, setRoundData] = useState(initialRoundData);

    const { data: newRound } = useQuery(Query.GET_NEW_ROUND, {
        fetchPolicy: "network-only",
        onCompleted: () => {
            if(newRound.getNewRound) {
                setRoundData({ ...roundData, roundNumber: newRound.getNewRound });
            }
        },
    });

    const duration = useMemo(() => {
        if(!roundData.startTime || !roundData.endTime) return '';
        if(new Date(roundData.endTime) <= new Date(roundData.startTime)) return '';
        return new Date(roundData.endTime) - new Date(roundData.startTime) + 1000;
    }, [roundData]);

    // Round Data Validation
    let roundDataError = {};
    roundDataError = useMemo(() => {
        if(!roundData.roundNumber) return {roundNumber: 'Round Number is required'};
        if(!roundData.startTime) return {startTime: 'Round Start Time is required'};
        if(!validator.isDate(new Date(roundData.startTime))) return {startTime: 'Round Start Time is invalid'};        
        if(!roundData.endTime) return {endTime: 'Round End Time is required'};
        if(!validator.isDate(new Date(roundData.endTime))) return {endTime: 'Round End Time is invalid'};
        if(Math.round((new Date(roundData.endTime) - new Date(roundData.startTime))) <= 0) return {endTime: 'Round End Time must be after Start Time'};
        return {};
    }, [roundData]);

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

    //--------- Task Data and Validation
    // Task Data
    const [taskData, setTaskData] = useState([
        { task: '', url: '' },
        { task: '', url: '' },
    ]);

    const deleteTask = index => {
        let array = [...taskData]; 
        array.splice(index, 1);  
        setTaskData([...array]);
    }

    const taskDataError = useMemo(() => {
        if(!taskData.length) return {item: 'noTask', desc: 'One task is required at least'};
        for(let i = 0; i < taskData.length; i++) {
            if(!taskData[i].task) return {index: i, item: 'task', desc: 'Input is required'};
            if(!taskData[i].url) return {index: i, item: 'url', desc: 'Input is required'};
            if(!validator.isURL(taskData[i].url)) return {index: i, item: 'url', desc: 'Please enter a URL'};
        }
        return {};
    }, [taskData]);
   
    const setIDAndTime = () => {
        if(Object.values(roundDataError)[0]) {
            setShowError(true);
            return;
        }
        setCurrentStep(2);
        setShowError(false);
    };

    const setTokenAmountPrice = () => {
        if(Object.values(tokenDataError)[0]) {
            setShowError(true);
            return;
        }
        setCurrentStep(3);
        setShowError(false);
    };

    const setTasks = () => {
        if(taskDataError.item) {
            setShowError(true);
            return;
        }
        setCurrentStep(4);
        setShowError(false);
    };

    const handleSubmit = async () => {
        setPending(true);
        const createData = {
            startedAt: Number(roundData.startTime),
            endedAt: Number(roundData.endTime),
            tokenAmount: Number(tokenData.tokenAmount),
            tokenPrice: Number(tokenData.ReservedPrice),
            conditions: taskData,
        };
        await dispatch(create_New_Presale(createData));
        setPending(false);
    };

    return (
        <>
            <Seo title="Create Direct Purchase" />
            <main className="create-direct-purchase-page">
                <LayoutForCreate>
                    <Link className="close" to="/admin"><Icon icon="codicon:chrome-close" /></Link>
                    <p className="subtitle">Create Direct Purchase Round</p>
                    <Stepper currentStep={currentStep} texts={['ID & Time', 'Token', 'Condition']}/>
                    {currentStep === 1 && (
                        <>
                            <div className="input_div">
                                {showError? (Object.values(roundDataError)[0]? <Alert severity="error">{Object.values(roundDataError)[0]}</Alert>: <Alert severity="success">Success! Please click Next Button</Alert>): ''}
                                <div className="div1">
                                    <div>
                                        <p>Round ID</p>
                                        <input className="black_input disabled" placeholder="Auto-Generated" disabled />
                                    </div>
                                    <div>
                                        <p>Round Number</p>
                                        <NumberFormat className={`black_input disabled`}
                                            placeholder='Auto-Generated'
                                            thousandSeparator={true}
                                            allowNegative={false}
                                            value={roundData.roundNumber}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="div2 mt-4">
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <div>           
                                            <p className={`${showError && roundDataError.startTime? 'error': ''}`}>Round Start Time</p>                             
                                            <MobileDateTimePicker  
                                                className="datePicker1"
                                                showTodayButton = {true}
                                                value={roundData.startTime}
                                                onChange={(newValue) => {
                                                    setRoundData({...roundData, startTime: newValue});
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />                                        
                                        </div>
                                        <div>    
                                            <p className={`${showError && roundDataError.endTime? 'error': ''}`}>Round End Time</p>                                     
                                            <MobileDateTimePicker  
                                                showTodayButton
                                                value={roundData.endTime}
                                                onChange={(newValue) => {
                                                    setRoundData({...roundData, endTime: newValue});
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />                                        
                                        </div>
                                        <div>          
                                            <p>Total Time</p>                              
                                            <input className="white_input" readOnly
                                                value={secondsToDhms(duration / 1000)} 
                                            />                                      
                                        </div>
                                    </LocalizationProvider>
                                </div>                                        
                            </div>                                    
                            <div className="button_div">
                                <Link className="btn previous" to="/admin">Cancel</Link>
                                <button className="btn next" onClick={setIDAndTime}>Next</button>
                            </div>
                        </>
                    )}
                    {currentStep === 2 && (
                        <>
                            <div className="input_div">
                            {showError? (Object.values(tokenDataError)[0]? <Alert severity="error">{Object.values(tokenDataError)[0]}</Alert>: <Alert severity="success">Success! Please click Next Button</Alert>): ''}
                                <div className="div1">
                                    <div>
                                        <p>Token Amount</p>
                                        <input className={`black_input ${showError && tokenDataError.tokenAmount? 'error': ''}`}
                                            value={tokenData.tokenAmount}
                                            onChange={e => setTokenData({...tokenData, tokenAmount: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <p>Reserved Price</p>
                                        <input className={`black_input ${showError && tokenDataError.ReservedPrice? 'error': ''}`}
                                            value={tokenData.ReservedPrice}
                                            onChange={e => setTokenData({...tokenData, ReservedPrice: e.target.value})}
                                        />
                                    </div> 
                                </div>
                                <div className="div1 mt-4">
                                    <div>           
                                        <p>Total Token Amount</p>  
                                        <div className="token_div">
                                            <input className="white_input" value={totalTokenAmount} readOnly/>
                                            <div>
                                                {[5, 10, 20, 50].map(value => {
                                                    return (<button key={value} onClick={() => setTokenData({...tokenData, tokenAmount: String(totalTokenAmount * value / 100)})}>{value}%</button>);
                                                })}
                                            </div>
                                        </div>                                                               
                                    </div>
                                    <div>
                                        <p>Previous Reserved Price</p>                                     
                                        <div className="token_div">
                                            <input className="white_input" value={prevReservedPrice+'$'} readOnly/>
                                            <div>
                                                {[5, 10, 20, 50].map(value => {
                                                    return (<button key={value} onClick={() => setTokenData({...tokenData, ReservedPrice: String(prevReservedPrice * value / 100)})}>{value}%</button>);
                                                })}
                                            </div>
                                        </div>                                     
                                    </div>
                                </div>
                            </div>
                            <div className="button_div">
                                <button className="btn previous" onClick={() => setCurrentStep(1)}>Previous</button>
                                <button className="btn next" onClick={setTokenAmountPrice}>Next</button>
                            </div>
                        </>
                    )}
                    {currentStep === 3 && (
                        <>
                            <div className="input_div custom_scrollbar">
                                {showError? (taskDataError.item? <Alert severity="error">{taskDataError.desc}</Alert>: <Alert severity="success">Success! Please click Next Button</Alert>): ''}
                                {taskData.map((task, index) => {
                                    return (
                                        <div className="condition_div" key={index}>
                                            <div className="task_div">
                                                <input className={`black_input ${showError && taskDataError.index === index && taskDataError.item === 'task'? 'error': ''}`}
                                                    value={task.task}
                                                    onChange={e => { taskData[index].task = e.target.value; setTaskData([...taskData]); }}
                                                    placeholder="Task"
                                                />
                                                <input className={`black_input ${showError && taskDataError.index === index && taskDataError.item === 'url'? 'error': ''}`}
                                                    value={task.url}
                                                    onChange={e => { taskData[index].url = e.target.value; setTaskData([...taskData]); }}
                                                    placeholder="URL"
                                                />
                                            </div>
                                            <div className="btn_div">
                                                <Icon icon='bytesize:trash' onClick={() => deleteTask(index)}/>
                                            </div>
                                        </div>
                                    );
                                })}                                
                                <div className="add_btn_div">
                                    <Icon className={taskDataError.item === 'noTask'? 'error': ''} icon='akar-icons:plus' onClick={() => setTaskData([...taskData, {title: '', url: ''}])}/>
                                </div>
                            </div>
                            <div className="button_div">
                                <button className="btn previous" onClick={() => setCurrentStep(2)}>Previous</button>
                                <button className="btn next" onClick={setTasks}>Next</button>
                            </div>
                        </>
                    )}
                    {currentStep === 4 && (
                        <>
                            <div className="input_div">
                                <div className="row">
                                    <div className="col-sm-4 col-6">
                                        <div className="item">
                                            <p>Round ID</p>
                                            <p>Auto-generated</p>
                                        </div>                                        
                                        <div className="item">
                                            <p>Round Number</p>
                                            <p>{roundData.roundNumber}</p>
                                        </div>                                        
                                        <div className="item">
                                            <p>Round Time</p>
                                            <p>{secondsToDhms(duration / 1000)}</p>
                                        </div>                                        
                                    </div>
                                    <div className="col-sm-5 col-6">
                                        <div className="item">
                                            <p>Token Amount</p>
                                            <p>{tokenData.tokenAmount}</p>
                                        </div>  
                                        <div className="item">
                                            <p>Reserved Price</p>
                                            <p>{tokenData.ReservedPrice}</p>
                                        </div>  
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="item">
                                            <p>Task</p>
                                            {taskData.map((task, index) => {
                                                return <p key={index}>{task.task}</p>
                                            })}
                                        </div>  
                                    </div>
                                </div>                                                              
                            </div>
                            <div className="button_div">
                                <button className="btn previous" onClick={() => setCurrentStep(3)}>Previous</button>
                                <button className="btn next" onClick={handleSubmit} disabled={pending}>{pending? 'Saving. . .': 'Save'}</button>
                            </div>
                        </>
                    )}
                </LayoutForCreate>
            </main>
        </>
    )
}

export default IndexPage;
