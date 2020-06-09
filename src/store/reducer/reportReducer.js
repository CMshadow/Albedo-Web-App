import * as actionTypes from '../action/actionTypes';

const initialState = {};

const setProjectData = (state, action) => {
  return {
    ...state,
    [action.buildingID]: action.data
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_REPORTDATA:
      return setProjectData(state, action);
    default: return state;
  }
};

export default reducer;
