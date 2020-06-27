import * as actionTypes from '../actionTypes'
import * as objTypes from './objTypes'
import Polyline from '../../../infrastructure/line/polyline'
import Coordinate from '../../../infrastructure/point/coordinate'
import { moveHoriPoint, moveVertiPoint } from './pointAction'
import { Color } from 'cesium'

const polylineColor = Color.STEELBLUE

export const createPolyline = ({mouseCor, polylineId, pointMap}) => (dispatch, getState) => {
  const polyline = new Polyline(
    [mouseCor], polylineId, polylineColor
  )

  dispatch({
    type: actionTypes.SET_DRAWING_OBJECT,
    entityId: polyline.entityId,
    drawingType: objTypes.POLYLINE
  })

  return dispatch({
    type: actionTypes.POLYLINE_CREATE,
    entity: polyline,
    pointMap: pointMap
  })
}

export const polylineDynamic = (mouseCor) => (dispatch, getState) => {
  const drawingId = getState().undoable.present.drawing.drawingId
  const drawingPolyline = getState().undoable.present.polyline[drawingId].entity
  const pointMap = getState().undoable.present.polyline[drawingId].pointMap
  const fixedPoints = drawingPolyline.points.length > 1 ?
    drawingPolyline.points.slice(0, -1) :
    drawingPolyline.points
  const newPoints = fixedPoints.concat(mouseCor)

  return dispatch({
    type: actionTypes.POLYLINE_UPDATE,
    entity: new Polyline(
      newPoints, drawingPolyline.entityId, polylineColor
    ),
    pointMap: pointMap
  })
}

export const polylineAddVertex = (mouseCor, pointId) => (dispatch, getState) => {
  const drawingId = getState().undoable.present.drawing.drawingId
  const drawingPolyline = getState().undoable.present.polyline[drawingId].entity
  const pointMap = getState().undoable.present.polyline[drawingId].pointMap
  const polylinePoints = drawingPolyline.points
  return dispatch({
    type: actionTypes.POLYLINE_UPDATE,
    entity: new Polyline(
      [...polylinePoints, mouseCor], drawingPolyline.entityId, polylineColor
    ),
    pointMap: [...pointMap, pointId]
  })
}

export const polylineUpdateVertex = (polylineId, mouseCor, pointId) => (dispatch, getState) => {
  const drawingPolyline = getState().undoable.present.polyline[polylineId].entity
  const pointMap = getState().undoable.present.polyline[polylineId].pointMap
  const pointIndex = pointMap.indexOf(pointId)
  const newPoints = [...drawingPolyline.points]
  newPoints.splice(pointIndex, 1, mouseCor)

  return dispatch({
    type: actionTypes.POLYLINE_UPDATE,
    entity: new Polyline(
      newPoints, drawingPolyline.entityId, polylineColor
    ),
    pointMap: pointMap
  })
}

export const polylineTerminate = () => (dispatch, getState) => {
  const drawingId = getState().undoable.present.drawing.drawingId
  const drawingPolyline = getState().undoable.present.polyline[drawingId].entity
  const pointMap = getState().undoable.present.polyline[drawingId].pointMap
  const fixedPoints = drawingPolyline.points.length > 1 ?
    drawingPolyline.points.slice(0, -1) :
    drawingPolyline.points

  dispatch({
    type: actionTypes.RELEASE_DRAWING_OBJECT
  })

  return dispatch({
    type: actionTypes.POLYLINE_UPDATE,
    entity: new Polyline(
      fixedPoints, drawingPolyline.entityId, polylineColor
    ),
    pointMap: pointMap
  })
}
