import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import _ from 'lodash';
import { CloseIcon } from "../../utilities/imgImport";
import { Icon } from "@iconify/react";
import Select, { components } from 'react-select';
import { update_Favor_Assets } from '../../redux/actions/settingAction';
import { EuropeanFlag } from "../../utilities/imgImport";
import { Currencies } from "../../utilities/staticData2";
import CustomSpinner from "../common/custom-spinner";

const { Option } = components;

const SelectOption = (props) => {
    const { data } = props;
    return (
        <Option {...props}>
            <div className="d-flex justify-content-center justify-content-sm-start align-items-center ">
                <div className='flag_div'>
                    <img
                        src={data.value !=='EUR'? `${process.env.CurrencyIconEndpoint}/${String(data.value).toLowerCase()}.png`: EuropeanFlag}
                        alt={data.value}
                    />
                </div>
                <p className="coin-label ms-2">{data.value}</p>
            </div>
        </Option>
    );
};

const SelectCurrencyModal = ({ isOpen, setIsOpen }) => {
    const favAssets = useSelector(state => state.favAssets);
    const savedCurrency = favAssets.currency;
    const assets = favAssets.assets;
    const { currencyRates } = useSelector(state => state); 
    const dispatch = useDispatch();
    const [pending, setPending] = useState(false);

    const [selectedCurrency, setSelectedCurrency] = useState(savedCurrency);
    const loading = _.isEmpty(currencyRates);

    const DropdownIndicator = props => {
        return (
          <components.DropdownIndicator {...props}>
            <Icon icon='ant-design:caret-down-filled' />
          </components.DropdownIndicator>
        );
    };

    const selectCurrency = async () => {
        setPending(true);
        const updateData = {
            assets: selectedCurrency.value + ',' + assets.join(',')
        };
        await dispatch(update_Favor_Assets(updateData));
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
                    onClick={() => setIsOpen(false)}
                    onKeyDown={() => setIsOpen(false)}
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
            <div className='text-center'>
                <h4 className='mt-3'>Currency Change</h4>
                <div className='mt-5 d-flex justify-content-center'>
                    <Select
                        id='select_currency_in_profile'
                        isSearchable={false}
                        className={`${loading? 'disabled': ''} w-50`}
                        options={Currencies}
                        value={selectedCurrency}
                        onChange={selected => {
                            setSelectedCurrency(selected);
                        }}
                        styles={customSelectStyles}
                        components={{
                            IndicatorSeparator: null,
                            DropdownIndicator,
                            Option: SelectOption,
                            SingleValue: SelectOption,
                        }}
                        isDisabled={loading}
                    />
                </div>
                <button className="btn btn-outline-light rounded-0 w-50 mt-50px mb-5 fw-bold" style={{height: 47}}
                    onClick={selectCurrency}
                    disabled={pending}
                >
                    {pending? <CustomSpinner />: 'CONFIRM'}
                </button>
            </div>
        </Modal>
    );
};

export default SelectCurrencyModal;

const customSelectStyles = {
    container: provided => ({
        ...provided,
        border: '1px solid white',
        width: 130,
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected? '#000000': undefined,
        fontSize: 14,
        borderBottom: '1px solid dimgrey',
        cursor: 'pointer',
        ":hover": {
            backgroundColor: "inherit",
        },
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: 'none',
        borderRadius: 0,
        height: 47,
        color: 'lightgrey',
        cursor: 'pointer'
    }),
    input: provided => ({
        ...provided,
        position: 'absolute',
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#1e1e1e",
        border: "1px solid white",
        borderRadius: 0,
        opacity: 1,
    }),
    menuList: provided => ({
        ...provided,
        margin: 0,
        padding: 0
    }),
    valueContainer: provided => ({
        ...provided,
        padding: 0
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white",
        marginLeft: 10,
        fontWeight: 600
    }),
    placeholder: provided => ({
        ...provided,
        color: 'dimgrey'
    })
};