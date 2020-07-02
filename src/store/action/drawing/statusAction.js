import * as actionTypes from '../actionTypes'

export const setDrwStatIdle = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_IDLE
  })
}

export const setDrwStatPoint = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_POINT
  })
}

export const setDrwStatPolygon = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_POLYGON
  })
}

export const setDrwStatPolyline = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_POLYLINE
  })
}

export const setDrwStatLine = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_LINE
  })
}

export const setDrwStatCircle = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_CIRCLE
  })
}

export const setDrwStatSector = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_SECTOR
  })
}