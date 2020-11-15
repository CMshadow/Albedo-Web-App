import * as actionTypes from './actionTypes'
import { ThunkAction } from 'redux-thunk'
import { CognitoUserExt, RootState, AuthActionTypes } from '../../@types'

type ThunkResult<R> = ThunkAction<R, RootState, undefined, AuthActionTypes>

export const setCognitoUser = (cognitoUser: CognitoUserExt): ThunkResult<void> => dispatch => {
  dispatch({
    type: actionTypes.SET_COGNITOUSER,
    cognitoUser: cognitoUser,
  })
}

export const setSignOut = (): ThunkResult<void> => dispatch => {
  dispatch({
    type: actionTypes.SET_SIGNOUT,
  })
}
