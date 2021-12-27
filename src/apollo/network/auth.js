import * as GraphQL from "../graghqls/mutations/Auth"
import { useMutation } from "@apollo/client"
import { navigate } from "gatsby"
import { setAuthToken, getUser, setUser } from "../../utilities/auth"
import { ROUTES } from "../../utilities/routes"

// Sign In

export const useSigninMutation = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.SIGNIN, {
        retry: 1,
        onCompleted: (data) => {
            if (data.signin.status === "Failed") {
                // do something
                return
            } else if (data.signin.status === "Success") {
                setUser({
                    ...getUser(),
                    tempToken: data.signin.token,
                })
                navigate("/app/onetime-pwd")
            }
        },
    })

    const signin = (email, password) => {
        setUser({
            ...getUser(),
            tempToken: null,
            email: email,
        })
        return mutation({
            variables: {
                email,
                password,
            },
        })
    }
    return [signin, mutationResults]
}

// Sine Up

export const useSignupMutation = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.SIGNUP, {
        onCompleted: (data) => {
            navigate("/app/verify-email")
        },
    })

    const signup = (email, password, country) => {
        setUser({
            ...getUser(),
            email: email,
        })
        return mutation({
            variables: {
                email,
                password,
                country,
            },
        })
    }
    return [signup, mutationResults]
}

// Signin with 2FA
export const useSignIn2FA = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.SIGNIN_2FA, {
        onCompleted: (data) => {
            if (data.confirm2FA.status === "Failed") {
                // do something
                return
            } else if (data.confirm2FA.status === "Success") {
                setAuthToken(data.confirm2FA.token)
                setUser({
                    ...getUser(),
                    tempToken: null,
                })
                const user = getUser()
                if (user?.avatar)
                    navigate(ROUTES.profile)
                else
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

// Forgot Password

export const useForgotPassword = () => {
    const [mutation, mutationResults] = useMutation(GraphQL.FORGOT_PASSWORD, {
        onCompleted: (data) => {
            // if (data.forgotPassword.status === "Failed") {
            //   // do something
            //   return
            // }
            // else if (data.confirm2FA.status === "Success") {
            //   setAuthToken(data.confirm2FA.token)
            //   setUser({
            //     ...user,
            //     tempToken: null
            //   })
            //   navigate("/app/profile")
            // }
        },
    })

    const forgotPassword = (email) => {
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
