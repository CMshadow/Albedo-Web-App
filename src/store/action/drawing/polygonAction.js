import * as actionTypes from '../actionTypes'
import Polygon from '../../../infrastructure/polygon/polygon'
import Coordinate from '../../../infrastructure/point/coordinate'
import { bindDrawingObj } from '../modeling/modelingBuildingAction'
import * as actions from '../index'
import { Color } from 'cesium'
import { v4 as uuid } from 'uuid';

const POINT_OFFSET = 0.025
const POLYLINE_OFFSET = 0.0125

export const createPolygon = ({mouseCor, polygonId, pointId, outPolylineId}) =>
(dispatch, getState) => {
  const props = getState().undoable.present.drwStat.props
  const modelingObjType = props.objType
  const cor = new Coordinate(mouseCor.lon, mouseCor.lat, props.polygonHt)
  const polygon = new Polygon(
    cor.getCoordinate(true), props.polygonHt, polygonId, null, props.polygonTheme,
    props.polygonTheme, props.polygonHighlight
  )
  dispatch(bindDrawingObj({objType: modelingObjType, objId: polygonId}))
  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: polygon,
    props: {
      ...props,
      polygonPos: props.polygonPos !== null ? props.polygonPos : false,
      polygonHeight: props.polygonHeight !== null ? props.polygonHeight : false,
      theme: props.polygonTheme || Color.WHITE.withAlpha(0.2),
      highlight: props.polygonHighlight || Color.ORANGE.withAlpha(0.2)
    },
    pointMap: pointId ? [pointId] : [],
    outPolylineId: outPolylineId
  })
}

export const polygonHighlight = (polygonId) => (dispatch, getState) => {
  const polygon = getState().undoable.present.polygon[polygonId].entity
  polygon.setColor(polygon.highlight)

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: polygon,
  })
}

export const polygonDeHighlight = (polygonId) => (dispatch, getState) => {
  const obj = getState().undoable.present.polygon[polygonId]
  if (obj) {
    const polygon = obj.entity
    polygon.setColor(polygon.theme)

    return dispatch({
      type: actionTypes.POLYGON_SET,
      entity: polygon,
    })
  }
}

export const polygonSetShow = (polygonId, show) => (dispatch, getState) => {
  const polygon = getState().undoable.present.polygon[polygonId].entity
  const outPolylineId = getState().undoable.present.polygon[polygonId].outPolylineId
  const newPolygon = Polygon.fromPolygon(polygon)
  newPolygon.show = show
  dispatch(actions.polylineSetShow(outPolylineId, show))

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
  })
}

export const polygonDynamic = (polygonId, mouseCor) => (dispatch, getState) => {
  const drawingPolygon = getState().undoable.present.polygon[polygonId].entity
  const props = getState().undoable.present.polygon[polygonId].props
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const fixedHier = drawingPolygon.hierarchy.length > 3 ?
    drawingPolygon.hierarchy.slice(0, -3) :
    drawingPolygon.hierarchy
  const newHier = fixedHier.concat(
    new Coordinate(mouseCor.lon, mouseCor.lat, props.polygonHt).getCoordinate(true)
  )
  const newPolygon = Polygon.fromPolygon(drawingPolygon, null, null, newHier)

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
    pointMap: pointMap,
  })
}

export const polygonAddVertex = ({polygonId, mouseCor, pointId, position=null}) => (dispatch, getState) => {
  const drawingPolygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const props = getState().undoable.present.polygon[polygonId].props
  const newPointMap = [...pointMap]
  const newHier = [...drawingPolygon.hierarchy]
  const cor = new Coordinate(mouseCor.lon, mouseCor.lat, props.polygonHt)
  newPointMap.splice(position || newPointMap.length, 0, pointId)
  newHier.splice(
    position ? position * 3 : newHier.length, 0, ...cor.getCoordinate(true)
  )
  const newPolygon = Polygon.fromPolygon(drawingPolygon, null, null, newHier)

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
    pointMap: newPointMap,
  })
}

export const polygonUpdateVertex = ({polygonId, mouseCor, pointId}) => (dispatch, getState) => {
  const drawingPolygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const pointIndex = pointMap.indexOf(pointId)
  const newHier = [...drawingPolygon.hierarchy]
  newHier.splice(pointIndex * 3, 3, ...mouseCor.getCoordinate(true))
  const newPolygon = Polygon.fromPolygon(drawingPolygon, null, null, newHier)

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
    pointMap: pointMap,
  })
}

export const polygonTerminate = (polygonId) => (dispatch, getState) => {
  const drawingPolygon = getState().undoable.present.polygon[polygonId].entity
  const newHier = drawingPolygon.hierarchy.length > 3 ?
    drawingPolygon.hierarchy.slice(0, -3) :
    drawingPolygon.hierarchy
  const newPolygon = Polygon.fromPolygon(drawingPolygon, null, null, newHier)

  dispatch({
    type: actionTypes.RELEASE_DRAWING_OBJECT
  })

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
  })
}

export const polygonSetHeight = (polygonId, newHeight) => (dispatch, getState) => {
  const polygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const outPolylineId = getState().undoable.present.polygon[polygonId].outPolylineId
  Array.from(new Set(pointMap)).map(pointId =>
    dispatch(actions.pointSetHeightNoSideEff(pointId, newHeight + POINT_OFFSET))
  )
  dispatch(actions.polylineSetHeightNoSideEff(outPolylineId, newHeight + POLYLINE_OFFSET))

  const newHier = [...polygon.hierarchy]
  for (let i = 2; i < newHier.length; i += 3) newHier[i] = newHeight
  const newPolygon = Polygon.fromPolygon(polygon, null, newHeight, newHier)

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
  })
}

export const polygonMoveHori = (polygonId, brng, dist) => (dispatch, getState) => {
  const polygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const outPolylineId = getState().undoable.present.polygon[polygonId].outPolylineId
  const coordinates = polygon.convertHierarchyToCoordinate()
  pointMap.map((pointId, index) => {
    const pointNewCor = Coordinate.destination(coordinates[index], brng, dist)
    pointNewCor.setCoordinate(null, null, pointNewCor.height + POINT_OFFSET)
    return dispatch(actions.pointMoveHoriNoSideEff(pointId, pointNewCor))
  })
  dispatch(actions.polylineMoveHoriNoSideEff(outPolylineId, brng, dist))

  const newCoordinates = coordinates.map(cor => Coordinate.destination(cor, brng, dist))
  const newHier = Polygon.makeHierarchyFromCoordinates(newCoordinates)
  const newPolygon = Polygon.fromPolygon(polygon, null, null, newHier)

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
  })
}

export const polygonMoveVerti = (polygonId, heightChange) => (dispatch, getState) => {
  const polygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const outPolylineId = getState().undoable.present.polygon[polygonId].outPolylineId
  const coordinates = polygon.convertHierarchyToCoordinate()
  pointMap.map((pointId, index) =>
    dispatch(actions.pointMoveVertiNoSideEff(pointId, heightChange))
  )
  dispatch(actions.polylineMoveVertiNoSideEff(outPolylineId, heightChange))

  const newCoordinates = coordinates.map(cor => {
    cor.setCoordinate(null, null, cor.height + heightChange)
    return cor
  })
  const newHier = Polygon.makeHierarchyFromCoordinates(newCoordinates)
  const newPolygon = Polygon.fromPolygon(polygon, null, polygon.height + heightChange, newHier)

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
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
  const newPolygon = Polygon.fromPolygon(polygon, null, null, newHier)

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
    pointMap: newPointMap,
  })
}

export const polygonDelete = (polygonId) => async (dispatch, getState) => {
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const outPolylineId = getState().undoable.present.polygon[polygonId].outPolylineId
  await Promise.all(Array.from(new Set(pointMap)).map(pointId =>
    dispatch(actions.pointRemoveMapping({pointId, polygonId}))
  ))
  Array.from(new Set(pointMap)).map(pointId =>
    dispatch(actions.pointDeleteNoSideEff(pointId))
  )
  dispatch(actions.polylineDelete(outPolylineId))

  return dispatch({
    type: actionTypes.POLYGON_DELETE,
    polygonId: polygonId
  })
}

export const polygonClone = (originId) => async (dispatch, getState) => {
  const polygon = getState().undoable.present.polygon[originId].entity
  const props = getState().undoable.present.polygon[originId].props
  const pointMap = getState().undoable.present.polygon[originId].pointMap
  const outPolylineId = getState().undoable.present.polygon[originId].outPolylineId

  const newPolygonId = uuid()
  const newPolylineId = uuid()

  const coordinates = polygon.convertHierarchyToCoordinate()
  const newPointMap = pointMap.map((pointId, index) => {
    const newPointId = uuid()
    const pointNewCor = Coordinate.destination(coordinates[index], 135, 3)
    dispatch(actions.addPoint({
      mouseCor: pointNewCor, pointId: newPointId, polygonId: newPolygonId,
      polylineId: newPolylineId, existProps: props
    }))
    return newPointId
  })
  const oldNewPointMap = {}
  pointMap.forEach((pointId, index) => oldNewPointMap[pointId] = newPointMap[index])

  dispatch(actions.polylineClone({
    originId: outPolylineId, newId: newPolylineId, oldNewPointMap,
    newInsidePolygonId: newPolygonId
  }))

  const newCoordinates = coordinates.map(cor => Coordinate.destination(cor, 135, 3))
  const newHier = Polygon.makeHierarchyFromCoordinates(newCoordinates)
  const newPolygon = Polygon.fromPolygon(polygon, newPolygonId, null, newHier)

  dispatch(bindDrawingObj({objType: props.objType, objId: newPolygon.entityId}))
  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
    props: props,
    pointMap: newPointMap,
    outPolylineId: newPolylineId
  })
}
