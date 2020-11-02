import * as actionTypes from '../action/actionTypes';
import { IAuthState, AuthActionTypes, SetCognitoUserAction, SetSignOutAction } from '../types/auth'

const initialState: IAuthState = {
  cognitoUser: null,
}

const setCognitoUser = (state: IAuthState, action: SetCognitoUserAction) => {
  return {
    ...state,
    cognitoUser: action.cognitoUser
  }
}

const setSignOut = (state: IAuthState, action: SetSignOutAction) => {
  return initialState
}

const reducer = (state=initialState, action: AuthActionTypes) => {
  switch (action.type) {
    case actionTypes.SET_COGNITOUSER:
      return setCognitoUser(state, action);
    case actionTypes.SET_SIGNOUT:
      return setSignOut(state, action)
    default: return state;
  }
};

export default reducer;
