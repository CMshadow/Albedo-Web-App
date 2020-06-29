import * as actionTypes from '../actionTypes'
import Circle from '../../../infrastructure/line/circle'
import Coordinate from '../../../infrastructure/point/coordinate'
import { moveHoriPoint } from './pointAction'
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
  console.log(getState().undoable.present.circle[circleId])
  console.log(pointId)
  const drawingCircle = getState().undoable.present.circle[circleId].entity
  const centerPointId = getState().undoable.present.circle[circleId].centerPointId
  const edgePointId = getState().undoable.present.circle[circleId].edgePointId

  if (pointId === centerPointId) {
    const newCircle = new Circle(
      mouseCor, drawingCircle.radius, drawingCircle.entityId, circleColor
    )
    const newEdgeCor = Coordinate.destination(mouseCor, 0, drawingCircle.radius)
    dispatch(moveHoriPoint({pointId: edgePointId, mouseCor: newEdgeCor}))
    return dispatch({
      type: actionTypes.CIRCLE_SET,
      entity: newCircle,
    })
  }
}
