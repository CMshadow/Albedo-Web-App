import * as actionTypes from './actionTypes';

export const setReportData = ({buildingID, data}) => (dispatch, getState) => {
  console.log(buildingID)
  console.log(data)
  return dispatch({
    type: actionTypes.SET_REPORTDATA,
    buildingID: buildingID,
    data: data
  });
}
