import React, { useMemo, useState } from "react";
import { useDispatch } from 'react-redux';
import NumberFormat from "react-number-format";
import Modal from 'react-modal';
import { Icon } from "@iconify/react";
import Select, { components } from 'react-select';
import { CloseIcon } from "../../../../utilities/imgImport";
import CustomSpinner from "../../../common/custom-spinner";
import { confirm_Bank_Deposit } from "../../../../redux/actions/approvalAction";

const CURRENCIES = [
    { label: "USD", value: "USD", symbol: "$" },
    { label: "GBP", value: "GBP", symbol: "£" },
    { label: "EUR", value: "EUR", symbol: "€" },
];

const ApproveBankDepositModal = ({ isOpen, setIsOpen, datum }) => {
    const dispatch = useDispatch();

    const [currencyCode, setCurrencyCode] = useState(CURRENCIES[0]);
    const [depositAmount, setDepositAmount] = useState('');
    const [showError, setShowError] = useState(false);
    const [pending, setPending] = useState(false);

    const error = useMemo(() => {
        if(!depositAmount || Number(depositAmount) === 0) return 'Amount is required';
        return '';
    }, [depositAmount]);

    const DropdownIndicator = props => {
        return (
          <components.DropdownIndicator {...props}>
            <Icon icon='ant-design:caret-down-filled' />
          </components.DropdownIndicator>
        );
    };

    const handleSubmit = async () => {
        if(error) {
            setShowError(true);
            return;
        }
        setPending(true);
        const confirmData = {
            id: datum.id,
            currencyCode: currencyCode.value,
            amount: Number(depositAmount),
            cryptoType: 'USDT'
        };
        await dispatch(confirm_Bank_Deposit(confirmData));
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
            <div className='width1'>
                <div className="text-center">
                    <h4 className='mt-3'>Approve Bank Deposit</h4>
                    <p>
                        <span className="text-muted me-2">Reference:</span> {datum.uid}
                    </p>
                    <p>
                        <span className="text-muted me-2">User's email:</span> {datum.email}
                    </p>
                </div>
                <div className='mt-3'>
                    <p className="text-muted">Select currency</p>
                    <Select
                        className='black_input'
                        options={CURRENCIES}
                        value={currencyCode}
                        onChange={selected => {
                            setCurrencyCode(selected);
                        }}
                        styles={customSelectStyles}
                        components={{
                            IndicatorSeparator: null,
                            DropdownIndicator,
                        }}
                    />
                    <p className="text-muted mt-2">Amount</p>
                    <NumberFormat
                        className='black_input'
                        thousandSeparator={true}
                        prefix={currencyCode.symbol + ' '}
                        allowNegative={false}
                        value={depositAmount}
                        onValueChange={(values) =>
                            setDepositAmount(values.value)
                        }
                        decimalScale={2}
                    />
                    <p className="text-danger">
                        {showError && error}
                    </p>
                    <button className="btn btn-outline-light rounded-0 my-5 fw-bold w-100" style={{height: 47}}
                        onClick={handleSubmit}
                    >
                        {pending? <CustomSpinner />: 'CONFIRM'}
                    </button>
                </div>
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