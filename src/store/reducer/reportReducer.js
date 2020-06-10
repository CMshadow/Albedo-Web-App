import * as actionTypes from '../action/actionTypes';

const initialState = {};

const setProjectData = (state, action) => {
  return {
    ...state,
    [action.buildingID]: action.data
  }
}

const updateReportAttributes = (state, action) => {
  console.log({
    ...state,
    [action.buildingID]: {
      ...state[action.buildingID],
      ...action.values
    }
  })
  return {
    ...state,
    [action.buildingID]: {
      ...state[action.buildingID],
      ...action.values
    }
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_REPORTDATA:
      return setProjectData(state, action);
    case actionTypes.UPDATE_REPORTATTRIBUTES:
      return updateReportAttributes(state, action)
    default: return state;
  }
};

export default reducer;
