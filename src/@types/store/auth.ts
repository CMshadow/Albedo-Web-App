import { SET_COGNITOUSER, SET_SIGNOUT } from '../../store/action/actionTypes'
import { CognitoUserExt } from '../../@types'

export interface IAuthState {
  cognitoUser: CognitoUserExt | null
}

export interface SetCognitoUserAction {
  type: typeof SET_COGNITOUSER
  cognitoUser: CognitoUserExt
}

export interface SetSignOutAction {
  type: typeof SET_SIGNOUT
}

export type AuthActionTypes = SetCognitoUserAction | SetSignOutAction
