import * as actionTypes from '../actionTypes'
import Circle from '../../../infrastructure/line/circle'
import Coordinate from '../../../infrastructure/point/coordinate'
import { pointMoveHoriNoSideEff, pointRemoveMapping, pointDeleteNoSideEff } from './pointAction'
import { Color } from 'cesium'

export const addCircle = ({mouseCor, radius, circleId, centerPointId, edgePointId}) =>
(dispatch, getState) => {
  const props = getState().undoable.present.drwStat.props
  const cor = new Coordinate(mouseCor.lon, mouseCor.lat, props.circleHt)
  const circle = new Circle(
    cor, radius, circleId, props.circleTheme, props.circleTheme, props.highlight
  )
  return dispatch({
    type: actionTypes.CIRCLE_SET,
    entity: circle,
    props: {
      ...props,
      circleDelete: props.circleDelete !== null ? props.circleDelete : true,
      theme: props.circleTheme || Color.SEAGREEN,
      highlight: props.circleHighlight || Color.ORANGE
    },
    centerPointId: centerPointId,
    edgePointId: edgePointId
  })
}

export const circleHighlight = (circleId) => (dispatch, getState) => {
  const circle = getState().undoable.present.circle[circleId].entity
  circle.setColor(circle.highlight)

  return dispatch({
    type: actionTypes.CIRCLE_SET,
    entity: circle,
  })
}

export const circleDeHighlight = (circleId) => (dispatch, getState) => {
  const obj = getState().undoable.present.circle[circleId]
  if (obj) {
    const circle = obj.entity
    circle.setColor(circle.theme)
    return dispatch({
      type: actionTypes.CIRCLE_SET,
      entity: circle,
    })
  }
}

export const circleSetShow = (circleId, show) => (dispatch, getState) => {
  const circle = getState().undoable.present.circle[circleId].entity
  circle.setShow(show)

  return dispatch({
    type: actionTypes.CIRCLE_SET,
    entity: circle,
  })
}

export const circleUpdate = ({circleId, pointId, mouseCor}) => (dispatch, getState) => {
  const drawingCircle = getState().undoable.present.circle[circleId].entity
  const props = getState().undoable.present.circle[circleId].props
  const centerPointId = getState().undoable.present.circle[circleId].centerPointId
  const edgePointId = getState().undoable.present.circle[circleId].edgePointId
  const cor = new Coordinate(mouseCor.lon, mouseCor.lat, props.circleHt)

  if (pointId === centerPointId) {
    const newCircle = new Circle(
      cor, drawingCircle.radius, drawingCircle.entityId, props.theme, props.theme, props.highlight
    )
    const newEdgeCor = Coordinate.destination(mouseCor, 0, drawingCircle.radius)
    dispatch(pointMoveHoriNoSideEff(edgePointId, newEdgeCor))
    return dispatch({
      type: actionTypes.CIRCLE_SET,
      entity: newCircle,
    })
  } else {
    const newRadius = Coordinate.surfaceDistance(drawingCircle.centerPoint, mouseCor)
    const newCircle = new Circle(
      drawingCircle.centerPoint, newRadius, drawingCircle.entityId, props.theme, props.theme, props.highlight
    )
    const newEdgeCor = Coordinate.destination(
      drawingCircle.centerPoint, 0, drawingCircle.radius
    )
    dispatch(pointMoveHoriNoSideEff(edgePointId, newEdgeCor))
    return dispatch({
      type: actionTypes.CIRCLE_SET,
      entity: newCircle,
    })
  }
}

export const circleDelete = (circleId) => async (dispatch, getState) => {
  const centerPointId = getState().undoable.present.circle[circleId].centerPointId
  const edgePointId = getState().undoable.present.circle[circleId].edgePointId
  await Promise.all([
    dispatch(pointRemoveMapping({pointId: centerPointId, circleId})),
    dispatch(pointRemoveMapping({pointId: edgePointId, circleId})),
  ])
  dispatch(pointDeleteNoSideEff(centerPointId))
  dispatch(pointDeleteNoSideEff(edgePointId))

  return dispatch({
    type: actionTypes.CIRCLE_DELETE,
    circleId: circleId
  })
}
