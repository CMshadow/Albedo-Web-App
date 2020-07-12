import * as actionTypes from '../action/actionTypes';
import { getLanguage } from '../../utils/getLanguage'

const initialState = {
  unit: getLanguage() === 'zh-CN' ? 'm' : 'ft'
};

const setUnit = (state, action) => {
  return {
    unit: action.unit
  }
}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_UNIT:
      return setUnit(state, action);
    default: return state;
  }
};

export default reducer;
