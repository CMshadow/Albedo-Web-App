import * as actionTypes from '../../store/action/actionTypes';

const initialState = {
  cognitoUser: null,
};

const setCognitoUser = (state, action) => {
  return {
    ...state,
    cognitoUser: action.cognitoUser
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_COGNITOUSER:
      return setCognitoUser(state, action);
    default: return state;
  }
};

export default reducer;
