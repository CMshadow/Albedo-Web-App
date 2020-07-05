import * as actionTypes from '../actionTypes'
import Polygon from '../../../infrastructure/polygon/polygon'
import Coordinate from '../../../infrastructure/point/coordinate'
import { bindDrawingObj } from '../modeling/modelingBuildingAction'
import { polylineSetShow, polylineDelete } from './polylineAction'
import { pointMoveHori, pointMoveVerti, pointRemoveMapping, pointDeleteNoSideEff, pointSetHeight } from './pointAction'
import { Color } from 'cesium'

const polygonColor = Color.WHITE.withAlpha(0.2)

export const createPolygon = ({mouseCor, polygonId, pointId, outPolylineId}) =>
(dispatch, getState) => {
  const props = getState().undoable.present.drwStat.props
  const drwProps = getState().undoable.present.drwStat.props
  const modelingObjType = drwProps.objType
  const polygonH = mouseCor.height
  const polygon = new Polygon(
    mouseCor.getCoordinate(true), polygonH, polygonId, null, polygonColor,
    props.theme, props.highlight
  )
  dispatch(bindDrawingObj({objType: modelingObjType, objId: polygonId}))
  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: polygon,
    props: {
      polygonPos: props.polygonPos !== null ? props.polygonPos : false,
      polygonHeight: props.polygonHeight !== null ? props.polygonHeight : false,
      theme: props.theme || Color.WHITE(0.2),
      highlight: props.highlight || Color.ORANGE(0.2)
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
  const polygon = getState().undoable.present.polygon[polygonId].entity
  polygon.setColor(polygon.theme)

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: polygon,
  })
}

export const polygonSetShow = (polygonId, show) => (dispatch, getState) => {
  const polygon = getState().undoable.present.polygon[polygonId].entity
  const outPolylineId = getState().undoable.present.polygon[polygonId].outPolylineId
  const newPolygon = Polygon.fromPolygon(polygon)
  newPolygon.show = show
  dispatch(polylineSetShow(outPolylineId, show))

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: newPolygon,
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
    pointMap: pointMap,
  })
}

export const polygonAddVertex = ({polygonId, mouseCor, pointId, position=null}) => (dispatch, getState) => {
  const drawingPolygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const newPointMap = [...pointMap]
  const newHier = [...drawingPolygon.hierarchy]
  newPointMap.splice(position || newPointMap.length, 0, pointId)
  newHier.splice(
    position ? position * 3 : newHier.length, 0, ...mouseCor.getCoordinate(true)
  )

  return dispatch({
    type: actionTypes.POLYGON_SET,
    entity: new Polygon(
      newHier, mouseCor.height, drawingPolygon.entityId, null, polygonColor
    ),
    pointMap: newPointMap,
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
    pointMap: pointMap,
  })
}

export const polygonTerminate = (polygonId) => (dispatch, getState) => {
  const drawingPolygon = getState().undoable.present.polygon[polygonId].entity
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
  })
}

export const polygonSetHeight = (polygonId, newHeight) => (dispatch, getState) => {
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  Array.from(new Set(pointMap)).map(pointId => dispatch(pointSetHeight(pointId, newHeight)))
}

export const polygonMoveHori = (polygonId, brng, dist) => (dispatch, getState) => {
  const polygon = getState().undoable.present.polygon[polygonId].entity
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const coordinates = polygon.convertHierarchyToCoordinate()
  pointMap.map((pointId, index) => {
    const pointNewCor = Coordinate.destination(coordinates[index], brng, dist)
    return dispatch(pointMoveHori(pointId, pointNewCor))
  })
}

export const polygonMoveVerti = (polygonId, heightChange) => (dispatch, getState) => {
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap

  pointMap.map((pointId, index) =>
    dispatch(pointMoveVerti(pointId, heightChange))
  )
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
    pointMap: newPointMap,
  })
}

export const polygonDelete = (polygonId) => async (dispatch, getState) => {
  const pointMap = getState().undoable.present.polygon[polygonId].pointMap
  const outPolylineId = getState().undoable.present.polygon[polygonId].outPolylineId
  await Promise.all(Array.from(new Set(pointMap)).map(pointId =>
    dispatch(pointRemoveMapping({pointId, polygonId}))
  ))
  Array.from(new Set(pointMap)).map(pointId =>
    dispatch(pointDeleteNoSideEff(pointId))
  )
  dispatch(polylineDelete(outPolylineId))

  return dispatch({
    type: actionTypes.POLYGON_DELETE,
    polygonId: polygonId
  })
}
