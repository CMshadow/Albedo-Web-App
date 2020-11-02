import * as actionTypes from './actionTypes';
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducer/index'
import { AuthActionTypes, CognitoUser } from '../types/auth'

type ThunkResult<R> = ThunkAction<R, RootState, undefined, AuthActionTypes>

export const setCognitoUser = (cognitoUser: CognitoUser):ThunkResult<void>  => (dispatch, getState) => {
  dispatch({
    type: actionTypes.SET_COGNITOUSER,
    cognitoUser: cognitoUser
  });
}

export const setSignOut = (): ThunkResult<void> => (dispatch, getState) => {
  dispatch({
    type: actionTypes.SET_SIGNOUT
  })
}
