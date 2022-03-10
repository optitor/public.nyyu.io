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

export const SUPPORTED_COINS = [
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


export const SUPPORTED_CURRENCIES = [
    {
        "id": 2781,
        "name": "United States Dollar",
        "sign": "$",
        "symbol": "USD"
    },
    {
        "id": 2782,
        "name": "Australian Dollar",
        "sign": "$",
        "symbol": "AUD"
    },
    {
        "id": 2783,
        "name": "Brazilian Real",
        "sign": "R$",
        "symbol": "BRL"
    },
    {
        "id": 2784,
        "name": "Canadian Dollar",
        "sign": "$",
        "symbol": "CAD"
    },
    {
        "id": 2785,
        "name": "Swiss Franc",
        "sign": "Fr",
        "symbol": "CHF"
    },
    {
        "id": 2786,
        "name": "Chilean Peso",
        "sign": "$",
        "symbol": "CLP"
    },
    {
        "id": 2787,
        "name": "Chinese Yuan",
        "sign": "¥",
        "symbol": "CNY"
    },
    {
        "id": 2788,
        "name": "Czech Koruna",
        "sign": "Kč",
        "symbol": "CZK"
    },
    {
        "id": 2789,
        "name": "Danish Krone",
        "sign": "kr",
        "symbol": "DKK"
    },
    {
        "id": 2790,
        "name": "Euro",
        "sign": "€",
        "symbol": "EUR"
    },
    {
        "id": 2791,
        "name": "Pound Sterling",
        "sign": "£",
        "symbol": "GBP"
    },
    {
        "id": 2792,
        "name": "Hong Kong Dollar",
        "sign": "$",
        "symbol": "HKD"
    },
    {
        "id": 2793,
        "name": "Hungarian Forint",
        "sign": "Ft",
        "symbol": "HUF"
    },
    {
        "id": 2794,
        "name": "Indonesian Rupiah",
        "sign": "Rp",
        "symbol": "IDR"
    },
    {
        "id": 2795,
        "name": "Israeli New Shekel",
        "sign": "₪",
        "symbol": "ILS"
    },
    {
        "id": 2796,
        "name": "Indian Rupee",
        "sign": "₹",
        "symbol": "INR"
    },
    {
        "id": 2797,
        "name": "Japanese Yen",
        "sign": "¥",
        "symbol": "JPY"
    },
    {
        "id": 2798,
        "name": "South Korean Won",
        "sign": "₩",
        "symbol": "KRW"
    },
    {
        "id": 2799,
        "name": "Mexican Peso",
        "sign": "$",
        "symbol": "MXN"
    },
    {
        "id": 2800,
        "name": "Malaysian Ringgit",
        "sign": "RM",
        "symbol": "MYR"
    },
    {
        "id": 2801,
        "name": "Norwegian Krone",
        "sign": "kr",
        "symbol": "NOK"
    },
    {
        "id": 2802,
        "name": "New Zealand Dollar",
        "sign": "$",
        "symbol": "NZD"
    },
    {
        "id": 2803,
        "name": "Philippine Peso",
        "sign": "₱",
        "symbol": "PHP"
    },
    {
        "id": 2804,
        "name": "Pakistani Rupee",
        "sign": "₨",
        "symbol": "PKR"
    },
    {
        "id": 2805,
        "name": "Polish Złoty",
        "sign": "zł",
        "symbol": "PLN"
    },
    {
        "id": 2806,
        "name": "Russian Ruble",
        "sign": "₽",
        "symbol": "RUB"
    },
    {
        "id": 2807,
        "name": "Swedish Krona",
        "sign": "kr",
        "symbol": "SEK"
    },
    {
        "id": 2808,
        "name": "Singapore Dollar",
        "sign": "S$",
        "symbol": "SGD"
    },
    {
        "id": 2809,
        "name": "Thai Baht",
        "sign": "฿",
        "symbol": "THB"
    },
    {
        "id": 2810,
        "name": "Turkish Lira",
        "sign": "₺",
        "symbol": "TRY"
    },
    {
        "id": 2811,
        "name": "New Taiwan Dollar",
        "sign": "NT$",
        "symbol": "TWD"
    },
    {
        "id": 2812,
        "name": "South African Rand",
        "sign": "R",
        "symbol": "ZAR"
    },
    {
        "id": 2813,
        "name": "United Arab Emirates Dirham",
        "sign": "د.إ",
        "symbol": "AED"
    },
    {
        "id": 2814,
        "name": "Bulgarian Lev",
        "sign": "лв",
        "symbol": "BGN"
    },
    {
        "id": 2815,
        "name": "Croatian Kuna",
        "sign": "kn",
        "symbol": "HRK"
    },
    {
        "id": 2816,
        "name": "Mauritian Rupee",
        "sign": "₨",
        "symbol": "MUR"
    },
    {
        "id": 2817,
        "name": "Romanian Leu",
        "sign": "lei",
        "symbol": "RON"
    },
    {
        "id": 2818,
        "name": "Icelandic Króna",
        "sign": "kr",
        "symbol": "ISK"
    },
    {
        "id": 2819,
        "name": "Nigerian Naira",
        "sign": "₦",
        "symbol": "NGN"
    },
    {
        "id": 2820,
        "name": "Colombian Peso",
        "sign": "$",
        "symbol": "COP"
    },
    {
        "id": 2821,
        "name": "Argentine Peso",
        "sign": "$",
        "symbol": "ARS"
    },
    {
        "id": 2822,
        "name": "Peruvian Sol",
        "sign": "S/.",
        "symbol": "PEN"
    },
    {
        "id": 2823,
        "name": "Vietnamese Dong",
        "sign": "₫",
        "symbol": "VND"
    },
    {
        "id": 2824,
        "name": "Ukrainian Hryvnia",
        "sign": "₴",
        "symbol": "UAH"
    },
    {
        "id": 2832,
        "name": "Bolivian Boliviano",
        "sign": "Bs.",
        "symbol": "BOB"
    },
    {
        "id": 3526,
        "name": "Albanian Lek",
        "sign": "L",
        "symbol": "ALL"
    },
    {
        "id": 3527,
        "name": "Armenian Dram",
        "sign": "֏",
        "symbol": "AMD"
    },
    {
        "id": 3528,
        "name": "Azerbaijani Manat",
        "sign": "₼",
        "symbol": "AZN"
    },
    {
        "id": 3529,
        "name": "Bosnia-Herzegovina Convertible Mark",
        "sign": "KM",
        "symbol": "BAM"
    },
    {
        "id": 3530,
        "name": "Bangladeshi Taka",
        "sign": "৳",
        "symbol": "BDT"
    },
    {
        "id": 3531,
        "name": "Bahraini Dinar",
        "sign": ".د.ب",
        "symbol": "BHD"
    },
    {
        "id": 3532,
        "name": "Bermudan Dollar",
        "sign": "$",
        "symbol": "BMD"
    },
    {
        "id": 3533,
        "name": "Belarusian Ruble",
        "sign": "Br",
        "symbol": "BYN"
    },
    {
        "id": 3534,
        "name": "Costa Rican Colón",
        "sign": "₡",
        "symbol": "CRC"
    },
    {
        "id": 3535,
        "name": "Cuban Peso",
        "sign": "$",
        "symbol": "CUP"
    },
    {
        "id": 3536,
        "name": "Dominican Peso",
        "sign": "$",
        "symbol": "DOP"
    },
    {
        "id": 3537,
        "name": "Algerian Dinar",
        "sign": "د.ج",
        "symbol": "DZD"
    },
    {
        "id": 3538,
        "name": "Egyptian Pound",
        "sign": "£",
        "symbol": "EGP"
    },
    {
        "id": 3539,
        "name": "Georgian Lari",
        "sign": "₾",
        "symbol": "GEL"
    },
    {
        "id": 3540,
        "name": "Ghanaian Cedi",
        "sign": "₵",
        "symbol": "GHS"
    },
    {
        "id": 3541,
        "name": "Guatemalan Quetzal",
        "sign": "Q",
        "symbol": "GTQ"
    },
    {
        "id": 3542,
        "name": "Honduran Lempira",
        "sign": "L",
        "symbol": "HNL"
    },
    {
        "id": 3543,
        "name": "Iraqi Dinar",
        "sign": "ع.د",
        "symbol": "IQD"
    },
    {
        "id": 3544,
        "name": "Iranian Rial",
        "sign": "﷼",
        "symbol": "IRR"
    },
    {
        "id": 3545,
        "name": "Jamaican Dollar",
        "sign": "$",
        "symbol": "JMD"
    },
    {
        "id": 3546,
        "name": "Jordanian Dinar",
        "sign": "د.ا",
        "symbol": "JOD"
    },
    {
        "id": 3547,
        "name": "Kenyan Shilling",
        "sign": "Sh",
        "symbol": "KES"
    },
    {
        "id": 3548,
        "name": "Kyrgystani Som",
        "sign": "с",
        "symbol": "KGS"
    },
    {
        "id": 3549,
        "name": "Cambodian Riel",
        "sign": "៛",
        "symbol": "KHR"
    },
    {
        "id": 3550,
        "name": "Kuwaiti Dinar",
        "sign": "د.ك",
        "symbol": "KWD"
    },
    {
        "id": 3551,
        "name": "Kazakhstani Tenge",
        "sign": "₸",
        "symbol": "KZT"
    },
    {
        "id": 3552,
        "name": "Lebanese Pound",
        "sign": "ل.ل",
        "symbol": "LBP"
    },
    {
        "id": 3553,
        "name": "Sri Lankan Rupee",
        "sign": "Rs",
        "symbol": "LKR"
    },
    {
        "id": 3554,
        "name": "Moroccan Dirham",
        "sign": "د.م.",
        "symbol": "MAD"
    },
    {
        "id": 3555,
        "name": "Moldovan Leu",
        "sign": "L",
        "symbol": "MDL"
    },
    {
        "id": 3556,
        "name": "Macedonian Denar",
        "sign": "ден",
        "symbol": "MKD"
    },
    {
        "id": 3557,
        "name": "Myanma Kyat",
        "sign": "Ks",
        "symbol": "MMK"
    },
    {
        "id": 3558,
        "name": "Mongolian Tugrik",
        "sign": "₮",
        "symbol": "MNT"
    },
    {
        "id": 3559,
        "name": "Namibian Dollar",
        "sign": "$",
        "symbol": "NAD"
    },
    {
        "id": 3560,
        "name": "Nicaraguan Córdoba",
        "sign": "C$",
        "symbol": "NIO"
    },
    {
        "id": 3561,
        "name": "Nepalese Rupee",
        "sign": "₨",
        "symbol": "NPR"
    },
    {
        "id": 3562,
        "name": "Omani Rial",
        "sign": "ر.ع.",
        "symbol": "OMR"
    },
    {
        "id": 3563,
        "name": "Panamanian Balboa",
        "sign": "B/.",
        "symbol": "PAB"
    },
    {
        "id": 3564,
        "name": "Qatari Rial",
        "sign": "ر.ق",
        "symbol": "QAR"
    },
    {
        "id": 3565,
        "name": "Serbian Dinar",
        "sign": "дин.",
        "symbol": "RSD"
    },
    {
        "id": 3566,
        "name": "Saudi Riyal",
        "sign": "ر.س",
        "symbol": "SAR"
    },
    {
        "id": 3567,
        "name": "South Sudanese Pound",
        "sign": "£",
        "symbol": "SSP"
    },
    {
        "id": 3568,
        "name": "Tunisian Dinar",
        "sign": "د.ت",
        "symbol": "TND"
    },
    {
        "id": 3569,
        "name": "Trinidad and Tobago Dollar",
        "sign": "$",
        "symbol": "TTD"
    },
    {
        "id": 3570,
        "name": "Ugandan Shilling",
        "sign": "Sh",
        "symbol": "UGX"
    },
    {
        "id": 3571,
        "name": "Uruguayan Peso",
        "sign": "$",
        "symbol": "UYU"
    },
    {
        "id": 3572,
        "name": "Uzbekistan Som",
        "sign": "so'm",
        "symbol": "UZS"
    },
    {
        "id": 3573,
        "name": "Sovereign Bolivar",
        "sign": "Bs.",
        "symbol": "VES"
    }
];