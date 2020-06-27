import * as actionTypes from '../actionTypes'
import * as objTypes from './objTypes'
import Polygon from '../../../infrastructure/polygon/polygon'
import Coordinate from '../../../infrastructure/point/coordinate'
import { moveHoriPoint, moveVertiPoint } from './pointAction'
import { Color } from 'cesium'

const polygonColor = Color.WHITE.withAlpha(0.2)

export const createPolygon = ({mouseCor, polygonId, pointMap}) => (dispatch, getState) => {
  const polygonH = mouseCor.height
  const polygon = new Polygon(
    mouseCor.getCoordinate(true), polygonH, polygonId, null, polygonColor
  )

  dispatch({
    type: actionTypes.SET_DRAWING_OBJECT,
    entityId: polygon.entityId,
    drawingType: objTypes.POLYGON
  })

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: polygon,
    pointMap: pointMap
  })
}

export const polygonDynamic = (polygonId, mouseCor) => (dispatch, getState) => {
  const drawingPolygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const fixedHier = drawingPolygon.hierarchy.length > 3 ?
    drawingPolygon.hierarchy.slice(0, -3) :
    drawingPolygon.hierarchy
  const newHier = fixedHier.concat(mouseCor.getCoordinate(true))

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: new Polygon(
      newHier, mouseCor.height, drawingPolygon.entityId, null, polygonColor
    ),
    pointMap: pointMap
  })
}

export const polygonAddVertex = ({polygonId, mouseCor, pointId}) => (dispatch, getState) => {
  const drawingPolygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const newHier = drawingPolygon.hierarchy.concat(mouseCor.getCoordinate(true))

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: new Polygon(
      newHier, mouseCor.height, drawingPolygon.entityId, null, polygonColor
    ),
    pointMap: [...pointMap, pointId]
  })
}

export const polygonUpdateVertex = ({polygonId, mouseCor, pointId}) => (dispatch, getState) => {
  const drawingPolygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const pointIndex = pointMap.indexOf(pointId)
  const newHier = [...drawingPolygon.hierarchy]
  newHier.splice(pointIndex * 3, 3, ...mouseCor.getCoordinate(true))

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: new Polygon(
      newHier, drawingPolygon.height, drawingPolygon.entityId, null, polygonColor
    ),
    pointMap: pointMap
  })
}

export const polygonTerminate = (polygonId) => (dispatch, getState) => {
  const drawingPolygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  console.log(pointMap)
  const newHier = drawingPolygon.hierarchy.length > 3 ?
    drawingPolygon.hierarchy.slice(0, -3) :
    drawingPolygon.hierarchy

  dispatch({
    type: actionTypes.RELEASE_DRAWING_OBJECT
  })

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: new Polygon(
      newHier, drawingPolygon.height, drawingPolygon.entityId, null, polygonColor
    ),
    pointMap: pointMap
  })
}

export const polygonMoveHori = (polygonId, brng, dist) => (dispatch, getState) => {
  const polygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const coordinates = polygon.convertHierarchyToCoordinate()

  pointMap.forEach((pointId, index) => {
    const pointNewCor = Coordinate.destination(coordinates[index], brng, dist)
    dispatch(moveHoriPoint(pointId, pointNewCor))
  })
}

export const polygonMoveVerti = (polygonId, heightChange) => (dispatch, getState) => {
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap

  pointMap.forEach((pointId, index) => {
    dispatch(moveVertiPoint(pointId, heightChange))
  })
}

export const polygonDeleteVertex = (polygonId, pointId) => (dispatch, getState) => {
  const polygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const pointIndex = pointMap.indexOf(pointId)
  const newPointMap = [...pointMap]
  newPointMap.splice(pointIndex, 1)
  const newHier = [...polygon.hierarchy]
  newHier.splice(pointIndex * 3, 3)
  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: new Polygon(
      newHier, polygon.height, polygon.entityId, null, polygonColor
    ),
    pointMap: newPointMap
  })
}
