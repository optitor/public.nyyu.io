import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'gatsby';
import CopyToClipboard from 'react-copy-to-clipboard';

import { RiFileCopyLine } from '@react-icons/all-files/ri/RiFileCopyLine';
import { FaEdit } from '@react-icons/all-files/fa/FaEdit';
import { IoMdArrowDropdown } from '@react-icons/all-files/io/IoMdArrowDropdown';
import { AiFillCaretDown } from '@react-icons/all-files/ai/AiFillCaretDown';

import { isBrowser } from '../../../utilities/auth';
import { ROUTES } from '../../../utilities/routes';

import BASIC from '../../../images/tier_png/basic.svg';
import BRONZE from '../../../images/tier_png/bronze.svg';
import SILVER from '../../../images/tier_png/silver.svg';
import GOLD from '../../../images/tier_png/gold.svg';
import PLAT from '../../../images/tier_png/plat.svg';
import DIA from '../../../images/tier_png/diamond.svg';

const tierImages = [
    BASIC, BRONZE, SILVER, GOLD, PLAT, DIA
]

const shortReferralCode = code => {
    if(!code) return '';
    return code.substring(0, 6) + '...';
}

const shortFormatAddr = (addr) => {
    if(!addr) return '';
    return addr.substring(0, 16) + "..." + addr.substring(addr.length - 4);
}

const shortInviteUrl = url => {
    if(!url) return '';
    return url.substring(0, 20) + "..." + url.substring(url.length - 6);
}

const inviteText = 'Hey, I use Nyyu.io to buy NDB tokens. It has great potential! Give it a try and get an extra 10% reward on your purchase.';
const sendingLinks = [
    // {
    //     name: 'Copy link',
    //     action: async (url) => {
    //         await navigator.clipboard.writeText(url);
    //     }
    // },
    {
        name: 'Send with Whatsapp',
        link: (url) => {
            return `https://wa.me/?text=${encodeURIComponent(inviteText + ' ' + url)}`;
        }
    },
    {
        name: 'Send with Telegram',
        link: (url) => {
            return `https://telegram.me/share/url?url=${encodeURIComponent(url)}&text=${inviteText}`;
        }
    },
    {
        name: 'Post to Facebook',
        link: (url) => {
            return `https://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}`;
        }
    },
    {
        name: 'Twitter',
        link: (url) => {
            return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(inviteText)}`;
        }
    },

]

const ReferralLink = ({referrerInfo, onChangeWallet}) => {

    const tierDiv = useRef(null);
    const tiers = useSelector(state => state.tiers);

    const [codeCopied, setCodeCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [caretStyle, setCaretStyle] = useState({});
    const [linkModalShow, setLinkModalShow] = useState(false);

    const {rate, referralCode, walletConnect, commissionRate} = referrerInfo;
    
    const onChangeModalShow = e => {
        e.stopPropagation();
        setLinkModalShow(!linkModalShow);
    }

    const hideLinkModal = e => {
        e.stopPropagation();
        setLinkModalShow(false);
    }

    const handleCodeCopy = () => {
        setCodeCopied(true);
        setTimeout(() => {
            setCodeCopied(false);
        }, 2000);
    }
    
    const handleLinkCopy = () => {
        setLinkCopied(true);
        setTimeout(() => {
            setLinkCopied(false);
        }, 2000);
    }

    const getDivWidth = () => {
        const idx = commissionRate.findIndex(e => e === rate);
        const _offset = idx * (tierDiv.current.clientWidth / tiers.length);
        setCaretStyle({top: '-28px', left: `${_offset}px`})
    }

    const generateEmailLink = () => {
        const inviteLink = `${process.env.GATSBY_SITE_URL}?referralCode=${referralCode}`;
        return encodeURIComponent(inviteText + ' ' + inviteLink);
    }

    useEffect(() => {
        getDivWidth();
        if(!isBrowser) { return null; }
        window.addEventListener('click', hideLinkModal);
        return () => window.removeEventListener('click', hideLinkModal);
    }, []);

    return <div className='mx-auto px-1 mx-1 px-md-2 mx-md-2 px-lg-4 mx-lg-4'>
        <div className='bg-gray-50 d-flex justify-content-around pb-3 pt-4'>
            <div className='text-center'>
                <div className="text-transparent fs-13px user-select-none">FRIEND GETS</div>
                <div ref={tierDiv} className='text-gray fs-18px fw-600 d-flex justify-content-center border border-end-0 border-secondary position-relative'>
                    <div 
                        style={caretStyle}
                        className="txt-green fs-13px text-center position-absolute">
                        <div style={{lineHeight: '8px'}}>YOU GET</div>
                        <div><AiFillCaretDown color='#23C865'/></div>
                        <Link 
                            to={ROUTES.profile} 
                            className='text-decoration-underline position-absolute cursor-pointer' 
                            style={{top: '-3px', right: '-88%', fontSize: '10px', color: '#626161'}}
                        >
                            Level up
                        </Link>
                    </div>
                    {tiers.length > 0 && tiers.map(tier => {
                        return (
                            <div className={`border-end border-secondary p-2 d-flex align-items-center justify-content-around`} key={tier.level}>
                                <img src={tierImages[tier.level]} alt={tier.name} width='12px' height='12px' className={`${commissionRate[tier.level] === rate ? '':'opacity-30'}`}/>
                                <span className={`fs-16px ${commissionRate[tier.level] === rate ? 'text-white':'referral-tier-rate'}`} style={{paddingLeft: '3px'}}>{commissionRate[tier.level]}%</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='text-center'>
                <div className="text-transparent fs-13px">FRIEND</div>
                <div className='text-white fs-16px fw-600 border py-2 px-3 position-relative'>
                    <div className="txt-baseprice fs-13px position-absolute" style={{top: '-34px', right: '-16px', width: '120px'}}>FRIEND GETS</div>
                    10%
                </div>
            </div>
        </div>
        <div className='row text-white'>
            <div className='col-md-12 col-lg-4 pt-3'>
                <div className='pb-1 fw-13px fw-400'>Referral ID</div>
                <div className="bg-white text-black p-3 position-relative">
                    {shortReferralCode(referralCode)}
                    <CopyToClipboard text={referralCode} onCopy={handleCodeCopy}>
                        <RiFileCopyLine className='position-absolute' size='1.4em' style={{top:'16px', right:'14px'}} color={codeCopied ? 'green':'black'}/>
                    </CopyToClipboard>
                </div>
            </div>
            <div className='col-md-12 col-lg-8 pt-3'>
                <div className='pb-1 fw-13px fw-400'>Connected Wallet</div>
                <div className="bg-white text-black p-3 position-relative">
                    <span className='d-inline-block text-black'>
                        {shortFormatAddr(walletConnect)}
                    </span>
                    <FaEdit 
                        onClick={onChangeWallet}
                        className='position-absolute' 
                        size='1.4em' 
                        style={{top:'16px', right:'14px'}}/>
                </div>
            </div>
        </div>
        <div className="row text-white pt-3 mb-3">
            <div className='pb-1 fw-13px fw-400'>Referral link</div>
            <div className='col-12'>
                <div className='bg-white text-black p-3 position-relative'>
                    {shortInviteUrl(`${process.env.GATSBY_SITE_URL}?referralCode=${referralCode}`)}
                    <CopyToClipboard 
                        text={`${process.env.GATSBY_SITE_URL}?referralCode=${referralCode}`}
                        onCopy={handleLinkCopy}
                    >
                        <RiFileCopyLine className='position-absolute' size='1.4em' style={{top: '16px', right: '116px'}} color={linkCopied ? 'green' : 'black'}/>
                    </CopyToClipboard>
                    <div className='bg-green position-absolute share position-relative cursor-pointer' onClick={onChangeModalShow}>
                        <span className='text-white fs-16px fw-600' >Share</span>&nbsp;<IoMdArrowDropdown color='white'/>
                        <div className={`bg-white px-3 py-1 position-absolute ${linkModalShow ? 'd-block':'d-none'}`} style={{top: '110%', right: '0px', width: '200px'}}>
                            {sendingLinks.map((item, key) => {
                                return (
                                    <div key={key}>
                                        {item.action === undefined ? 
                                        <a 
                                            href={item.link(`${process.env.GATSBY_SITE_URL}?referralCode=${referralCode}`)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`py-2 text-black fs-14px fw-400 cursor-pointer d-block
                                                ${key === (sendingLinks.length - 1) ? '':'border-bottom'}`}
                                        >
                                            {item.name}
                                        </a> : 
                                        <span
                                            className={`py-2 text-black fs-14px fw-400 cursor-pointer d-block
                                            ${key === (sendingLinks.length - 1) ? '':'border-bottom'}`}
                                            onClick={() => {
                                            setLinkModalShow(false); 
                                            item.action(`${process.env.GATSBY_SITE_URL}?referralCode=${referralCode}`)
                                        }}>
                                            {item.name}
                                        </span>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='text-center pt-3'>
            <button className='text-white bg-transparent border border-white py-2 px-5 fw-bold fs-20px'><a 
                href={`https://mail.google.com/mail/u/0/?fs=1&su=${encodeURIComponent('NDB Invitation')}&body=${generateEmailLink()}&tf=cm`}
                target='_blank'
                rel="noopener noreferrer"
                >INVITE VIA EMAIL</a></button>
        </div>
    </div>
}

export default ReferralLink;