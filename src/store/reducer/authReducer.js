import * as actionTypes from '../action/actionTypes';

const initialState = {
  cognitoUser: null,
};

const setCognitoUser = (state, action) => {
  return {
    ...state,
    cognitoUser: action.cognitoUser
  }
}

const setCognitoUserSession = (state, action) => {
  return {
    ...state,
    cognitoUser: {
      ...state.cognitoUser,
      signInUserSession: action.session
    }
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_COGNITOUSER:
      return setCognitoUser(state, action);
    case actionTypes.SET_COGNITOUSERSESSION:
      return setCognitoUserSession(state, action);
    default: return state;
  }
};

export default reducer;
