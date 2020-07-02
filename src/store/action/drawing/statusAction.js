import * as actionTypes from '../actionTypes'

export const setDrwStatIdle = (props) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_IDLE,
    props: props
  })
}

export const setDrwStatPoint = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_POINT
  })
}

export const setDrwStatPolygon = (props) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_POLYGON,
    props: props
  })
}

export const setDrwStatPolyline = (props) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_POLYLINE,
    props: props
  })
}

export const setDrwStatLine = (props) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_LINE,
    props: props
  })
}

export const setDrwStatCircle = (props) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_CIRCLE,
    props: props
  })
}

export const setDrwStatSector = (props) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.DRAWING_STATUS_SECTOR,
    props: props
  })
}
