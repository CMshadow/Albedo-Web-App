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

const LeftClickHandler = () => {
  const dispatch = useDispatch()
  const viewer = useSelector(state => state.cesium.viewer)
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)

  const allPolygon = useSelector(state => state.undoable.present.polygon)

  const addPoint = (mouseCor) => {
    const pointId = uuid()
    mouseCor.setCoordinate(null, null, POINT_OFFSET)
    dispatch(actions.addPoint({mouseCor, pointId}))
    dispatch(actions.setDrwStatIdle())
  }

  const drawPolyline = (mouseCor) => {
    const pointId = uuid()
    const polylineId = drawingId || uuid()
    mouseCor.setCoordinate(null, null, POINT_OFFSET)
    dispatch(actions.addPoint({mouseCor, pointId, polylineId}))
    mouseCor.setCoordinate(null, null, POLYLINE_OFFSET)
    if (!drawingId) {
      dispatch(actions.createPolyline({mouseCor, polylineId, pointId}))
      dispatch(actions.setDrawingObj(objTypes.POLYLINE, polylineId))
      dispatch(actions.disableRotate())
    } else {
      dispatch(actions.polylineAddVertex({polylineId: drawingId, mouseCor, pointId}))
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

  const leftClickActions = (event) => {
    const PickedObjectsArray = viewer.scene.drillPick(event.position);
    const mouseCart3 = viewer.scene.pickPosition(event.position);
    if (!defined(mouseCart3)) return
    const mouseCor = Coordinate.fromCartesian(mouseCart3)
    // const mousePos = new Cartesian3(event.position.x, event.position.y)
    // const ellipsoid = viewer.scene.globe.ellipsoid;
    // const cartesian3 = viewer.camera.pickEllipsoid(mousePos, ellipsoid)
    const pickedObjectIdArray = PickedObjectsArray.map(elem => elem.id.id)

    switch (drwStat) {
      case objTypes.POINT:
        addPoint(mouseCor)
        break;

      case objTypes.POLYLINE:
        drawPolyline(mouseCor)
        break

      case objTypes.POLYGON:
        drawPolygon(mouseCor)
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
