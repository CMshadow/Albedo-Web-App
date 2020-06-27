import * as actionTypes from '../actionTypes'
import Point from '../../../infrastructure/point/point'
import Coordinate from '../../../infrastructure/point/coordinate'
import { polygonUpdateVertex } from './polygonAction'
import { polylineUpdateVertex } from './polylineAction'

const POLYGON_OFFSET = 0.1

export const addPoint = ({mouseCor, pointId, polygonMap, polylineMap}) =>
(dispatch, getState) => {
  const point = Point.fromCoordinate(mouseCor, pointId)
  return dispatch({
    type: actionTypes.POINT_ADD,
    entity: point,
    polygonMap: polygonMap || [],
    polylineMap: polylineMap || []
  })
}

export const setPointHeight = (pointId, newHeight) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap

  // const newPoint = Point.fromPoint(point)
  point.setCoordinate(null, null, newHeight > 0.1 ? newHeight : 0.1)
  polygonMap.forEach(polygonId => {
    const polygon = getState().undoable.present.polygon[polygonId].entity
    const pointMap = getState().undoable.present.polygon[polygonId].pointMap
    const pointIndex = pointMap.indexOf(pointId)
    const newCor = new Coordinate(
      ...polygon.hierarchy.slice(pointIndex * 3, pointIndex * 3 + 3)
    )
    newCor.setCoordinate(null, null, newHeight)
    dispatch(polygonUpdateVertex(polygonId, newCor, pointId))
  })

  return dispatch({
    type: actionTypes.POINT_UPDATE,
    entity: point
  })
}

export const moveHoriPoint = (pointId, mouseCor) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  // const newPoint = Point.fromPoint(point)
  point.setCoordinate(mouseCor.lon, mouseCor.lat, point.height)
  mouseCor.setCoordinate(null, null, point.height - 0.05)
  polygonMap.forEach(polygonId => dispatch(polygonUpdateVertex(polygonId, mouseCor, pointId)))
  polylineMap.forEach(polylineId => dispatch(polylineUpdateVertex(polylineId, mouseCor, pointId)))

  return dispatch({
    type: actionTypes.POINT_UPDATE,
    entity: point
  })
}

export const moveVertiPoint = (pointId, heightChange) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const newHeight = point.height + heightChange
  if (newHeight >= 0.1) point.setCoordinate(null, null, newHeight)
  polygonMap.forEach(polygonId => {
    const polygon = getState().undoable.present.polygon[polygonId].entity
    const pointMap = getState().undoable.present.polygon[polygonId].pointMap
    const pointIndex = pointMap.indexOf(pointId)
    const newCor = new Coordinate(
      ...polygon.hierarchy.slice(pointIndex * 3, pointIndex * 3 + 3)
    )
    newCor.setCoordinate(null, null, newHeight)
    dispatch(polygonUpdateVertex(polygonId, newCor, pointId))
  })
  polylineMap.forEach(polylineId => {
    const polyline = getState().undoable.present.polyline[polylineId].entity
    const pointMap = getState().undoable.present.polyline[polylineId].pointMap
    const pointIndex = pointMap.indexOf(pointId)
    const newCor = polyline.points[pointIndex]
    newCor.setCoordinate(null, null, newHeight)
    dispatch(polylineUpdateVertex(polylineId, newCor, pointId))
  })

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
