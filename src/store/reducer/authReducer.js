import * as actionTypes from '../action/actionTypes';

const initialState = {
  cognitoUser: null,
}

const setCognitoUser = (state, action) => {
  return {
    ...state,
    cognitoUser: action.cognitoUser
  }
}

const setSignOut = (state, action) => {
  return initialState
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_COGNITOUSER:
      return setCognitoUser(state, action);
    case actionTypes.SET_SIGNOUT:
      return setSignOut(state, action)
    default: return state;
  }
};

export default reducer;
