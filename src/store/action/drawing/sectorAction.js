import * as actionTypes from '../actionTypes'
import Sector from '../../../infrastructure/line/sector'
import Coordinate from '../../../infrastructure/point/coordinate'
import { moveHoriPointNoSideEff } from './pointAction'
import { Color } from 'cesium'
import { angleBetweenBrngs } from '../../../infrastructure/math/math'

const sectorColor = Color.DARKCYAN

export const addSector = ({
  mouseCor, brng, radius, angle, sectorId, centerPointId, edgePointId, anglePointId, brngPointId
}) =>
(dispatch, getState) => {
  const sector = new Sector(mouseCor, brng, radius, angle, sectorId, sectorColor)
  return dispatch({
    type: actionTypes.SECTOR_SET,
    entity: sector,
    centerPointId: centerPointId,
    edgePointId: edgePointId,
    anglePointId: anglePointId,
    brngPointId: brngPointId
  })
}

export const sectorUpdate = ({sectorId, pointId, mouseCor}) => (dispatch, getState) => {
  const drawingSector = getState().undoable.present.sector[sectorId].entity
  const centerPointId = getState().undoable.present.sector[sectorId].centerPointId
  const edgePointId = getState().undoable.present.sector[sectorId].edgePointId
  const anglePointId = getState().undoable.present.sector[sectorId].anglePointId
  const brngPointId = getState().undoable.present.sector[sectorId].brngPointId

  if (pointId === centerPointId) {
    const newSector = new Sector(
      mouseCor, drawingSector.brng, drawingSector.radius, drawingSector.angle,
      drawingSector.entityId, sectorColor
    )
    const newEdgeCor = Coordinate.destination(
      mouseCor, drawingSector.brng, drawingSector.radius
    )
    dispatch(moveHoriPointNoSideEff(edgePointId, newEdgeCor))
    const newAngleCor = newSector.points[1]
    dispatch(moveHoriPointNoSideEff(anglePointId, newAngleCor))
    const newBrngCor = newSector.points.slice(-2)[0]
    dispatch(moveHoriPointNoSideEff(brngPointId, newBrngCor))

    return dispatch({
      type: actionTypes.SECTOR_SET,
      entity: newSector,
    })
  } else if (pointId === edgePointId) {
    const newRadius = Coordinate.surfaceDistance(drawingSector.originCor, mouseCor)
    const newSector = new Sector(
      drawingSector.originCor, drawingSector.brng, newRadius,
      drawingSector.angle, drawingSector.entityId, sectorColor
    )
    const newEdgeCor = Coordinate.destination(
      drawingSector.originCor, drawingSector.brng, newRadius
    )
    dispatch(moveHoriPointNoSideEff(edgePointId, newEdgeCor))
    const newAngleCor = newSector.points[1]
    dispatch(moveHoriPointNoSideEff(anglePointId, newAngleCor))
    const newBrngCor = newSector.points.slice(-2)[0]
    dispatch(moveHoriPointNoSideEff(brngPointId, newBrngCor))

    return dispatch({
      type: actionTypes.SECTOR_SET,
      entity: newSector,
    })
  } else if (pointId === anglePointId) {
    const mouseBrng = Coordinate.bearing(drawingSector.originCor, mouseCor)
    const newSector = Sector.fromSector(drawingSector)
    newSector.updateAngle(mouseBrng)

    const newEdgeCor = Coordinate.destination(
      newSector.originCor, newSector.brng, newSector.radius
    )
    dispatch(moveHoriPointNoSideEff(edgePointId, newEdgeCor))
    const newAngleCor = newSector.points[1]
    dispatch(moveHoriPointNoSideEff(anglePointId, newAngleCor))
    const newBrngCor = newSector.points.slice(-2)[0]
    dispatch(moveHoriPointNoSideEff(brngPointId, newBrngCor))

    return dispatch({
      type: actionTypes.SECTOR_SET,
      entity: newSector,
    })
  } else {
    const mouseBrng = Coordinate.bearing(drawingSector.originCor, mouseCor)
    const newSector = Sector.fromSector(drawingSector)
    newSector.updateBearing(mouseBrng)

    const newEdgeCor = Coordinate.destination(
      newSector.originCor, newSector.brng, newSector.radius
    )
    dispatch(moveHoriPointNoSideEff(edgePointId, newEdgeCor))
    const newAngleCor = newSector.points[1]
    dispatch(moveHoriPointNoSideEff(anglePointId, newAngleCor))
    const newBrngCor = newSector.points.slice(-2)[0]
    dispatch(moveHoriPointNoSideEff(brngPointId, newBrngCor))

    return dispatch({
      type: actionTypes.SECTOR_SET,
      entity: newSector,
    })
  }
}
