import React from "react"
import {
    // Facebook,
    Amazon,
    Google,
    Linkedin,
    Coinbase,
    MetaMask,
    TrustWallet,
    WalletConnect,
} from "./imgImport"
import { API_BASE_URL } from "./staticData3"
import { ROUTES } from "./routes"


// export const OAUTH2_REDIRECT_URI = "http://localhost:4000/oauth2/redirect"
export const OAUTH2_REDIRECT_URI = `https://www.nyyu.io/oauth2/redirect`

export const BINANCE_API_KEY = "qApI1beZsgoaiHpgbM2S1wMF83cYwRE5PEaFGp7urj6fzxv0RHfGbxZ0LRgY0582"

export const social_links = [
    // {
    //     icon: Facebook,
    //     to: API_BASE_URL + "/oauth2/authorize/facebook?redirect_uri=" + OAUTH2_REDIRECT_URI,
    // },
    {
        icon: Google,
        to: API_BASE_URL + "/oauth2/authorize/google?redirect_uri=" + OAUTH2_REDIRECT_URI,
    },
    // {
    //     icon: Twitter,
    //     to: API_BASE_URL + "/oauth2/authorize/twitter?redirect_uri=" + OAUTH2_REDIRECT_URI,
    // },
    {
        icon: Linkedin,
        to: API_BASE_URL + "/oauth2/authorize/linkedin?redirect_uri=" + OAUTH2_REDIRECT_URI,
    },
    // {
    //     icon: Apple,
    //     to: API_BASE_URL + "/oauth2/authorize/apple?redirect_uri=" + OAUTH2_REDIRECT_URI,
    // },
    {
        icon: Amazon,
        to: API_BASE_URL + "/oauth2/authorize/amazon?redirect_uri=" + OAUTH2_REDIRECT_URI,
    },
]

export const passwordValidatorOptions = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    returnScore: false,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
}

export const COLOR_LOAD = "#ffffff"
export const COLOR_ON = "#23c865"
export const COLOR_OFF = "#626161"

export const INFURA_ID = "b3926273acc243d1ab72dfe9f2be8539"

export const wallets = {
    metaMask: {
        icon: MetaMask,
        desc: "Connect to your MetaMask wallet",
        warn: "MetaMask is not supported by your Browser",
        short: 'MetaMask Wallet'
    },
    walletConnect: {
        icon: WalletConnect,
        desc: "Scan with WalletConnect to connect",
        warn: "WalletConnect is not supported",
        short: 'WalletConnect Wallet'
    },
    coinbaseWallet: {
        icon: Coinbase,
        desc: "Connect to your Coinbase Account",
        warn: "Coinbase Account is not supported",
        short: 'CoinBase Wallet'
    },
    trustWallet: {
        icon: TrustWallet,
        desc: "Connect to your Trust wallet",
        warn: "Trust wallet is only supported on Mobile",
        short: 'TrustWallet'
    },
}

export const externalWallets = [
    {
        icon: MetaMask,
        title: "MetaMask Wallet",
        value: 'metamask'
    }, {
        icon: WalletConnect,
        title: "WalletConnect",
        value: 'wallet_connect'
    }, {
        icon: Coinbase,
        title: "Coinbase account",
        value: 'coinbase_account'
    }, {
        icon: TrustWallet,
        title: "Trust Wallet",
        value: 'trust_wallet'
    },

]

export const profile_tabs = [
    {
        value: "account details",
        label: "ACCOUNT DETAILS",
        index: 0,
    },
    {
        value: "notifications",
        label: "NOTIFICATIONS",
        index: 1,
    },
    {
        value: "connect wallet",
        label: "CONNECT WALLET",
        index: 2,
    },
    {
        value: "sign out",
        label: "SIGN OUT",
        index: 3,
    },
]

export const recentNotifications = [
    {
        status: true,
        act: "Failla.987 Placed a higher bid ",
    },
    {
        status: false,
        act: "Round 2 has just started",
    },
    {
        status: false,
        act: "round 1 ended",
    },
    {
        status: false,
        act: "Token has pumped in 23% since your last bid",
    },
    {
        status: true,
        act: "There are only 40 tokens left",
    },
]

export const Currencies = [
    {
        id: 0,
        label: "USD",
        value: "USD",
        symbol: "$",
    },
    {
        id: 1,
        label: "EUR",
        value: "EUR",
        symbol: "€",
    },
    {
        id: 2,
        label: "GBP",
        value: "GBP",
        symbol: "£",
    },
    {
        id: 3,
        label: "INR",
        value: "INR",
        symbol: "₹",
    },
    {
        id: 4,
        label: "SEK",
        value: "SEK",
        symbol: "KR",
    },
    {
        id: 5,
        label: "RUB",
        value: "RUB",
        symbol: "₽",
    },
    {
        id: 6,
        label: "CHF",
        value: "CHF",
        symbol: "CHF",
    },
]

export const TRANSACTION_TYPES = {
    deposit: "DEPOSIT",
    withdraw: "WITHDRAW",
}

export const PAYMENT_FRACTION_TOOLTIP_CONTENT =
    "If your bid is the last one to be accepted and there are not enough tokens to fulfil your order, by checking this box you allow us to complete your order with the remaining tokens only."

export const TWO_FACTOR_AUTH_TOOLTIP_CONTENT = "Enable 2FA to secure your account. Email 2FA can be used along with mobile or Google authentication."

export const AUCTION_TOOLTIP_CONTENT1 =
    "You can easily move between rounds to have a more clear understanding about auction statistics."

export const AUCTION_TOOLTIP_CONTENT2 =
    "Access charts to see more detailed information about NDB token performance"

export const NDB_WALLET_TOOLTIP_CONTENT = 'The balance will be available under the wallet page'
export const EXTERNAL_WALLET_TOOLTIP_CONTENT = 'The balance will be transferred to your external wallet. Fees may be applicable.'

export const FAQ_CONTENT = [
    {
        question: "What is the Dual Token System?",
        answer: (
            <p>
                The Dual Token System combines two tokens, the NDB token, a fixed supply token, and
                the Volt Token, a variable supply token. The Dual token brings more incentives to
                the users and partners. For example, with this method we can provide to our partners
                more accurate measurements of the interest in their companies by utilizing our
                services and products from their customer’s perspective.
            </p>
        ),
    },
    {
        question: "What is Volt Token?",
        answer: (
            <p>
                The Volt token is the driving force behind the applications and interacts with NDB
                token. These tokens will be of variable supply, burnable and mintable and serve to
                power its applications. Through Volt token, the users will have the possibility to
                lease and access benefits from our products. Furthermore, the token can be used as
                an energy tracker for utility providers and consumers to earn rewards. There are
                also plans for this token to be used as a form of energy payment in the future.
            </p>
        ),
    },
    {
        question: "What is the NDB token?",
        answer: (
            <p>
                The NDB token is a tool for demonstrating the buyer’s interests in the partnership
                between companies inside our ecosystem. The inclusion of new proposals into our
                blockchain ecosystem enables people to stake their NDB tokens and support the
                project, company, or individuals. By staking NDB tokens on different Pools, you can
                earn dividends as Volt tokens over the staked amount.
            </p>
        ),
    },
    {
        question: "What is Airdrop?",
        answer: (
            <p>
                Our Airdrop function is the initial incentive for people to stake their NDB tokens
                into the Pools. The Airdrop will come as a reward for the interaction between the
                Pool entity and our products and services. As the ecosystem grows, more features
                will be announced, guaranteeing advantages on-chain and off-chain for the user’s
                interaction with specific Pools.
            </p>
        ),
    },
    {
        question: "What are the pools?",
        answer: (
            <p>
                Pools are the mechanism used for the token to gather and measure intention from
                users and organizations for us and our partners. The Pools act as quantifiers for
                value and will play an essential role in the early stages.
            </p>
        ),
    },
    {
        question: "What is the relationship between both tokens?",
        answer: (
            <p>
                NDB token interacts with Volt, both of which price-wise, interact freely on the open
                market. The interaction of NDB and Volt tokens will maintain the interest of users
                in the ecosystem, and create economic checks and balances to regulate the demand for
                tokens.
            </p>
        ),
    },
    {
        question: "What is the NDB Hub?",
        answer: (
            <p>
                NDB Hub is an institution governed by Voltamond SA based in Switzerland tasked with
                assessing and putting forward growth proposals related to energy applications. It is
                also responsible for maintaining and safeguarding the best interests of this project
                through oversight on maintaining developers, seeking feedback from the community,
                and searching for product improvement where needed. It will assess and seek
                potential partners that support the growth of the ecosystem. This initiative is the
                primary organization through which the NDB and Volt token operate.
            </p>
        ),
    },
    {
        question: "How can I earn more tokens?",
        answer: (
            <p>
                You can stake your NDB tokens on the different categories of Pools, to earn
                dividends as Volt tokens based on the staked value. In addition to that, you should
                bear in mind that NDB-powered devices constantly generate energy. That is why, when
                you have a device containing our products, you can earn Volt tokens for the unused
                energy sent to the grid when the device is inactive.
            </p>
        ),
    },
    {
        question: "How to send tokens to external sources?",
        answer: (
            <p>
                The in-built function of NDB App will allow users to move their tokens to private
                external wallets, or you can keep your tokens in custodian parties like crypto
                exchanges.
            </p>
        ),
    },
    {
        question: "Can I stake my NDB tokens without having an account on the NDB App?",
        answer: (
            <p>
                Safety and security of users of our platform is one of the top priorities for NDB.
                That is why, before you stake NDB tokens into a Pool of any kind, you must submit
                the required documents for the KYC process from our App.
            </p>
        ),
    },
    {
        question: "Which protocol are the tokens using?",
        answer: (
            <p>
                The NDB token is created in IBEP-20 protocol using the Binance Smart Chain network.
            </p>
        ),
    },
    {
        question: "Can I charge my devices with NDB token?",
        answer: (
            <p>
                No, NDB token serves as a tool to demonstrate the buyer’s interest in the
                partnership between companies inside the NDB ecosystem, but you can stake your NDB
                tokens to earn Volt. With Volt tokens you can lease and access benefits from NDB’s
                products.
            </p>
        ),
    },
]

export const NEWS_CONTENT = [
    {
        question: "What is the Dual Token System?",
        date: "17.01.2022",
        answer: (
            <p>
                The Dual Token System combines two tokens, the NDB token, a fixed supply token, and
                the Volt Token, a variable supply token. The Dual token brings more incentives to
                the users and partners. For example, with this method we can provide to our partners
                more accurate measurements of the interest in their companies by utilizing our
                services and products from their customer’s perspective.
            </p>
        ),
    },
    {
        question: "Latest NDB news",
        date: "08.01.2022",
        answer: (
            <p>
            </p>
        ),
    },
    {
        question: "Latest activities",
        date: "26.12.2021",
        answer: (
            <p>
            </p>
        ),
    },
    {
        question: "API updates",
        date: "19.12.2021",
        answer: (
            <p>
            </p>
        ),
    },
    {
        question: "Crypto airdrop",
        date: "12.12.2021",
        answer: (
            <p>
            </p>
        ),
    },
]

export const NDB_TOKEN_CONTENT = `Since the beginning of NDB’s project the vision is to provide clean green technologies to the world. The NDB token is not a security token nor does it represent any shares of NDB SA.

By using NDB token you will be able to contribute to the development of our technologies and our vision. We plan to expand our ecosystem to multiple areas including deep space exploration, sustainable fashion, quantum computing, and more. 
`


export const VerificationDocumentTypes = [
    {
        label: "Passport",
        value: "passport",
    },
    {
        label: "National Identification Card",
        value: "id_card",
    },
    {
        label: "Driving License",
        value: "driving_license",
    },
]

export const VerificationStepThreeDocumentTypes = [
    {
        label: "National Identification Card",
        value: "id_card",
    },
    {
        label: "Driving license",
        value: "driving_license",
    },
    {
        label: "Employer letter",
        value: "employer_letter",
    },
    {
        label: "Rent agreement",
        value: "rent_agreement",
    },
    {
        label: "Utility bill",
        value: "utility_bill",
    },
    {
        label: "Tax bill",
        value: "tax_bill",
    },
    {
        label: "Bank statement",
        value: "bank_statement",
    },
]

export const navigationLinks = [
    {
        label: "Nyyu",
        url: "/",
        active: true,
        subMenu: [
            {
                label: "Wallet",
                url: ROUTES.wallet
            },
            {
                label: "Sale",
                url: ROUTES.auction
            },
            {
                label: "Profile",
                url: ROUTES.profile
            },
            {
                label: "Support",
                url: ROUTES.faq
            }
        ]
    },
    {
        label: "Money",
        url: "https://ndb.money/",
        active: false
    },
    {
        label: "City",
        url: "https://ndb.city",
        active: false
    },
    {
        label: "Watt",
        url: "https://watt.green/",
        active: false
    },
    {
        label: "Charenji",
        url: "https://charenji.me/",
        active: false
    },
]

export const footerLinks = [
    {
        label: "Fee",
        url: "/",
    },
    {
        label: "Bug bounty",
        url: "/",
    },
    {
        label: "Apply for listings",
        url: "/",
    },
    {
        label: "API",
        url: "/",
    },
    {
        label: "About us",
        url: "/",
    },
    {
        label: "Terms of use",
        url: "/",
    },
    {
        label: "Privacy policy",
        url: "/",
    },
    {
        label: "AML policy",
        url: "/",
    },
    {
        label: "Contacts",
        url: "/",
    }
]

export const Roles = [
    { label: 'USER', value: 'ROLE_USER' },
    { label: 'ADMIN', value: 'ROLE_ADMIN' }
]

export const ZendeskURLWithJWT = 'https://nyyu.zendesk.com/access/jwt?jwt=';

export const CLIENT_ID = "90xX0xMPoYxtLd6CdQFbOtaIZM7E0YHovKao7MnrUlrDIQxqYQ1644914425"
export const SECRET = "$2y$10$501VfRCMRXitkUmuHhJCPelM5MYTdvzO3S8qlY319L9bnDdVJp24C"