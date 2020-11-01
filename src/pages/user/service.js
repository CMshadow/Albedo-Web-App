import { Auth } from 'aws-amplify';
import { getLanguage } from '../../utils/getLanguage';

export const Signup = async ({email, password, lastname, firstname}) => {
  return Auth.signUp({
    username: email,
    password: password,
    attributes: {
      family_name: lastname,
      given_name: firstname,
      locale: getLanguage()
    }
  })
}

export const ConfirmSignUp = async ({username, verification}) => {
  return Auth.confirmSignUp(username, verification)
}

export const SignIn = async ({username, password}) => {
  return Auth.signIn(username, password)
}

export const ResendVerification = async ({username}) => {
  return Auth.resendSignUp(username)
}

export const SendForgotPasswordVerification = async ({username}) => {
  return Auth.forgotPassword(username)
}

export const SubmitForgotPassword = async({username, code, newPassword}) => {
  return Auth.forgotPasswordSubmit(username, code, newPassword)
}