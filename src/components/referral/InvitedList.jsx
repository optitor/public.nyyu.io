import React from 'react';

const InvitedList = ({loading, invitedList}) => {
    
    const renderUser = (user, key) => {
        return <div key={key} className="d-flex justify-content-between">
            <span>Avatar UserName</span>
            <div>
                <div>Balance NDB</div>
                <div>Balance USD</div>
            </div>
        </div>
    }
    
    return <div className='mt-4'>
        <div className='d-flex justify-content-between align-items-center mt-5'>
            <span className='fw-bold fs-22px'>INVITED</span>
            <span className='txt-green fs-14px'>YOU EARNED</span>
        </div>
        <div className='overflow-auto'>
            {invitedList.map((user, key) => {
                return renderUser(user, key)
            })}
        </div>
    </div>
}

export default InvitedList;