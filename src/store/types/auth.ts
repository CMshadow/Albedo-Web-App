import { SET_COGNITOUSER, SET_SIGNOUT } from '../action/actionTypes'
// import { CognitoUser } from '@aws-amplify/auth';

export type CognitoUser = {
  [key: string]: any
} | null

export interface IAuthState {
  cognitoUser: CognitoUser
}

export interface SetCognitoUserAction {
  type: typeof SET_COGNITOUSER,
  cognitoUser: CognitoUser
}

export interface SetSignOutAction {
  type: typeof SET_SIGNOUT
}

export type AuthActionTypes = SetCognitoUserAction | SetSignOutAction