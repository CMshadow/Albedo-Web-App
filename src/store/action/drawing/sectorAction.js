import * as actionTypes from '../actionTypes'
import Sector from '../../../infrastructure/line/sector'
import Coordinate from '../../../infrastructure/point/coordinate'
import { pointMoveHoriNoSideEff, pointRemoveMapping, pointDeleteNoSideEff } from './pointAction'
import { Color } from 'cesium'

export const addSector = ({
  mouseCor, brng, radius, angle, sectorId, centerPointId, edgePointId, anglePointId, brngPointId
}) =>
(dispatch, getState) => {
  const props = getState().undoable.present.drwStat.props
  const cor = new Coordinate(mouseCor.lon, mouseCor.lat, props.sectorHt)
  const sector = new Sector(
    cor, brng, radius, angle, sectorId, props.sectorTheme, props.sectorTheme,
    props.sectorHighlight
  )
  return dispatch({
    type: actionTypes.SECTOR_SET,
    entity: sector,
    props: {
      ...props,
      sectorDelete: props.sectorDelete !== null ? props.sectorDelete : true,
      theme: props.sectorTheme || Color.DARKCYAN,
      highlight: props.sectorHighlight || Color.ORANGE
    },
    centerPointId: centerPointId,
    edgePointId: edgePointId,
    anglePointId: anglePointId,
    brngPointId: brngPointId
  })
}

export const sectorHighlight = (sectorId) => (dispatch, getState) => {
  const sector = getState().undoable.present.sector[sectorId].entity
  sector.setColor(sector.highlight)

  return dispatch({
    type: actionTypes.SECTOR_SET,
    entity: sector,
  })
}

export const sectorDeHighlight = (sectorId) => (dispatch, getState) => {
  const sector = getState().undoable.present.sector[sectorId].entity
  sector.setColor(sector.theme)
  return dispatch({
    type: actionTypes.SECTOR_SET,
    entity: sector,
  })
}

export const sectorSetShow = (sectorId, show) => (dispatch, getState) => {
  const sector = getState().undoable.present.sector[sectorId].entity
  sector.setShow(show)

  return dispatch({
    type: actionTypes.SECTOR_SET,
    entity: sector,
  })
}

export const sectorUpdate = ({sectorId, pointId, mouseCor}) => (dispatch, getState) => {
  const drawingSector = getState().undoable.present.sector[sectorId].entity
  const props = getState().undoable.present.sector[sectorId].props
  const centerPointId = getState().undoable.present.sector[sectorId].centerPointId
  const edgePointId = getState().undoable.present.sector[sectorId].edgePointId
  const anglePointId = getState().undoable.present.sector[sectorId].anglePointId
  const brngPointId = getState().undoable.present.sector[sectorId].brngPointId
  const cor = new Coordinate(mouseCor.lon, mouseCor.lat, props.sectorHt)

  if (pointId === centerPointId) {
    const newSector = new Sector(
      cor, drawingSector.brng, drawingSector.radius, drawingSector.angle,
      drawingSector.entityId, props.theme, props.theme, props.highlgiht
    )
    const newEdgeCor = Coordinate.destination(
      cor, drawingSector.brng, drawingSector.radius
    )
    dispatch(pointMoveHoriNoSideEff(edgePointId, newEdgeCor))
    const newAngleCor = newSector.points[1]
    dispatch(pointMoveHoriNoSideEff(anglePointId, newAngleCor))
    const newBrngCor = newSector.points.slice(-2)[0]
    dispatch(pointMoveHoriNoSideEff(brngPointId, newBrngCor))

    return dispatch({
      type: actionTypes.SECTOR_SET,
      entity: newSector,
    })
  } else if (pointId === edgePointId) {
    const newRadius = Coordinate.surfaceDistance(drawingSector.originCor, mouseCor)
    const newSector = new Sector(
      drawingSector.originCor, drawingSector.brng, newRadius, drawingSector.angle,
      drawingSector.entityId, props.theme, props.theme, props.highlight
    )
    const newEdgeCor = Coordinate.destination(
      drawingSector.originCor, drawingSector.brng, newRadius
    )
    dispatch(pointMoveHoriNoSideEff(edgePointId, newEdgeCor))
    const newAngleCor = newSector.points[1]
    dispatch(pointMoveHoriNoSideEff(anglePointId, newAngleCor))
    const newBrngCor = newSector.points.slice(-2)[0]
    dispatch(pointMoveHoriNoSideEff(brngPointId, newBrngCor))

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
    dispatch(pointMoveHoriNoSideEff(edgePointId, newEdgeCor))
    const newAngleCor = newSector.points[1]
    dispatch(pointMoveHoriNoSideEff(anglePointId, newAngleCor))
    const newBrngCor = newSector.points.slice(-2)[0]
    dispatch(pointMoveHoriNoSideEff(brngPointId, newBrngCor))

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
    dispatch(pointMoveHoriNoSideEff(edgePointId, newEdgeCor))
    const newAngleCor = newSector.points[1]
    dispatch(pointMoveHoriNoSideEff(anglePointId, newAngleCor))
    const newBrngCor = newSector.points.slice(-2)[0]
    dispatch(pointMoveHoriNoSideEff(brngPointId, newBrngCor))

    return dispatch({
      type: actionTypes.SECTOR_SET,
      entity: newSector,
    })
  }
}

export const sectorDelete = (sectorId) => async (dispatch, getState) => {
  const centerPointId = getState().undoable.present.sector[sectorId].centerPointId
  const edgePointId = getState().undoable.present.sector[sectorId].edgePointId
  const anglePointId = getState().undoable.present.sector[sectorId].anglePointId
  const brngPointId = getState().undoable.present.sector[sectorId].brngPointId

  await Promise.all([
    dispatch(pointRemoveMapping({pointId: centerPointId, sectorId})),
    dispatch(pointRemoveMapping({pointId: edgePointId, sectorId})),
    dispatch(pointRemoveMapping({pointId: anglePointId, sectorId})),
    dispatch(pointRemoveMapping({pointId: brngPointId, sectorId})),
  ])
  dispatch(pointDeleteNoSideEff(centerPointId))
  dispatch(pointDeleteNoSideEff(edgePointId))
  dispatch(pointDeleteNoSideEff(anglePointId))
  dispatch(pointDeleteNoSideEff(brngPointId))

  return dispatch({
    type: actionTypes.SECTOR_DELETE,
    sectorId: sectorId
  })
}
