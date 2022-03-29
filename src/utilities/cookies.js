import Cookies from 'js-cookie';

export const setCookie = (name, value) => {
    Cookies.set(name, value);
};

export const getCookie = (name) => {
    return Cookies.get(name);
};

export const NDB_FavCoins = 'NDB_FavCoins';
export const NDB_Paypal_TrxType = 'NDB_Paypal_TrxType';

export const NDB_Auction = 'f920fd230rk_auc';
export const NDB_Presale = 'dj039rjkjaq_pre';
export const NDB_Deposit = 'f30fakjf203_dep';