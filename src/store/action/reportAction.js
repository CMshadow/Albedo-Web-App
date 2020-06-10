import * as actionTypes from './actionTypes';

export const setReportData = ({buildingID, data}) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_REPORTDATA,
    buildingID: buildingID,
    data: data
  });
}

export const updateReportAttributes = ({buildingID, ...values}) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.UPDATE_REPORTATTRIBUTES,
    buildingID: buildingID,
    values: values
  });
}

export const releaseReportData = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.UPDATE_REPORTATTRIBUTES,
  });
}

export const deleteReportData = (buildingID) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.UPDATE_REPORTATTRIBUTES,
    buildingID: buildingID,
  });
}
