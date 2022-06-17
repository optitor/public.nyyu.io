import * as GraphQL from "../graphqls/mutations/Auth"
import { useMutation } from "@apollo/client"
import { navigate } from "gatsby"
import { isBrowser, setAuthToken } from "../../utilities/auth"
import { ROUTES } from "../../utilities/routes"

// Signin with 2FA
export const useSignIn2FA = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.SIGNIN_2FA, {
        onCompleted: (data) => {
            if (data.confirm2FA.status === "Failed") {
                return
            } else if (data.confirm2FA.status === "Success") {
                setAuthToken(data.confirm2FA.token)
                navigate(ROUTES.selectFigure)
            }
        },
    })

    const signin2fa = (email, token, code) => {
        return mutation({
            variables: {
                email,
                token,
                code,
            },
        })
    }
    return [signin2fa, mutationResults]
}

export const useSignUp2FA = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.CONFIRM_REQUEST_2FA, {
        onCompleted: (data) => {
            if (data.confirmRequest2FA.status === "Failed") {
                return
            } else if (data.confirmRequest2FA.status === "Success") {
                setAuthToken(data.confirmRequest2FA.token)
                navigate(ROUTES.selectFigure)
            }
        }
    })

    const signup2fa = (email, method, code) => {
        return mutation({
            variables: {
                email, method, code
            }
        })
    }
    return [signup2fa, mutationResults];
}

// Forgot Password

export const useForgotPassword = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.FORGOT_PASSWORD, {
        errorPolicy: "ignore",
        onCompleted: (data) => {
            if (data?.forgotPassword === "Success") {
                navigate(ROUTES.changePassword)
            }
        },
    })

    const forgotPassword = (email) => {
        if(!isBrowser) return;
        localStorage.setItem("FORGOT_PASSWORD_EMAIL", email)
        return mutation({
            variables: {
                email,
            },
        })
    }
    return [forgotPassword, mutationResults]
}

export const useChangePassword = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.CHANGE_PASSWORD)

    const changePassword = (newPassword) => {
        return mutation({
            variables: {
                newPassword,
            },
        })
    }
    return [changePassword, mutationResults]
}

export const useResetPassword = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.RESET_PASSWORD)

    const resetPassword = (email, code, newPassword) => {
        return mutation({
            variables: {
                email,
                code,
                newPassword,
            },
        })
    }
    return [resetPassword, mutationResults]
}
