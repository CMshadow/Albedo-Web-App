import * as actionTypes from '../../store/action/actionTypes';

export const setCognitoUser = (cognitoUser) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_COGNITOUSER,
    cognitoUser: cognitoUser
  });
}

export const setVerified = (bool) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_VERIFIED,
    verified: bool
  });
}

export const setAuthLoading = (bool) => (dispatch, getState) =>{
  return dispatch({
    type: actionTypes.SET_AUTH_LOADING,
    loading: bool
  });
}
