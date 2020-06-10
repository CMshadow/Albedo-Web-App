import * as actionTypes from '../action/actionTypes';

const initialState = {};

const setReportData = (state, action) => {
  return {
    ...state,
    [action.buildingID]: action.data
  }
}

const updateReportAttributes = (state, action) => {
  return {
    ...state,
    [action.buildingID]: {
      ...state[action.buildingID],
      ...action.values
    }
  }
}

const releaseReportData = (state, action) => {
  return {}
}

const deleteReportData = (state, action) => {
  const newState = { ...state }
  delete newState[action.buildingID]
  return newState
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_REPORTDATA:
      return setReportData(state, action);
    case actionTypes.UPDATE_REPORTATTRIBUTES:
      return updateReportAttributes(state, action)
    case actionTypes.RELEASE_REPORTDATA:
      return releaseReportData(state, action)
    case actionTypes.DELETE_REPORTDATA:
      return deleteReportData(state, action)
    default: return state;
  }
};

export default reducer;
