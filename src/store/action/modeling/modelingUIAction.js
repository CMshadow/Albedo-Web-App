import * as actionTypes from '../actionTypes';

export const setUICreateBuilding = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_UI_CREATE_BUILDING
  });
}

export const setUIDrawing = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.SET_UI_DRAWING
  })
}
