import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { device } from '../../../../utilities/device';
import CryptoWithdrawDataRow from './CryptoWithdrawDataRow';
import { width } from './columnWidth';
import PaginationBar from './../../PaginationBar';
import Loading from './../../shared/Loading';
import { get_All_Crypto_Withdraws } from '../../../../redux/actions/approvalAction';

const RoundsTable = () => {
    const dispatch = useDispatch();
    const { data } = useSelector(state => state);
    
    const [pageInfo, setPageInfo] = useState({ page: 1, limit: 5 });
    const { page, limit } = pageInfo;

    const [loading, setLoading] = useState(false);
    const [pageData, setPageData] = useState([]);

    // Search Bar
    const [inputText, setInputText] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const hanldeEnterKeyDown = e => {
        if(e.key === 'Enter') {
            setSearchValue(inputText);
        }
    };

    useEffect(() => {
        (async function() {
            setLoading(true);
            await dispatch(get_All_Crypto_Withdraws());
            setLoading(false);
        })();
    }, [dispatch]);

    const showData = useMemo(() => {
        const sortedData = _.orderBy(data, ['requestedAt'], ['desc']);
        return !searchValue? sortedData: sortedData.filter(item => String(item?.email).toLowerCase().includes(searchValue.toLowerCase())) ;
    }, [data, searchValue]);

    useEffect(() => {
        setPageData(showData.slice((page - 1) * limit, page * limit));
    }, [dispatch, showData, page, limit]);

    return (
        <>
            <SearchBar>
                <button>
                    <Icon icon='bi:list-stars' onClick={() => {setSearchValue(''); setInputText('');}} />
                </button>
                <div className='d-flex align-items-center'>
                    <p>Email </p>
                    <input className='mx-2 px-1' type='text' value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={hanldeEnterKeyDown} />
                    <button onClick={() => setSearchValue(inputText)} disabled={!inputText}>
                        <Icon icon='carbon:search' />
                    </button>
                </div>
            </SearchBar>
            <TableHead>
                <div className='email'>User's Email</div>
                <div className='sourceToken'>Token Amount</div>
                <div className='amount'>Withdraw Amount</div>
                <div className='time'>Request Time</div>
                <div className='approve'></div>
            </TableHead>
            <TableHeadForMobile>
                <div className='name'>Data</div>
            </TableHeadForMobile>
            {loading?
                <Loading />:
                <>
                    {_.isEmpty(showData)?
                        <p className='text-uppercase text-center mt-3'>No data</p>:
                        (
                            <>
                                <TableBody>
                                    {pageData.map(datum => {
                                        return <CryptoWithdrawDataRow key={datum.id} datum={datum} />
                                    })}
                                </TableBody>
                                <PaginationBar setPage={setPageInfo} page={page} limit={limit} total={showData.length} />
                            </>
                        )
                    }
                </>
            }            
        </>
    )
};

export default RoundsTable;

const TableHead = styled.div`
    height: 40px;
    border: 1px solid #464646;
    background-color: #464646;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 600;
    &>div {
        padding: 8px 2px;
    }
    &>div.email {width: ${width.email}; padding-left: 16px;}
    &>div.sourceToken {width: ${width.sourceToken};}
    &>div.amount {width: ${width.amount};}
    &>div.time {width: ${width.time};}
    &>div.approve {width: ${width.approve}; text-align: center;}

    @media screen and (max-width: ${device['phone']}){
        display: none;
    }    
`;

const TableHeadForMobile = styled.div`
    height: 40px;
    border: 1px solid #464646;
    background-color: #464646;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    &>div.name {padding-left: 16px;}
    display: none;
    @media screen and (max-width: ${device['phone']}){
        display: flex;
    }
`;

const TableBody = styled.div`
    border-left: 1px solid #464646;
    border-right: 1px solid #464646;
`;

const SearchBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    input {
        background-color: #1e1e1e;
        border: 1px solid white;
        color: white;
        font-size: 14px;
        height: 32px;
    }
    button {
        background: inherit;
        border: none;
    }
    svg {
        font-size: 25px;
    }
`;