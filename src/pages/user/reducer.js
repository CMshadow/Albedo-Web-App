import * as actionTypes from '../../store/action/actionTypes';

const initialState = {
  cognitoUser: null,
  verified: false,
  loading: false
};

const setCognitoUser = (state, action) => {
  return {
    ...state,
    cognitoUser: action.cognitoUser
  }
}

const setVerified = (state, action) => {
  return {
    ...state,
    verified: action.verified
  }
}

const setAuthLoading = (state, action) => {
  return {
    ...state,
    loading: action.loading
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_COGNITOUSER:
      return setCognitoUser(state, action);
    case actionTypes.SET_VERIFIED:
      return setVerified(state, action);
    case actionTypes.SET_AUTH_LOADING:
      return setAuthLoading(state, action);
    default: return state;
  }
};

export default reducer;
