import * as actionTypes from '../actionTypes'
import Circle from '../../../infrastructure/line/circle'
import Coordinate from '../../../infrastructure/point/coordinate'
import { pointMoveHoriNoSideEff, pointRemoveMapping, pointDeleteNoSideEff } from './pointAction'
import { Color } from 'cesium'

const circleColor = Color.SEAGREEN

export const addCircle = ({mouseCor, radius, circleId, centerPointId, edgePointId}) =>
(dispatch, getState) => {
  const circle = new Circle(mouseCor, radius, circleId, circleColor)
  return dispatch({
    type: actionTypes.CIRCLE_SET,
    entity: circle,
    centerPointId: centerPointId,
    edgePointId: edgePointId
  })
}

export const circleUpdate = ({circleId, pointId, mouseCor}) => (dispatch, getState) => {
  const drawingCircle = getState().undoable.present.circle[circleId].entity
  const centerPointId = getState().undoable.present.circle[circleId].centerPointId
  const edgePointId = getState().undoable.present.circle[circleId].edgePointId

  if (pointId === centerPointId) {
    const newCircle = new Circle(
      mouseCor, drawingCircle.radius, drawingCircle.entityId, circleColor
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
      drawingCircle.centerPoint, newRadius, drawingCircle.entityId, circleColor
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
