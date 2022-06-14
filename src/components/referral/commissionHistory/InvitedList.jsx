import React from 'react';
import { REFER_AVATAR, SPINNER } from '../../../utilities/imgImport';

const InvitedList = ({loading, invitedList}) => {
    
    const renderUser = (user, key) => {
        return <div key={key} className="d-flex justify-content-between  border-bottom border-secondary py-3">
            <span className='fs-12px'><img src={REFER_AVATAR} width='24' height='24'/> &nbsp;&nbsp;{user.name}</span>
            <div className='text-end'>
                <div className='fs-15px text-white fw-bold ls-1px'>{user.ndb} NDB</div>
                <div className='fs-11px txt-baseprice'>{user.ndb * 0.01} USD</div>
            </div>
        </div>
    }
    
    return <div className='mt-4'>
        <div className='d-flex justify-content-between align-items-center mt-5 pe-4'>
            <span className='fw-bold fs-22px'>INVITED</span>
            <span className='txt-green fs-14px'>YOU EARNED</span>
        </div>
        {loading ? <div className='text-center pt-3'>
            <img src={SPINNER} width='34px' height='34px' />
        </div> : <div className='overflow-auto vh-50 pe-4'>
            {invitedList.length === 0 ? <div className='text-white text-center pt-3'>No invited users</div> : invitedList.map((user, key) => {
                return renderUser(user, key)
            })}
        </div>}
    </div>
}

export default InvitedList;