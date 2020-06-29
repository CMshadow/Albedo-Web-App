import * as actionTypes from '../actionTypes'
import Point from '../../../infrastructure/point/point'
import Coordinate from '../../../infrastructure/point/coordinate'
import { polygonUpdateVertex, polygonDeleteVertex } from './polygonAction'
import { polylineUpdateVertex, polylineDeleteVertex } from './polylineAction'
import { circleUpdate } from './circleAction'
import { notification } from 'antd'

const POLYLINE_OFFSET = -0.025
const POLYGON_OFFSET = -0.05

export const addPoint = ({mouseCor, pointId, polygonId, polylineId, circleId}) =>
(dispatch, getState) => {
  const point = Point.fromCoordinate(mouseCor, pointId)
  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
    polygonMap: polygonId ? [polygonId] : [],
    polylineMap: polylineId ? [polylineId] : [],
    circleMap: circleId || 'EMPTY',
  })
}

export const pointAddMapping = ({pointId, polygonId, polylineId, circleId}) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const circleMap = getState().undoable.present.point[pointId].circleMap

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
    polygonMap: polygonId ? [...polygonMap, polygonId] : polygonMap,
    polylineMap: polylineId ? [...polylineMap, polylineId] : polylineMap,
    circleMap: circleId || circleMap
  })
}

export const setPointHeight = (pointId, newHeight) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap

  point.setCoordinate(null, null, newHeight > 0.1 ? newHeight : 0.1)
  polygonMap.map(polygonId => {
    const polygon = getState().undoable.present.polygon[polygonId].entity
    const pointMap = getState().undoable.present.polygon[polygonId].pointMap
    const pointIndex = pointMap.indexOf(pointId)
    const newCor = new Coordinate(
      ...polygon.hierarchy.slice(pointIndex * 3, pointIndex * 3 + 3)
    )
    newCor.setCoordinate(null, null, newHeight + POLYGON_OFFSET)
    return dispatch(polygonUpdateVertex({polygonId, mouseCor: newCor, pointId}))
  })
  polylineMap.map(polylineId => {
    const polyline = getState().undoable.present.polyline[polylineId].entity
    const pointMap = getState().undoable.present.polyline[polylineId].pointMap
    const pointIndex = pointMap.indexOf(pointId)
    const newCor = new Coordinate(...polyline.points[pointIndex].getCoordinate(true))
    newCor.setCoordinate(null, null, newHeight + POLYLINE_OFFSET)
    return dispatch(polylineUpdateVertex({polylineId, mouseCor: newCor, pointId}))
  })

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
  })
}

export const moveHoriPoint = (pointId, mouseCor) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const circleMap = getState().undoable.present.point[pointId].circleMap
  point.setCoordinate(mouseCor.lon, mouseCor.lat, point.height)
  mouseCor.setCoordinate(null, null, point.height - 0.05)
  polygonMap.map(polygonId => dispatch(polygonUpdateVertex({polygonId, mouseCor, pointId})))
  polylineMap.map(polylineId => dispatch(polylineUpdateVertex({polylineId, mouseCor, pointId})))
  if (circleMap !== 'EMPTY') dispatch(circleUpdate({circleId: circleMap, pointId, mouseCor}))

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
  })
}

export const moveVertiPoint = (pointId, heightChange) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const newHeight = point.height + heightChange
  if (newHeight >= 0.1) point.setCoordinate(null, null, newHeight)

  polygonMap.map(polygonId => {
    const polygon = getState().undoable.present.polygon[polygonId].entity
    const pointMap = getState().undoable.present.polygon[polygonId].pointMap
    const pointIndex = pointMap.indexOf(pointId)
    const newCor = new Coordinate(
      ...polygon.hierarchy.slice(pointIndex * 3, pointIndex * 3 + 3)
    )
    newCor.setCoordinate(null, null, newHeight + POLYGON_OFFSET)
    return dispatch(polygonUpdateVertex({polygonId, mouseCor: newCor, pointId}))
  })
  polylineMap.map(polylineId => {
    const polyline = getState().undoable.present.polyline[polylineId].entity
    const pointMap = getState().undoable.present.polyline[polylineId].pointMap
    const pointIndex = pointMap.indexOf(pointId)
    const newCor = new Coordinate(...polyline.points[pointIndex].getCoordinate(true))
    newCor.setCoordinate(null, null, newHeight + POLYLINE_OFFSET)
    return dispatch(polylineUpdateVertex({polylineId, mouseCor: newCor, pointId}))
  })

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
  })
}

export const deletePoint = (pointId) => (dispatch, getState) => {
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const polygonOK = polygonMap.every(polygonId =>
    getState().undoable.present.polygon[polygonId].entity.hierarchy.length / 3 > 3
  )
  const polylineOK = polylineMap.every(polylineId =>
    getState().undoable.present.polyline[polylineId].entity.length > 2
  )
  if (polylineOK && polygonOK) {
    polylineMap.map(polylineId => {
      return dispatch(polylineDeleteVertex(polylineId, pointId))})
    polygonMap.map(polygonId => dispatch(polygonDeleteVertex(polygonId, pointId)))
    return dispatch({
      type: actionTypes.POINT_DELETE,
      pointId: pointId
    })
  } else {
    notification.error({
      message: 'Delete Failed',
      description: 'The point cannot be deleted because it has other shapes associated'
    })
  }
}
