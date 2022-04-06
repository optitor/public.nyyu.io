import React, { useEffect, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
import { device } from '../../../../utilities/device';
import AvatarComponentDataRow from './AvatarComponentDataRow';
import { width } from './columnWidth';
import Loading from './../../shared/Loading';
import PaginationBar from './../../PaginationBar';
import { set_Page } from '../../../../redux/actions/paginationAction';
import { get_User_Tiers_WithoutSvg } from '../../../../redux/actions/userTierAction';

const AvatarCompTabel = () => {
    const dispatch = useDispatch();
    const { loaded, hairStyles, facialStyles, expressions, hats, others } = useSelector(state => state.avatarComponents);
    const totalComp = { ...hairStyles, ...facialStyles, ...expressions, ...hats, ...others };
    const compData = _.orderBy(Object.values(totalComp), ['groupId'], ['asc']);
    const { page, limit } = useSelector(state => state.pagination);

    const [pageData, setPageData] = useState([]);
    const [loading, setLoading] = useState(false);

    useDeepCompareEffect(() => {
        (async function() {
            dispatch(set_Page(1, 5, compData.length));
            setLoading(true);
            await dispatch(get_User_Tiers_WithoutSvg());
            setLoading(false);
        })();
    }, [dispatch, compData]);

    useDeepCompareEffect(() => {
        setPageData(compData.slice((page - 1) * limit, page * limit));
    }, [dispatch, compData, page, limit]);

    return (
        <>
            <TableHead>
                <div className='image text-center'>Avatar Component</div>
                <div className='groupId'>ID</div>
                <div className='position'>Position (%)</div>
                <div className='config'>Config</div>
                <div className='edit'> </div>
            </TableHead>
            <TableHeadForMobile>
                <div className='name'>Avatar Component Data</div>
            </TableHeadForMobile>
            {!loaded || loading?
                <Loading />:
                <>
                    <TableBody className='custom_scrollbar'>
                        {pageData.map(datum => {
                            return <AvatarComponentDataRow key={datum.compId} datum={datum} />
                        })}
                    </TableBody>
                    <PaginationBar />
                </>
            }            
        </>
    )
};

export default AvatarCompTabel;

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
    &>div.image {width: ${width.image};}
    &>div.groupId {width: ${width.groupId};}
    &>div.position {width: ${width.position};}
    &>div.config {width: ${width.config};}
    &>div.edit {width: ${width.edit};}

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
    max-height: 70vh;
    overflow: auto;
    @media screen and (max-width: ${device['phone']}){
        max-height: unset;
    }
`;