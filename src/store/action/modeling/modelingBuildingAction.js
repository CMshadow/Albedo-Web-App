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

export const bindDrawingObj = ({objType, objId}) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.BIND_DRAWING_OBJECT,
    objType: objType,
    objId: objId
  })
}
