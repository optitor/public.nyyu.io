import * as Types from "../actionTypes"

const initailState = {
    bid_amount: 1,
    currency: { label: 'USD', value: 'USD', sign: '$' },
    round_id: 0,
    bidType: ''
}

export const bidReducer = (state = initailState, action) => {
    switch (action.type) {
        case Types.BID_PLACE:
            return { ...state, bid_amount: action.payload }
        case Types.SET_CURRENCY:
            return { ...state, currency: action.payload }
        case Types.SET_CURRENT_ROUND_ID:
            return { ...state, round_id: action.payload }
        case Types.SET_BID_TYPE:
            return { ...state, bidType: action.payload }
        default:
            return state
    }
}

export const currencyRatesReducer = (state = {}, action) => {
    switch(action.type) {
        case Types.FETCH_CURRENCY_RATES:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}