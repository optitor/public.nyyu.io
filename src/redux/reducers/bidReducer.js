import * as Types from "../actionTypes"

const initailState = {
    bid_amount: 1,
    currency: { label: 'USD', value: 'USD', sign: '$' },
    round_id: 0,
    order_id: 0
}

export const bidReducer = (state = initailState, action) => {
    switch (action.type) {
        case Types.BID_PLACE:
            return { ...state, bid_amount: action.payload }
        case Types.SET_CURRENCY:
            return { ...state, currency: action.payload }
        case Types.SET_CURRENT_ROUND_ID:
            return { ...state, round_id: action.payload }
        case Types.SET_PRESALE_ORDER_ID:
            return { ...state, order_id: action.payload }
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