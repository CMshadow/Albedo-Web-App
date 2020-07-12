import * as actionTypes from './actionTypes';

export const setUnit = (unit) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_UNIT,
    unit: unit
  })
}
