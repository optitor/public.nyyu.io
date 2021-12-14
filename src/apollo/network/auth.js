import * as GraphQL from "../graghqls/mutations/Auth"
import { useMutation } from "@apollo/client"
import { navigate} from "gatsby"
import { useUser } from "../../hooks/useUser"
import { setAuthToken } from "../../utilities/auth"

export const useSigninMutation = () => {
  const [user, setUser] = useUser();

  const [mutation, mutationResults] = useMutation(GraphQL.SIGNIN, {
    onCompleted: (data) => {
      if (data.signin.status === "Failed") {
        // do something
        return
      }
      else if (data.signin.status === "Success") {
        setUser({
          ...user,
          tempToken: data.signin.token,
        })
        navigate("/app/onetime-pwd")
      }
    }
  });

  const signin = (email, password) => {
    setUser({
      ...user,
      tempToken: null,
      email: email
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

export const useSignupMutation = () => {
  const [user, setUser] = useUser();

  const [mutation, mutationResults] = useMutation(GraphQL.SIGNUP, {
    onCompleted: (data) => {
      navigate("/app/verify-email")
    }
  });

  const signup = (email, password, country) => {
    setUser({
      ...user,
      email: email,
    })
    return mutation({
      variables: {
        email,
        password,
        country
      },
    })
  }
  return [signup, mutationResults]
}

export const useSignIn2FA = () => {
  const [user, setUser] = useUser();

  const [mutation, mutationResults] = useMutation(GraphQL.SIGNIN_2FA, {
    onCompleted: (data) => {
      if (data.confirm2FA.status === "Failed") {
        // do something
        return
      }
      else if (data.confirm2FA.status === "Success") {
        setAuthToken(data.confirm2FA.token)
        setUser({
          ...user,
          tempToken: null
        })
        navigate("/app/profile")
      }
    }
  });

  const signin2fa = (email, token, code) => {
    return mutation({
      variables: {
        email,
        token,
        code
      },
    })
  }
  return [signin2fa, mutationResults]
}