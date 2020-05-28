import * as actionTypes from './actionTypes';

export const setPVData = (data) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_PV_DATA,
    data: data
  });
}

export const setPVActiveData = (activeData) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_PV_ACTIVEDATA,
    activeData: activeData
  })
}
