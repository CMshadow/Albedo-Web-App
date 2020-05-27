import * as actionTypes from './actionTypes';

export const setProjectData = (data) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_PROJECTDATA,
    data: data
  });
}

export const addBuilding = (buildingName) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.ADD_BUILDING,
    buildingName: buildingName
  })
}

export const deleteBuilding = (buildingID) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DELETE_BUILDING,
    buildingID: buildingID
  })
}
