import * as actionTypes from './actionTypes';

export const setProjectData = (data) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_PROJECTDATA,
    data: data
  });
}

export const updateProjectAttributes = (values) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.UPDATE_PROJECTATTRIBUTES,
    values: values
  })
}

export const releaseProjectData = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.RELEASE_PROJECTDATA
  })
}

export const addBuilding = (values, t) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.ADD_BUILDING,
    ...values
  })
}

export const editBuilding = ({buildingID, ...values}) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.EDIT_BUILDING,
    buildingID: buildingID,
    ...values
  })
}

export const deleteBuilding = (buildingID) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DELETE_BUILDING,
    buildingID: buildingID
  })
}

export const setBuildingReGenReport = ({buildingID, reGenReport}) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_BUILDING_REGENREPORT,
    buildingID: buildingID,
    reGenReport: reGenReport
  })
}

export const addPVSpec = (buildingID) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.ADD_PV_SPEC,
    buildingID: buildingID
  })
}

export const editPVSpec = ({buildingID, specIndex, ...values}) =>
(dispatch, getState) => {
  return dispatch({
    type: actionTypes.EDIT_PV_SPEC,
    buildingID: buildingID,
    specIndex: specIndex,
    ...values
  })
}

export const deletePVSpec = ({buildingID, specIndex}) => (dispatch,getState) => {
  return dispatch({
    type: actionTypes.DELETE_PV_SPEC,
    buildingID: buildingID,
    specIndex: specIndex
  })
}

export const addInverterSpec = ({buildingID, specIndex}) =>
(dispatch, getState) => {
  return dispatch({
    type: actionTypes.ADD_INVERTER_SPEC,
    buildingID: buildingID,
    specIndex: specIndex,
  })
}

export const editInverterSpec = ({
  buildingID, specIndex, invIndex, ...values
}) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.EDIT_INVERTER_SPEC,
    buildingID: buildingID,
    specIndex: specIndex,
    invIndex: invIndex,
    ...values
  })
}

export const deleteInverterSpec = ({buildingID, specIndex, invIndex}) =>
(dispatch,getState) => {
  return dispatch({
    type: actionTypes.DELETE_INVERTER_SPEC,
    buildingID: buildingID,
    specIndex: specIndex,
    invIndex: invIndex,
  })
}
