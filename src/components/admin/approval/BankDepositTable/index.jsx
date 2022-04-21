import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Icon } from '@iconify/react';
import styled from 'styled-components';
import { device } from '../../../../utilities/device';
import BankDepositDataRow from './BankDepositDataRow';
import { width } from './columnWidth';
import PaginationBar from './../../PaginationBar';
import Loading from './../../shared/Loading';
import { get_All_BankDeposit_Txns } from '../../../../redux/actions/approvalAction';

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
            await dispatch(get_All_BankDeposit_Txns());
            setLoading(false);
        })();
    }, [dispatch]);

    const showData = useMemo(() => {
        const sortedData = _.orderBy(data, ['createdAt'], ['desc']);
        return !searchValue? sortedData: sortedData.filter(item => String(item?.uid).includes(searchValue)) ;
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
                    <p>Reference</p>
                    <input className='mx-2 px-1' type='text' value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={hanldeEnterKeyDown} />
                    <button onClick={() => setSearchValue(inputText)} disabled={!inputText}>
                        <Icon icon='carbon:search' />
                    </button>
                </div>
            </SearchBar>
            <TableHead>
                <div className='reference'>Reference</div>
                <div className='email'>User Email</div>
                <div className='amount'>Deposit Amount</div>
                <div className='usdAmount'>USD Amount</div>
                <div className='fee'>Fee (USD)</div>
                <div className='deposited'>Deposited (USD)</div>
                <div className='approve'>Approve</div>
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
                                        return <BankDepositDataRow key={datum.id} datum={datum} />
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
    &>div.reference {width: ${width.reference}; padding-left: 16px;}
    &>div.email {width: ${width.email};}
    &>div.amount {width: ${width.amount};}
    &>div.usdAmount {width: ${width.usdAmount};}
    &>div.fee {width: ${width.fee};}
    &>div.deposited {width: ${width.deposited};}
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
        &:disabled {
            opacity: 0.5;
            cursor: unset;
        }
    }
    svg {
        font-size: 25px;
    }
`;