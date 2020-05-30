import * as actionTypes from '../action/actionTypes';

const initialState = {
  data: [],
  activeData: []
};

const setInverterData = (state, action) => {
  return {
    ...state,
    data: action.data
  }
}

const setInverterActiveData = (state, action) => {
  return {
    ...state,
    activeData: action.activeData
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_INVERTER_DATA:
      return setInverterData(state, action);
    case actionTypes.SET_INVERTER_ACTIVEDATA:
      return setInverterActiveData(state, action);
    default: return state;
  }
};

export default reducer;
