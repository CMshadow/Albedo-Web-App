import * as actionTypes from '../actionTypes'
import Polyline from '../../../infrastructure/line/polyline'
import Coordinate from '../../../infrastructure/point/coordinate'
import { Color } from 'cesium'
import { pointDeleteNoSideEff, pointRemoveMapping } from './pointAction'

export const createPolyline = ({mouseCor, polylineId, pointId, insidePolygonId}) =>
(dispatch, getState) => {
  const props = getState().undoable.present.drwStat.props
  const cor = new Coordinate(mouseCor.lon, mouseCor.lat, props.polylineHt)
  const polyline = new Polyline(
    [cor], polylineId, props.polylineTheme, props.polylineTheme, props.polylineHighlight
  )

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: polyline,
    props: {
      ...props,
      polylineAddVertex: props.polylineAddVertex !== null ? props.polylineAddVertex : true,
      polylineDelete: props.polylineDelete !== null ? props.polylineDelete : true,
      theme: props.polylineTheme || Color.STEELBLUE,
      highlight: props.polylineHighlight || Color.ORANGE
    },
    pointMap: pointId ? [pointId] : [],
    insidePolygonId: insidePolygonId || 'EMPTY'
  })
}

export const polylineHighlight = (polylineId) => (dispatch, getState) => {
  const polyline = getState().undoable.present.polyline[polylineId].entity
  polyline.setColor(polyline.highlight)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: polyline,
  })
}

export const polylineDeHighlight = (polylineId) => (dispatch, getState) => {
  const polyline = getState().undoable.present.polyline[polylineId].entity
  polyline.setColor(polyline.theme)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: polyline,
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
  const newPolyline = Polyline.fromPolyline(drawingPolyline, newPoints)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: newPolyline,
  })
}

export const polylineAddVertex = ({polylineId, mouseCor, pointId, position=null}) =>
(dispatch, getState) => {
  const drawingPolyline = getState().undoable.present.polyline[polylineId].entity
  const props = getState().undoable.present.polyline[polylineId].props
  const pointMap = getState().undoable.present.polyline[polylineId].pointMap
  const newPointMap = [...pointMap]
  const newPoints = [...drawingPolyline.points]
  const cor = new Coordinate(mouseCor.lon, mouseCor.lat, props.polylineHt)
  newPointMap.splice(
    position || newPointMap.length, 0, pointId
  )
  newPoints.splice(
    position || newPointMap.length - 1, 0, cor
  )
  const newPolyline = Polyline.fromPolyline(drawingPolyline, newPoints)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: newPolyline,
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
  const newPolyline = Polyline.fromPolyline(drawingPolyline, newPoints)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: newPolyline,
  })
}

export const polylineMoveHoriNoSideEff = (polylineId, brng, dist) => (dispatch, getState) => {
  const polyline = getState().undoable.present.polyline[polylineId].entity

  const newPoints = polyline.points.map(cor => Coordinate.destination(cor, brng, dist))
  const newPolyline = Polyline.fromPolyline(polyline, newPoints)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: newPolyline,
  })
}

export const polylineSetHeightNoSideEff = (polylineId, newHeight) => (dispatch, getState) => {
  const polyline = getState().undoable.present.polyline[polylineId].entity

  const newPoints = polyline.points.map(cor => {
    cor.setCoordinate(null, null, newHeight)
    return cor
  })
  const newPolyline = Polyline.fromPolyline(polyline, newPoints)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: newPolyline,
  })
}

export const polylineMoveVertiNoSideEff = (polylineId, heightChange) => (dispatch, getState) => {
  const polyline = getState().undoable.present.polyline[polylineId].entity

  const newPoints = polyline.points.map(cor => {
    cor.setCoordinate(null, null, cor.height + heightChange)
    return cor
  })
  const newPolyline = Polyline.fromPolyline(polyline, newPoints)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: newPolyline,
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
  const newPolyline = Polyline.fromPolyline(drawingPolyline, fixedPoints)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: newPolyline,
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
  const newPolyline = Polyline.fromPolyline(polyline, newPoints)

  return dispatch({
    type: actionTypes.POLYLINE_SET,
    entity: newPolyline,
    pointMap: newPointMap
  })
}

export const polylineDelete = (polylineId) => async (dispatch, getState) => {
  const pointMap = getState().undoable.present.polyline[polylineId].pointMap
  await Promise.all(Array.from(new Set(pointMap)).map(pointId =>
    dispatch(pointRemoveMapping({pointId, polylineId}))
  ))
  Array.from(new Set(pointMap)).map(pointId =>
    dispatch(pointDeleteNoSideEff(pointId))
  )

  return dispatch({
    type: actionTypes.POLYLINE_DELETE,
    polylineId: polylineId
  })
}
