import React, { useState } from 'react';
import CommissionBalance from './CommissionBalance';
import InvitedList from './InvitedList';

const temp = [{
    name: 'Tesal.James',
    ndb: 245450
},{
    name: 'Volta.Nav',
    ndb: 33431
},{
    name: 'Enstine.Maria',
    ndb: 245450
},{
    name: 'Maria.Curie',
    ndb: 1430
},{
    name: 'Tesal.James',
    ndb: 245450
},{
    name: 'Volta.Nav',
    ndb: 33431
},{
    name: 'Enstine.Maria',
    ndb: 245450
},{
    name: 'Maria.Curie',
    ndb: 1430
},{
    name: 'Tesal.James',
    ndb: 245450
},{
    name: 'Volta.Nav',
    ndb: 33431
},{
    name: 'Enstine.Maria',
    ndb: 245450
},{
    name: 'Maria.Curie',
    ndb: 1430
},]

const CommissionHistory = () => {
    // loading status
    const [loading, setLoading] = useState(false);
    // invited user list
    const [ invitedList, setInvitedList ] = useState([]);
    // total earned
    const [ totalEarned, setTotalEarned ] = useState(12345678);

    // getting invited list - user name/earned

    return <div className='col-12 col-md-4  px-lg-1 px-xl-5 py-5'>
        <CommissionBalance loading={loading} totalEarned={totalEarned} />
        <InvitedList loading={loading} invitedList={[]} />
    </div>
}

export default CommissionHistory;