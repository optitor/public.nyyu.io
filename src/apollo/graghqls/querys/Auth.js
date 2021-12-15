import { gql } from "@apollo/client"

export const GET_USER = gql`
    {
        getUser {
            id,
            name,
            surname,
            googleSecret,
            role,
            birthDate,
            email,
            mobile,
            country,
            twoStep,
            avatarPrefix,
            avatarName,
            tos,
            notifySetting,
            lastLogin,
            googleSecret,
            avatar {
                groupId,
                compId
            },
            avatarPurchased {
                key,
                value
            },
            userExtWallet {
                key,
                value
            },
            userSecurity {
                key,
                value
            },
            userVerify {
                key,
                value
            },
        }
    }`;