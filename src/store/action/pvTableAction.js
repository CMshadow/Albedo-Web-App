import * as actionTypes from './actionTypes';

export const setPVData = (data) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_PV_DATA,
    data: data
  });
}

export const setOfficialPVData = (data) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_OFFICIAL_PV_DATA,
    data: data
  });
}
