import React, { useState } from 'react';
import CommissionBalance from './CommissionBalance';
import InvitedList from './InvitedList';

const CommissionHistory = () => {
    // loading status
    const [loading, setLoading] = useState(false);
    // invited user list
    const [ invitedList, setInvitedList ] = useState([]);
    // total earned
    const [ totalEarned, setTotalEarned ] = useState(0);

    // getting invited list - user name/earned

    return <div className='col-1 col-md-4'>
        <CommissionBalance loading={loading} totalEarned={totalEarned} />
        <InvitedList invitedList={invitedList} />
    </div>
}

export default CommissionHistory;