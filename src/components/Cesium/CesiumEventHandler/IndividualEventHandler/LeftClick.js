import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType, defined } from 'cesium'
import Coordinate from '../../../../infrastructure/point/coordinate'
import * as actions from '../../../../store/action/index'
import * as objTypes from '../../../../store/action/drawing/objTypes'

const POINT_OFFSET = 0.15
const POLYGON_OFFSET = 0.1

const LeftClickHandler = () => {
  const dispatch = useDispatch()
  const viewer = useSelector(state => state.cesium.viewer)
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)

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
        mouseCor.setCoordinate(null, null, POINT_OFFSET)
        dispatch(actions.addPoint(mouseCor))
        dispatch(actions.setDrwStatIdle())
        break;

      case objTypes.POLYGON:
        mouseCor.setCoordinate(null, null, POLYGON_OFFSET)
        if (!drawingId) {
          dispatch(actions.createPolygon(mouseCor))
          dispatch(actions.disableRotate())
        } else {
          dispatch(actions.polygonAddVertex(mouseCor))
        }
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
