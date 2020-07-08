import * as actionTypes from '../actionTypes';

export const setBuildingParams = ({
  buildingName, buildingType, buildingHeight, parapetHeight, eaveSetback
}) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.MODELING_CREATE_BUILDING,
    buildingName: buildingName,
    buildingType: buildingType,
    parapetHeight: parapetHeight,
    buildingHeight: buildingHeight,
    eaveSetback: eaveSetback
  });
}

export const setModelingLoading = (loading) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_MODELING_LOADING,
    modelingLoading: loading
  })
}

export const bindDrawingObj = ({objType, objId}) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.BIND_DRAWING_OBJECT,
    objType: objType,
    objId: objId
  })
}

export const deleteDrawingObj = ({objType, objId}) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DELETE_DRAWING_OBJECT,
    objType: objType,
    objId: objId
  })
}
