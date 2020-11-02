import * as actionTypes from '../action/actionTypes'
import { getLanguage } from '../../utils/getLanguage'
import { IUnitState, UnitActionTypes } from '../types/unit'

const initialState: IUnitState = {
  unit: getLanguage() === 'zh-CN' ? 'm' : 'ft'
};

const setUnit = (state: IUnitState, action: UnitActionTypes) => {
  return {
    unit: action.unit
  }
}

const reducer = (state=initialState, action: UnitActionTypes) => {
  switch (action.type) {
    case actionTypes.SET_UNIT:
      return setUnit(state, action);
    default: return state;
  }
};

export default reducer;
