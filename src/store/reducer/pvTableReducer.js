import * as actionTypes from '../action/actionTypes';

const initialState = {
  data: [],
  activeData: [],
  officialData: [],
  activeOfficialData: []
};

const setPVData = (state, action) => {
  return {
    ...state,
    data: action.data
  }
}

const setOfficialPVData = (state, action) => {
  return {
    ...state,
    officialData: action.data
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PV_DATA:
      return setPVData(state, action);
    case actionTypes.SET_OFFICIAL_PV_DATA:
      return setOfficialPVData(state, action)
    default: return state;
  }
};

export default reducer;
