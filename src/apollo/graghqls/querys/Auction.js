import { gql } from "@apollo/client"

export const GET_AUCTION = gql`
    query {
        getAuctions {
            id
            round
            startedAt
            endedAt
            totalToken
            minPrice
            token
            sold
            status
        }
    }
`

export const GET_PRESALES = gql`
    {
        getPreSales {
            id
            round
            startedAt
            endedAt
            tokenAmount
            tokenPrice
            sold
            status
        }
    }
`
export const GET_CURRENT_ROUND = gql`
    {
        getCurrentRound {
            status
            auction {
                id
                regDate
                updateDate
                deleted
                round
                endedAt
                totalToken
                minPrice
                token
                sold
                stats {
                    qty
                    win
                    fail
                }
                status
            }
            presale {
                id
                round
                startedAt
                endedAt
                tokenAmount
                tokenPrice
                sold
                status
                conditions {
                    presaleId
                    task
                    url
                }
            }
        }
    }
`
export const GET_AUCTION_BY_NUMBER = gql`
    query getAuctionByNumber($round: Int!) {
        getAuctionByNumber(round: $round) {
            id
            regDate
            updateDate
            deleted
            round
            startedAt
            endedAt
            totalToken
            minPrice
            token
            sold
            stats {
                qty
                win
                fail
            }
            status
        }
    }
`
export const GET_AUCTION_BY_STATUS = gql`
    query getAuctionByStatus($status: Int!) {
        getAuctionByStatus(status: $status) {
            number
            token
            status
        }
    }
`
export const GET_AUCTIONS = gql`
    query {
        getAuctions {
            id
            round
            startedAt
            endedAt
            totalToken
            minPrice
            token
            sold
            stats {
                qty
                win
                fail
            }
            status
        }
    }
`

export const GET_NEW_ROUND = gql`
    query {
        getNewRound
    }
`

export const GET_BID = gql`
    query getBid($roundId: Int!) {
        getBid(roundId: $roundId) {
            userId
            prefix
            name
            roundId
            tokenAmount
            totalPrice
            tokenPrice
            tempTokenAmount
            tempTokenPrice
            delta
            pendingIncrease
            payType
            cryptoType
            placedAt
            updatedAt
            status
        }
    }
`
