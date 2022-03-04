import {
    BTC,
    ETH,
    BNB,
    USDC,
    USDT,
    DAI,
    SOL,
    DOGE,
    SHIB,
} from "./imgImport";

export const SUPPORED_COINS = [
    {
        value: "BTC",
        label: "BTC",
        icon: BTC,
        networks: [
            { label: "Bitcoin", value: "BTC", network: "BTC" },
            // { label: 'Bitcoin/BTCB Token (BC Chain)', value: 'BTC.BEP2', network: 'BEP2' },
            { label: "Bitcoin/BTCB Token (BSC Chain)", value: "BTC.BEP20", network: "BEP20", },
            // { label: 'Bitcoin (Lightning Network)', value: 'BTC.LN', network: 'LN' },
        ],
    },
    {
        value: "ETH",
        label: "ETH",
        icon: ETH,
        networks: [
            { label: "Ethereum", value: "ETH", network: "ERC20" },
            // { label: 'Ethereum (BC Chain)', value: 'ETH.BEP2', network: 'BEP2' },
            { label: "Ethereum Token (BSC Chain)", value: "ETH.BEP20", network: "BEP20", },
        ],
    },
    {
        value: "BNB",
        label: "BNB",
        icon: BNB,
        networks: [
            // { label: 'BNB Coin (Mainnet)', value: 'BNB', network: 'BNB' },
            { label: "BNB Coin (BSC Chain)", value: "BNB.BSC", network: "BEP20", },
            { label: "BNB Coin (ERC-20)", value: "BNB.ERC20", network: "ERC20", },
        ],
    },
    {
        value: "USDC",
        label: "USDC",
        icon: USDC,
        networks: [
            { label: "USD Coin (ERC20)", value: "USDC", network: "ERC20" },
            { label: "USD Coin (BSC Chain)", value: "USDC.BEP20", network: "BEP20", },
            { label: "USD Coin (Tron/TRC20)", value: "USDC.TRC20", network: "TRC20", },
        ],
    },
    {
        value: "USDT",
        label: "USDT",
        icon: USDT,
        networks: [
            { label: "Tether USD (Omni Layer)", value: "USDT", network: "USDT", },
            // { label: 'Tether USD (BC Chain)', value: 'USDT.BEP2', network: 'BEP2' },
            { label: "Tether USD (BSC Chain)", value: "USDT.BEP20", network: "BEP20", },
            { label: "Tether USD (ERC20)", value: "USDT.ERC20", network: "ERC20", },
            { label: "Tether USD (Solana)", value: "USDT.SOL", network: "SOL" },
            { label: "Tether USD (Tron/TRC20)", value: "USDT.TRC20", network: "TRC20", },
            { label: "TetherUSD (Waves Token)", value: "USDT.Waves", network: "Waves", },
        ],
    },
    {
        value: "DAI",
        label: "DAI",
        icon: DAI,
        networks: [
            { label: "Dai (ERC20)", value: "DAI", network: "ERC20" },
            { label: "Dai Token (BSC Chain)", value: "DAI.BEP20", network: "BEP20", },
        ],
    },
    {
        value: "DOGE",
        label: "DOGE",
        icon: DOGE,
        networks: [
            { label: "Dogecoin", value: "DOGE", network: "DOGE" },
            { label: "Dogecoin (BSC Chain)", value: "DOGE.BEP20", network: "BEP20", },
        ],
    },
    {
        value: "SHIB",
        label: "SHIB",
        icon: SHIB,
        networks: [
            { label: "SHIBA INU (ERC20)", value: "SHIB", network: "ERC20" },
            { label: "SHIBA INU (BSC Chain)", value: "SHIB.BEP20", network: "BEP20", },
        ],
    },
    {
        value: "SOL",
        label: "SOL",
        icon: SOL,
        networks: [{ label: "Solana", value: "SOL", network: "SOL" }],
    },
];