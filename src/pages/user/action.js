import * as actionTypes from '../../store/action/actionTypes';

export const setCognitoUser = (cognitoUser) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_COGNITOUSER,
    cognitoUser: cognitoUser
  });
}

export const setCognitoUserSession = (session) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_COGNITOUSERSESSION,
    session: session
  })
}
