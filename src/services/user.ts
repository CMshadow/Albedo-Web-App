import { Auth } from 'aws-amplify'
import { getLanguage } from '../utils/getLanguage'

type SignupConfirmArgs = {
  username: string
  verification: string
}

type SigninArgs = {
  username: string
  password: string
}

type SignupArgs = {
  email: string
  password: string
  lastname: string
  firstname: string
}

type UsernameArgs = {
  username: string
}

type ForgotPasswordArgs = {
  username: string
  code: string
  newPassword: string
}

export const Signup = async ({ email, password, lastname, firstname }: SignupArgs) => {
  return Auth.signUp({
    username: email,
    password: password,
    attributes: {
      family_name: lastname,
      given_name: firstname,
      locale: getLanguage(),
    },
  })
}

export const ConfirmSignUp = async ({ username, verification }: SignupConfirmArgs) => {
  return Auth.confirmSignUp(username, verification)
}

export const SignIn = async ({ username, password }: SigninArgs) => {
  return Auth.signIn(username, password)
}

export const ResendVerification = async ({ username }: UsernameArgs) => {
  return Auth.resendSignUp(username)
}

export const SendForgotPasswordVerification = async ({ username }: UsernameArgs) => {
  return Auth.forgotPassword(username)
}

export const SubmitForgotPassword = async ({ username, code, newPassword }: ForgotPasswordArgs) => {
  return Auth.forgotPasswordSubmit(username, code, newPassword)
}
