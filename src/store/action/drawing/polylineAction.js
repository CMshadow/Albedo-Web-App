import * as actionTypes from '../actionTypes'
import Polyline from '../../../infrastructure/line/polyline'
import { Color } from 'cesium'
import { deletePointNoSideEff, pointRemoveMapping } from './pointAction'

const polylineColor = Color.STEELBLUE

export const createPolyline = ({mouseCor, polylineId, pointId, insidePolygonId}) =>
(dispatch, getState) => {
  const polyline = new Polyline([mouseCor], polylineId, polylineColor)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: polyline,
    pointMap: pointId ? [pointId] : [],
    insidePolygonId: insidePolygonId || 'EMPTY'
  })
}

export const polylineSetColor = (polylineId, color) => (dispatch, getState) => {
  const polyline = getState().undoable.present.polyline[polylineId].entity
  const newPolyline = Polyline.fromPolyline(polyline)
  newPolyline.setColor(color)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: newPolyline,
  })
}

export const polylineSetShow = (polylineId, show) => (dispatch, getState) => {
  const polyline = getState().undoable.present.polyline[polylineId].entity
  const newPolyline = Polyline.fromPolyline(polyline)
  newPolyline.show = show

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: newPolyline,
  })
}

export const polylineDynamic = (polylineId, mouseCor) => (dispatch, getState) => {
  const drawingPolyline = getState().undoable.present.polyline[polylineId].entity
  const fixedPoints = drawingPolyline.points.length > 1 ?
    drawingPolyline.points.slice(0, -1) :
    drawingPolyline.points
  const newPoints = fixedPoints.concat(mouseCor)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: new Polyline(newPoints, drawingPolyline.entityId, polylineColor),
  })
}

export const polylineAddVertex = ({polylineId, mouseCor, pointId, position=null}) =>
(dispatch, getState) => {
  const drawingPolyline = getState().undoable.present.polyline[polylineId].entity
  const pointMap = getState().undoable.present.polyline[polylineId].pointMap
  const newPointMap = [...pointMap]
  const newPoints = [...drawingPolyline.points]
  newPointMap.splice(
    position || newPointMap.length, 0, pointId
  )
  newPoints.splice(
    position || newPointMap.length - 1, 0, mouseCor
  )
  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: new Polyline(newPoints, drawingPolyline.entityId, polylineColor),
    pointMap: newPointMap
  })
}

export const polylineUpdateVertex = ({polylineId, mouseCor, pointId}) => (dispatch, getState) => {
  const drawingPolyline = getState().undoable.present.polyline[polylineId].entity
  const pointMap = getState().undoable.present.polyline[polylineId].pointMap

  const newPoints = [...drawingPolyline.points]
  pointMap.forEach((pId, index) => {
    if (pId === pointId) {
      newPoints.splice(index, 1, mouseCor)
    }
  })

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: new Polyline(newPoints, drawingPolyline.entityId, polylineColor),
  })
}

export const polylineTerminate = (polylineId) => (dispatch, getState) => {
  const drawingPolyline = getState().undoable.present.polyline[polylineId].entity
  const fixedPoints = drawingPolyline.points.length > 1 ?
    drawingPolyline.points.slice(0, -1) :
    drawingPolyline.points

  dispatch({
    type: actionTypes.RELEASE_DRAWING_OBJECT
  })

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: new Polyline(fixedPoints, drawingPolyline.entityId, polylineColor),
  })
}

export const polylineDeleteVertex = (polylineId, pointId) => (dispatch, getState) => {
  const polyline = getState().undoable.present.polyline[polylineId].entity
  const pointMap = getState().undoable.present.polyline[polylineId].pointMap
  const pointIndex = pointMap.indexOf(pointId)
  const newPointMap = [...pointMap]
  newPointMap.splice(pointIndex, 1)
  const newPoints = [...polyline.points]
  newPoints.splice(pointIndex, 1)
  if (pointIndex === 0 && pointMap.slice(-1)[0] === pointId) {
    newPointMap.splice(-1, 1, newPointMap[0])
    newPoints.splice(-1, 1, newPoints[0])
  }

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: new Polyline(
      newPoints, polyline.entityId, polylineColor
    ),
    pointMap: newPointMap
  })
}

export const polylineDelete = (polylineId) => async (dispatch, getState) => {
  const pointMap = getState().undoable.present.polyline[polylineId].pointMap
  await Promise.all(Array.from(new Set(pointMap)).map(pointId =>
    dispatch(pointRemoveMapping({pointId, polylineId}))
  ))
  Array.from(new Set(pointMap)).map(pointId =>
    dispatch(deletePointNoSideEff(pointId))
  )

  return dispatch({
    type: actionTypes.POLYLINE_DELETE,
    polylineId: polylineId
  })
}
