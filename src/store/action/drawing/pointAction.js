import * as actionTypes from '../actionTypes'
import Point from '../../../infrastructure/point/point'

export const addPoint = (mouseCor) => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.POINT_ADD,
    entity: Point.fromCoordinate(mouseCor)
  })
}

export const moveHoriPoint = (pointId, mouseCor) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId]
  // const newPoint = Point.fromPoint(point)
  point.setCoordinate(mouseCor.lon, mouseCor.lat, point.height)

  return dispatch({
    type: actionTypes.POINT_MOVE_HORI,
    entity: point
  })
}

export const moveVertiPoint = (pointId, mouseCor) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId]
  const height = Point.linearDistance(point, mouseCor)
  point.setCoordinate(null, null, height)

  return dispatch({
    type: actionTypes.POINT_MOVE_VERTI,
    entity: point
  })
}
