import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType, defined } from 'cesium'
import { v4 as uuid } from 'uuid';
import Coordinate from '../../../../infrastructure/point/coordinate'
import * as actions from '../../../../store/action/index'
import * as objTypes from '../../../../store/action/drawing/objTypes'

const POINT_OFFSET = 0.15
const POLYLINE_OFFSET = 0.125
const POLYGON_OFFSET = 0.1
const CIRCLE_OFFSET = POLYLINE_OFFSET
const SECTOR_OFFSET = POLYLINE_OFFSET

const LeftClickHandler = () => {
  const dispatch = useDispatch()
  const viewer = useSelector(state => state.cesium.viewer)
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)
  const hoverId = useSelector(state => state.undoable.present.drawing.hoverId)
  const hoverType = useSelector(state => state.undoable.present.drawing.hoverType)

  const allPoint = useSelector(state => state.undoable.present.point)
  const allPolygon = useSelector(state => state.undoable.present.polygon)

  const addPoint = (mouseCor) => {
    const pointId = uuid()
    mouseCor.setCoordinate(null, null, POINT_OFFSET)
    dispatch(actions.addPoint({mouseCor, pointId}))
    dispatch(actions.setDrwStatIdle())
  }

  const drawLine = (mouseCor) => {
    const polylineId = drawingId || uuid()
    let pointId
    let cor
    if (hoverId && hoverType === objTypes.POINT) {
      pointId = hoverId
      dispatch(actions.pointAddMapping({pointId, polylineId}))
      cor = allPoint[hoverId].entity
    } else {
      pointId = uuid()
      mouseCor.setCoordinate(null, null, POINT_OFFSET)
      dispatch(actions.addPoint({mouseCor, pointId, polylineId}))
      cor = new Coordinate(mouseCor.lon, mouseCor.lat, mouseCor.height)
    }
    if (!drawingId) {
      dispatch(actions.createPolyline({mouseCor: cor, polylineId, pointId}))
      dispatch(actions.setDrawingObj(objTypes.POLYLINE, polylineId))
      dispatch(actions.disableRotate())
    } else {
      dispatch(actions.polylineAddVertex({polylineId: drawingId, mouseCor: cor, pointId}))
      dispatch(actions.releasePickedObj())
      dispatch(actions.polylineTerminate(drawingId))
      dispatch(actions.setDrwStatIdle())
      dispatch(actions.enableRotate())
    }
  }

  const drawPolyline = (mouseCor) => {
    const polylineId = drawingId || uuid()
    let pointId
    let cor
    if (hoverId && hoverType === objTypes.POINT) {
      pointId = hoverId
      dispatch(actions.pointAddMapping({pointId, polylineId}))
      cor = new Coordinate(
        allPoint[hoverId].entity.lon, allPoint[hoverId].entity.lat,
        allPoint[hoverId].entity.height
      )
      cor.setCoordinate(null, null, cor.height - 0.025)
    } else {
      pointId = uuid()
      mouseCor.setCoordinate(null, null, POINT_OFFSET)
      dispatch(actions.addPoint({mouseCor, pointId, polylineId}))
      cor = new Coordinate(mouseCor.lon, mouseCor.lat, mouseCor.height)
      cor.setCoordinate(null, null, cor.height - 0.025)
    }
    if (!drawingId) {
      dispatch(actions.createPolyline({mouseCor: cor, polylineId, pointId}))
      dispatch(actions.setDrawingObj(objTypes.POLYLINE, polylineId))
      dispatch(actions.disableRotate())
    } else {
      dispatch(actions.polylineAddVertex({polylineId: drawingId, mouseCor: cor, pointId}))
    }
  }

  const drawPolygon = (mouseCor) => {
    const pointId = uuid()
    const polygonId = drawingId || uuid()
    const polylineId = drawingId ? allPolygon[polygonId].outPolylineId : uuid()

    mouseCor.setCoordinate(null, null, POINT_OFFSET)
    dispatch(actions.addPoint({mouseCor, pointId, polylineId, polygonId}))
    mouseCor.setCoordinate(null, null, POLYGON_OFFSET)
    if (!drawingId) {
      dispatch(actions.setDrawingObj(objTypes.POLYGON, polygonId))
      dispatch(actions.createPolygon({
        mouseCor, polygonId, pointId, outPolylineId: polylineId
      }))
      mouseCor.setCoordinate(null, null, POLYLINE_OFFSET)
      dispatch(actions.createPolyline({mouseCor, polylineId, pointId, insidePolygonId: polygonId}))
      dispatch(actions.disableRotate())
    } else {
      dispatch(actions.polygonAddVertex({polygonId: drawingId, mouseCor, pointId}))
      mouseCor.setCoordinate(null, null, POLYLINE_OFFSET)
      dispatch(actions.polylineAddVertex({polylineId, mouseCor, pointId}))
    }
  }

  const drawCircle = (mouseCor) => {
    const centerPointId = uuid()
    const edgePointId = uuid()
    const circleId = uuid()
    const radius = 10
    mouseCor.setCoordinate(null, null, POINT_OFFSET)
    dispatch(actions.addPoint({mouseCor, pointId: centerPointId, circleId}))
    const edgeCor = Coordinate.destination(mouseCor, 0, radius)
    dispatch(actions.addPoint({mouseCor: edgeCor, pointId: edgePointId, circleId}))
    mouseCor.setCoordinate(null, null, CIRCLE_OFFSET)
    dispatch(actions.addCircle({mouseCor, radius, circleId, centerPointId, edgePointId}))
    dispatch(actions.setDrwStatIdle())
  }

  const drawSector = (mouseCor) => {
    const centerPointId = uuid()
    const edgePointId = uuid()
    const anglePointId = uuid()
    const brngPointId = uuid()
    const sectorId = uuid()
    const radius = 10
    const brng = 0
    const angle = 60
    mouseCor.setCoordinate(null, null, POINT_OFFSET)
    dispatch(actions.addPoint({mouseCor, pointId: centerPointId, sectorId}))
    const edgeCor = Coordinate.destination(mouseCor, brng, radius)
    dispatch(actions.addPoint({mouseCor: edgeCor, pointId: edgePointId, sectorId}))
    const angleCor = Coordinate.destination(mouseCor, brng - (angle / 2), radius)
    dispatch(actions.addPoint({mouseCor: angleCor, pointId: anglePointId, sectorId}))
    const brngCor = Coordinate.destination(mouseCor, brng + (angle / 2), radius)
    dispatch(actions.addPoint({mouseCor: brngCor, pointId: brngPointId, sectorId}))
    mouseCor.setCoordinate(null, null, SECTOR_OFFSET)
    dispatch(actions.addSector({
      mouseCor, brng, radius, angle, sectorId, centerPointId, edgePointId, anglePointId, brngPointId
    }))
    dispatch(actions.setDrwStatIdle())
  }


  const leftClickActions = (event) => {
    const mouseCart3 = viewer.scene.pickPosition(event.position);
    if (!defined(mouseCart3)) return
    const mouseCor = Coordinate.fromCartesian(mouseCart3)
    // const mousePos = new Cartesian3(event.position.x, event.position.y)
    // const ellipsoid = viewer.scene.globe.ellipsoid;
    // const cartesian3 = viewer.camera.pickEllipsoid(mousePos, ellipsoid)

    switch (drwStat) {
      case objTypes.POINT:
        addPoint(mouseCor)
        break;

      case objTypes.LINE:
        drawLine(mouseCor)
        break

      case objTypes.POLYLINE:
        drawPolyline(mouseCor)
        break

      case objTypes.POLYGON:
        drawPolygon(mouseCor)
        break

      case objTypes.CIRCLE:
        drawCircle(mouseCor)
        break

      case objTypes.SECTOR:
        drawSector(mouseCor)
        break

      default:
        break;
    }
  };

  return (
    <ScreenSpaceEvent
      action={event => leftClickActions(event)}
      type={ScreenSpaceEventType.LEFT_CLICK}
    />
  );
};


export default LeftClickHandler;
