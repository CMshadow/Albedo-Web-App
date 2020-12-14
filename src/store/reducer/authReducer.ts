import * as actionTypes from '../action/actionTypes'
import { IAuthState, AuthActionTypes, SetCognitoUserAction } from '../../@types'

const initialState: IAuthState = {
  cognitoUser: null,
}

const setCognitoUser = (state: IAuthState, action: SetCognitoUserAction) => {
  return {
    ...state,
    cognitoUser: action.cognitoUser,
  }
}

const setSignOut = () => {
  return initialState
}

const reducer = (state = initialState, action: AuthActionTypes): IAuthState => {
  switch (action.type) {
    case actionTypes.SET_COGNITOUSER:
      return setCognitoUser(state, action)
    case actionTypes.SET_SIGNOUT:
      return setSignOut()
    default:
      return state
  }
}

export default reducer
