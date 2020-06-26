import * as actionTypes from '../actionTypes'
import * as objTypes from './objTypes'
import Polygon from '../../../infrastructure/polygon/polygon'
import { Color } from 'cesium'

const polygonColor = Color.WHITE.withAlpha(0.4)

export const createPolygon = (mouseCor) => (dispatch, getState) => {
  const polygonH = mouseCor.height
  const polygon = new Polygon(mouseCor.getCoordinate(true), polygonH)

  dispatch({
    type: actionTypes.SET_DRAWING_OBJECT,
    entityId: polygon.entityId,
    drawingType: objTypes.POLYGON
  })

  return dispatch({
    type: actionTypes.POLYGON_CREATE,
    entity: polygon
  })
}

export const polygonDynamic = (mouseCor) => (dispatch, getState) => {
  const drawingId = getState().undoable.present.drawing.drawingId
  const drawingPolygon = getState().undoable.present.polygon[drawingId]
  const fixedHier = drawingPolygon.hierarchy.length > 3 ?
    drawingPolygon.hierarchy.slice(0, -3) :
    drawingPolygon.hierarchy
  const newHier = fixedHier.concat(mouseCor.getCoordinate(true))

  return dispatch({
    type: actionTypes.POLYGON_UPDATE,
    entity: new Polygon(
      newHier, mouseCor.height, drawingPolygon.entityId, null, polygonColor
    )
  })
}

export const polygonAddVertex = (mouseCor) => (dispatch, getState) => {
  const drawingId = getState().undoable.present.drawing.drawingId
  const drawingPolygon = getState().undoable.present.polygon[drawingId]
  const newHier = drawingPolygon.hierarchy.concat(mouseCor.getCoordinate(true))

  return dispatch({
    type: actionTypes.POLYGON_UPDATE,
    entity: new Polygon(
      newHier, mouseCor.height, drawingPolygon.entityId, null, polygonColor
    )
  })
}

export const polygonTerminate = () => (dispatch, getState) => {
  const drawingId = getState().undoable.present.drawing.drawingId
  const drawingPolygon = getState().undoable.present.polygon[drawingId]
  const newHier = drawingPolygon.hierarchy.length > 3 ?
    drawingPolygon.hierarchy.slice(0, -3) :
    drawingPolygon.hierarchy

  dispatch({
    type: actionTypes.RELEASE_DRAWING_OBJECT
  })

  return dispatch({
    type: actionTypes.POLYGON_UPDATE,
    entity: new Polygon(
      newHier, newHier.height, drawingPolygon.entityId, null, polygonColor
    )
  })
}
