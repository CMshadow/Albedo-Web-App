import * as actionTypes from './actionTypes';

export const setInverterData = (data) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_INVERTER_DATA,
    data: data
  });
}

export const setInverterActiveData = (activeData) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_INVERTER_ACTIVEDATA,
    activeData: activeData
  })
}
