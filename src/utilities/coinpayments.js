import Coinpayments from 'coinpayments';

const CoinpaymentsCredentials = {
    key: 'c229db642e1214c8ee765cb6d22cc9b24ca14f9d89fe428b61d3f2f4339ae41c',
    secret: '3b09C1502fC6FF7c44FFc714df2EAcd94732aAb021899882b8269eAd86469186'
}

export const CoinpaymentsRatesOpts = {
    accepted: 2
};

export const clientForCoinpayments = new Coinpayments(CoinpaymentsCredentials);
