import * as actionTypes from '../actionTypes'
import Point from '../../../infrastructure/point/point'

export const addPoint = (mouseCor) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.POINT_ADD,
    entity: Point.fromCoordinate(mouseCor)
  })
}

export const setPointHeight = (pointId, newHeight) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId]
  // const newPoint = Point.fromPoint(point)
  point.setCoordinate(null, null, newHeight > 0.1 ? newHeight : 0.1)

  return dispatch({
    type: actionTypes.POINT_UPDATE,
    entity: point
  })
}

export const moveHoriPoint = (pointId, mouseCor) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId]
  // const newPoint = Point.fromPoint(point)
  point.setCoordinate(mouseCor.lon, mouseCor.lat, point.height)

  return dispatch({
    type: actionTypes.POINT_UPDATE,
    entity: point
  })
}

export const moveVertiPoint = (pointId, heightChange) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId]
  const newHeight = point.height + heightChange
  if (newHeight >= 0.1) point.setCoordinate(null, null, newHeight)

  return dispatch({
    type: actionTypes.POINT_UPDATE,
    entity: point
  })
}

export const deletePoint = (pointId) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.POINT_DELETE,
    pointId: pointId
  })
}
