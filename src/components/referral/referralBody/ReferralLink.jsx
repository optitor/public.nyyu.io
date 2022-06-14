import React from 'react';
import { RiFileCopyLine } from '@react-icons/all-files/ri/RiFileCopyLine';
import { FaEdit } from '@react-icons/all-files/fa/FaEdit';
import { IoMdArrowDropdown } from '@react-icons/all-files/io/IoMdArrowDropdown';
const shortFormatAddr = (addr) => {
    return addr.substring(0, 16) + "..." + addr.substring(addr.length - 4);
}

const ReferralLink = () => {
    return <div className='mx-auto px-1 mx-1 px-md-5 mx-lg-5'>
        <div className='bg-gray-50 d-flex justify-content-around py-2'>
            <div className='text-center'>
                <div className="txt-baseprice fs-13px">You get</div>
                <div className='text-white fs-24px fw-600'>10%</div>
            </div>
            <div className='text-center'>
                <div className="txt-baseprice fs-13px">your friend gets</div>
                <div className='text-white fs-24px fw-600'>10%</div>
            </div>
        </div>
        <div className='row text-white'>
            <div className='col-md-12 col-lg-4 pt-3'>
                <div className='pb-1 fw-13px fw-400'>Referral ID</div>
                <div className="bg-white text-black p-3 position-relative">
                    40192842
                    <RiFileCopyLine className='position-absolute' style={{top: '20px', right: '14px'}}/>
                </div>
            </div>
            <div className='col-md-12 col-lg-8 pt-3'>
                <div className='pb-1 fw-13px fw-400'>Connected Wallet</div>
                <div className="bg-white text-black p-3 position-relative">
                    <span className='d-inline-block fs-13px text-black'>
                        {shortFormatAddr('0x6Ea70C66A9DDA23DcC7Bf6873CE6Be053b465406')}
                    </span>
                    <FaEdit className='position-absolute' style={{top: '20px', right: '14px'}}/>
                </div>
            </div>
        </div>
        <div className="row text-white pt-3">
            <div className='pb-1 fw-13px fw-400'>Referral link</div>
            <div className='col-12'>
                <div className='bg-white text-black p-3 position-relative'>
                    Https://accounts...h=40192842
                    <RiFileCopyLine className='position-absolute' style={{top: '20px', right: '116px'}}/>
                    <div className='bg-green text-white position-absolute share fs-16px fw-600'>
                        Share&nbsp;<IoMdArrowDropdown color='white'/>
                    </div>
                </div>
            </div>
        </div>
        <div className='text-center pt-4'>
            <button className='text-white bg-transparent border border-white py-2 px-5 fw-bold fs-20px'>INVITE VIA EMAIL</button>
        </div>
    </div>
}

export default ReferralLink;