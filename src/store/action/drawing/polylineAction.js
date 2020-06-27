import * as actionTypes from '../actionTypes'
import * as objTypes from './objTypes'
import Polyline from '../../../infrastructure/line/polyline'
import Coordinate from '../../../infrastructure/point/coordinate'
import { moveHoriPoint, moveVertiPoint } from './pointAction'
import { Color } from 'cesium'

const polylineColor = Color.STEELBLUE

export const createPolyline = ({mouseCor, polylineId, pointMap}) =>
(dispatch, getState) => {
  const polyline = new Polyline([mouseCor], polylineId, polylineColor)

  dispatch({
    type: actionTypes.SET_DRAWING_OBJECT,
    entityId: polylineId,
    drawingType: objTypes.POLYLINE
  })

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: polyline,
    pointMap: pointMap
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
  newPointMap.splice(position || newPointMap.length, 0, pointId)
  newPoints.splice(position || newPoints.length, 0, mouseCor)
  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: new Polyline(newPoints, drawingPolyline.entityId, polylineColor),
    pointMap: newPointMap
  })
}

export const polylineUpdateVertex = ({polylineId, mouseCor, pointId}) => (dispatch, getState) => {
  const drawingPolyline = getState().undoable.present.polyline[polylineId].entity
  const pointMap = getState().undoable.present.polyline[polylineId].pointMap
  const pointIndex = pointMap.indexOf(pointId)
  const newPoints = [...drawingPolyline.points]
  newPoints.splice(pointIndex, 1, mouseCor)

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
  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: new Polyline(
      newPoints, polyline.entityId, polylineColor
    ),
    pointMap: newPointMap
  })
}
