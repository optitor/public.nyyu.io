import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { GET_EARNING } from '../api/query';
import CommissionBalance from './CommissionBalance';
import InvitedList from './InvitedList';

const CommissionHistory = () => {
    
    // invited user list
    const [ invitedList, setInvitedList ] = useState([]);
    // total earned
    const [ totalEarned, setTotalEarned ] = useState(0);

    // getting invited list - user name/earned
    const {loading} = useQuery(GET_EARNING, {
        onCompleted: data => {
            if(data?.getReferredUsers) {
                const earnings = data.getReferredUsers;
                setInvitedList(earnings);
                if(earnings.length === 0) setTotalEarned(0);
                else {
                    let earned = 0;
                    earnings.forEach(user => {
                        earned += user.amount;
                    });
                    setTotalEarned(earned);
                }
            }
        }
    });
    

    return <div className='col-12 col-md-4  px-lg-1 px-xl-5 py-5 vh-md-100 border-response'>
        <CommissionBalance loading={loading} totalEarned={totalEarned} />
        <InvitedList loading={loading} invitedList={invitedList} />
    </div>
}

export default CommissionHistory;