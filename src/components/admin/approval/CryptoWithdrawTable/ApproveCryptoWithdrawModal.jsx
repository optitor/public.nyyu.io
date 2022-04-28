import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import Modal from 'react-modal';
import { CloseIcon } from "../../../../utilities/imgImport";
import { Icon } from "@iconify/react";
import Select, { components } from 'react-select';
import * as Query from '../../../../apollo/graphqls/querys/Approval'
import { renderNumberFormat } from '../../../../utilities/number';
import CustomSpinner from "../../../common/custom-spinner";
import { confirm_Crypto_Withdraw } from "../../../../redux/actions/approvalAction";
import { showFailAlarm } from "../../AlarmModal";

const STATUSES = [
    { label: 'APPROVE', value: 1 },  
    { label: 'DENY', value: 2 },  
];

const DropdownIndicator = props => {
    return (
      <components.DropdownIndicator {...props}>
        <Icon icon='ant-design:caret-down-filled' />
      </components.DropdownIndicator>
    );
};

const ApproveBankDepositModal = ({ isOpen, setIsOpen, datum }) => {
    const dispatch = useDispatch();

    const [withdrawData, setWithdrawData] = useState({});
    const [status, setStatus] = useState(STATUSES[0]);
    const [deniedReason, setDeniedReason] = useState('');
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState(false);

    const disabled = status.value === 2 && !deniedReason;

    useQuery(Query.GET_CRYPTO_WITHDRAW_BY_ID, {
        variables: {
            id: datum.id
        },
        onCompleted: data => {
            if(data.getCryptoWithdrawById) {
                setWithdrawData(data.getCryptoWithdrawById);
            }
            setLoading(false);
        },
        onError: err => {
            showFailAlarm('Action failed', err.message);
            setLoading(false);
        }
    });

    const handleSubmit = async () => {
        setPending(true);
        const confirmData = {
            id: datum.id,
            status: status.value,
            deniedReason: deniedReason,
        };
        await dispatch(confirm_Crypto_Withdraw({...datum, status: status.value}, confirmData));
        setPending(false);
        setIsOpen(false);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            className="support-modal"
            overlayClassName="deposit-widthdraw-modal__overlay"
            ariaHideApp={false}
        >
            <div className="support-modal__header justify-content-end">
                <div
                    onClick={closeModal}
                    onKeyDown={closeModal}
                    role="button"
                    tabIndex="0"
                >
                    <img
                        width="14px"
                        height="14px"
                        src={CloseIcon}
                        alt="close"
                    />
                </div>
            </div>
            <div className='width2'>
                <div className="text-center">
                    <h4 className='mt-3'>Approve Cryptocurrency Withdraw</h4>
                    <p>
                        <span className="text-muted me-2">User's email:</span> {datum.email}
                    </p>
                </div>
                {loading?
                    <div className="text-center my-4">
                        <CustomSpinner />
                    </div>:
                    <div className='mt-3'>
                        <div className="row">
                            <p className="col-6 text-muted">Token Amount</p>
                            <p className="col-6 text-end">{renderNumberFormat(withdrawData.tokenAmount, withdrawData.sourceToken)}</p>
                        </div>
                        <div className="row">
                            <p className="col-6 text-muted">Withdraw Amount</p>
                            <p className="col-6 text-end">{renderNumberFormat(withdrawData.tokenAmount, withdrawData.sourceToken)}</p>
                        </div>
                        <div className="row">
                            <p className="col-6 text-muted">Network</p>
                            <p className="col-6 text-end">{withdrawData.network}</p>
                        </div>
                        <div className="row">
                            <p className="col-6 text-muted">Destination Address</p>
                            <p className="col-6 text-end text-break">{withdrawData.destination}</p>
                        </div>
                        <div className="row">
                            <p className="col-6 text-muted">Requested Time</p>
                            <p className="col-6 text-end">
                                {new Date(withdrawData.requestedAt).toLocaleDateString()}
                                <span className="ms-2">{new Date(withdrawData.requestedAt).toLocaleTimeString()}</span>
                            </p>
                        </div>
                        {withdrawData.status !== 0 &&
                            <>
                                <p className="text-center my-3 font-30px fw-bold">
                                    {withdrawData.status === 1 && <span className="txt-green">APPROVED</span>}
                                    {withdrawData.status === 2 && <span className="text-danger">DENIED</span>}
                                </p>
                                <div className="row">
                                    <p className="col-6 text-muted">Confirmed Time</p>
                                    <p className="col-6 text-end">
                                        {new Date(withdrawData.confirmedAt).toLocaleDateString()}
                                        <span className="ms-2">{new Date(withdrawData.confirmedAt).toLocaleTimeString()}</span>
                                    </p>
                                </div>
                                {withdrawData.status === 2 && withdrawData.deniedReason && (
                                    <>
                                        <p className="text-muted">Denied Reason</p>
                                        <p className="text-break">{withdrawData.deniedReason}</p>
                                    </>
                                )}
                                <button className="btn btn-outline-light rounded-0 my-5 fw-bold w-100" style={{height: 47}} onClick={closeModal}>
                                    CLOSE
                                </button>
                            </>
                        }
                        {withdrawData.status === 0 && (
                            <>
                                <Select
                                    className='black_input mt-2'
                                    options={STATUSES}
                                    value={status}
                                    onChange={selected => {
                                        setStatus(selected);
                                    }}
                                    styles={customSelectStyles}
                                    components={{
                                        IndicatorSeparator: null,
                                        DropdownIndicator,
                                    }}
                                />
                                {status.value === 2 &&
                                    <>
                                        <p className="mt-2 text-muted">Denied Reason</p>
                                        <input className="black_input" value={deniedReason} onChange={e => setDeniedReason(e.target.value)} />
                                        {!deniedReason && <p className="text-warning font-14px">Denied reason required</p>}
                                    </>
                                }
                                <button className="btn btn-outline-light rounded-0 my-5 fw-bold w-100" style={{height: 47}}
                                    onClick={handleSubmit}
                                    disabled={disabled}
                                >
                                    {pending? <CustomSpinner />: 'CONFIRM'}
                                </button>
                            </>
                        )}
                    </div>
                }
            </div>
        </Modal>
    );
};

export default ApproveBankDepositModal;

const customSelectStyles = {
    option: (provided, state) => ({
        ...provided,
        color: "white",
        backgroundColor: state.isSelected ? "#000000" : undefined,
        fontSize: 14,
        borderBottom: "1px solid dimgrey",
        cursor: "pointer",
        ":hover": {
            backgroundColor: "inherit",
        },
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "none",
        borderRadius: 0,
        height: 47,
        cursor: "pointer",
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "1px solid white",
        borderRadius: 0
    }),
    menuList: (provided) => ({
        ...provided,
        margin: 0,
        padding: 0,
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: 0,
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white",
        marginLeft: 10,
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "dimgrey",
    }),
};