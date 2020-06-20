import * as actionTypes from '../action/actionTypes';

const initialState = {
  data: [],
  officialData: []
};

const setInverterData = (state, action) => {
  return {
    ...state,
    data: action.data
  }
}

const setOfficialInverterData = (state, action) => {
  return {
    ...state,
    officialData: action.data
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_INVERTER_DATA:
      return setInverterData(state, action);
    case actionTypes.SET_OFFICIAL_INVERTER_DATA:
      return setOfficialInverterData(state, action);
    default: return state;
  }
};

export default reducer;
