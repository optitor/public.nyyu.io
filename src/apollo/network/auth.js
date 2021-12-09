import * as GraphQL from "../graghqls/mutations/Auth"
import { useAuthToken, useAuthEmail } from "../../config/auth-config"
import { useMutation } from "@apollo/client"
import { navigate} from "gatsby"

export const useSigninMutation = () => {
  const [, setAuthToken] = useAuthToken();
  const [, setAuthEmail] = useAuthEmail();

  const [mutation, mutationResults] = useMutation(GraphQL.SIGNIN, {
    onCompleted: (data) => {
      if (data.signin.status === "Failed") {
        // do something
        return
      }
      else if (data.signin.status === "Success") {
        setAuthToken(data.signin.token);
        navigate("/onetime-pwd")
      }
    }
  });

  const signin = (email, password) => {
    setAuthToken('');
    setAuthEmail(email);
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
  const [, setAuthEmail] = useAuthEmail();

  const [mutation, mutationResults] = useMutation(GraphQL.SIGNUP, {
    onCompleted: (data) => {
      navigate("/verify-email")
      console.log("Signup result", data) 
    }
  });

  const signup = (email, password, country) => {
    setAuthEmail(email)
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
  const [, setAuthToken] = useAuthToken();

  const [mutation, mutationResults] = useMutation(GraphQL.SIGNIN_2FA, {
    onCompleted: (data) => {
      console.log("confirm2faresult", data)
      if (data.confirm2FA.status === "Failed") {
        // do something
        return
      }
      else if (data.confirm2FA.status === "Success") {
        setAuthToken(data.confirm2FA.token)
        navigate("/profile")
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