import * as actionTypes from '../actionTypes'
import Point from '../../../infrastructure/point/point'
import Coordinate from '../../../infrastructure/point/coordinate'
import { polygonUpdateVertex, polygonDeleteVertex } from './polygonAction'
import { polylineUpdateVertex, polylineDeleteVertex } from './polylineAction'
import { circleUpdate } from './circleAction'
import { sectorUpdate } from './sectorAction'
import { notification } from 'antd'

const POLYLINE_OFFSET = -0.0125
const POLYGON_OFFSET = -0.025
const CIRCLE_OFFSET = POLYLINE_OFFSET
const SECTOR_OFFSET = POLYLINE_OFFSET

export const addPoint = ({mouseCor, pointId, polygonId, polylineId, circleId, sectorId, props=null}) =>
(dispatch, getState) => {
  const props = props || getState().undoable.present.drwStat.props
  const cor = new Coordinate(mouseCor.lon, mouseCor.lat, props.pointHt)
  const point = Point.fromCoordinate(cor, pointId)
  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
    props: {
      pointHeight: props.pointHeight !== null ? props.pointHeight : false,
      pointDelete: props.pointDelete !== null ? props.pointDelete : false
    },
    polygonMap: polygonId ? [polygonId] : [],
    polylineMap: polylineId ? [polylineId] : [],
    circleMap: circleId ? [circleId] : [],
    sectorMap: sectorId ? [sectorId] : []
  })
}

export const pointHighlight = (pointId) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  point.setColor(point.highlight)

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
  })
}

export const pointDeHighlight = (pointId) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  point.setColor(point.theme)

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
  })
}

export const pointAddMapping = ({pointId, polygonId, polylineId, circleId, sectorId}) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const circleMap = getState().undoable.present.point[pointId].circleMap
  const sectorMap = getState().undoable.present.point[pointId].sectorMap

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
    polygonMap: polygonId ? Array.from(new Set([...polygonMap, polygonId])) : polygonMap,
    polylineMap: polylineId ? Array.from(new Set([...polylineMap, polylineId])) : polylineMap,
    circleMap: circleId || circleMap,
    sectorMap: sectorId || sectorMap
  })
}

export const pointRemoveMapping = ({pointId, polygonId, polylineId, circleId, sectorId}) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const circleMap = getState().undoable.present.point[pointId].circleMap
  const sectorMap = getState().undoable.present.point[pointId].sectorMap

  if (polygonId) {
    const index = polygonMap.indexOf(polygonId)
    polygonMap.splice(index, 1)
  }
  if (polylineId) {
    const index = polylineMap.indexOf(polylineId)
    polylineMap.splice(index, 1)
  }

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
    polygonMap: polygonMap,
    polylineMap: polylineMap,
    circleMap: circleMap,
    sectorMap: sectorMap
  })
}

export const pointSetHeight = (pointId, newHeight) => (dispatch, getState) => {
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

export const pointSetHeightNoSideEff = (pointId, newHeight) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity

  point.setCoordinate(null, null, newHeight > 0.1 ? newHeight : 0.1)

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
  })
}

export const pointMoveHori = (pointId, mouseCor) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const circleMap = getState().undoable.present.point[pointId].circleMap
  const sectorMap = getState().undoable.present.point[pointId].sectorMap
  point.setCoordinate(mouseCor.lon, mouseCor.lat, point.height)
  mouseCor.setCoordinate(null, null, point.height)
  polygonMap.map(polygonId => {
    mouseCor.setCoordinate(null, null, point.height + POLYGON_OFFSET)
    return dispatch(polygonUpdateVertex({polygonId, mouseCor, pointId}))
  })
  polylineMap.map(polylineId => {
    mouseCor.setCoordinate(null, null, point.height + POLYLINE_OFFSET)
    return dispatch(polylineUpdateVertex({polylineId, mouseCor, pointId}))
  })
  circleMap.map(circleId => {
    mouseCor.setCoordinate(null, null, point.height + CIRCLE_OFFSET)
    return dispatch(circleUpdate({circleId, mouseCor, pointId}))
  })
  sectorMap.map(sectorId => {
    mouseCor.setCoordinate(null, null, point.height + SECTOR_OFFSET)
    return dispatch(sectorUpdate({sectorId, mouseCor, pointId}))
  })

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
  })
}

export const pointMoveHoriNoSideEff = (pointId, mouseCor) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  point.setCoordinate(mouseCor.lon, mouseCor.lat, point.height)

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
  })
}

export const pointMoveVerti = (pointId, heightChange) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const newHeight = point.height + heightChange
  point.setCoordinate(null, null, newHeight)

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

export const pointMoveVertiNoSideEff = (pointId, heightChange) => (dispatch, getState) => {
  const point = getState().undoable.present.point[pointId].entity

  const newHeight = point.height + heightChange
  point.setCoordinate(null, null, newHeight)

  return dispatch({
    type: actionTypes.POINT_SET,
    entity: point,
  })
}


export const pointDelete = (pointId) => (dispatch, getState) => {
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const circleMap = getState().undoable.present.point[pointId].circleMap
  const sectorMap = getState().undoable.present.point[pointId].sectorMap
  const polygonOK = polygonMap.every(polygonId =>
    getState().undoable.present.polygon[polygonId].entity.hierarchy.length / 3 > 3
  )
  const polylineOK = polylineMap.every(polylineId =>
    getState().undoable.present.polyline[polylineId].entity.length > 2
  )
  const circleOK = circleMap.length === 0
  const sectorOK = sectorMap.length === 0
  if (polylineOK && polygonOK && circleOK && sectorOK) {
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

export const pointDeleteNoSideEff = (pointId) => (dispatch, getState) => {
  const polygonMap = getState().undoable.present.point[pointId].polygonMap
  const polylineMap = getState().undoable.present.point[pointId].polylineMap
  const circleMap = getState().undoable.present.point[pointId].circleMap
  const sectorMap = getState().undoable.present.point[pointId].sectorMap

  if(
    polygonMap.length === 0 && polylineMap.length === 0 &&
    circleMap.length === 0 && sectorMap.length === 0
  ) {
    return dispatch({
      type: actionTypes.POINT_DELETE,
      pointId: pointId
    })
  }
}
