import * as actionTypes from '../action/actionTypes';

const initialState = {
  data: [],
  activeData: []
};

const setPVData = (state, action) => {
  return {
    ...state,
    data: action.data
  }
}

const setPVActiveData = (state, action) => {
  return {
    ...state,
    activeData: action.activeData
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PV_DATA:
      return setPVData(state, action);
    case actionTypes.SET_PV_ACTIVEDATA:
      return setPVActiveData(state, action);
    default: return state;
  }
};

export default reducer;
