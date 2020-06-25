import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType, defined } from 'cesium'
import Coordinate from '../../../../infrastructure/point/coordinate'
import * as actions from '../../../../store/action/index'
import * as drawingTypes from '../../../../store/action/drawing/drawingTypes'

const POINT_OFFSET = 0.1

const LeftClickHandler = () => {
  const dispatch = useDispatch()
  const viewer = useSelector(state => state.cesium.viewer)
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)

  const leftClickActions = (event) => {
    const PickedObjectsArray = viewer.scene.drillPick(event.position);
    const mouseCart3 = viewer.scene.pickPosition(event.position);
    if (!defined(mouseCart3)) return
    const mouseCor = Coordinate.fromCartesian(mouseCart3)
    // const mousePos = new Cartesian3(event.position.x, event.position.y)
    // const ellipsoid = viewer.scene.globe.ellipsoid;
    // const cartesian3 = viewer.camera.pickEllipsoid(mousePos, ellipsoid)
    const pickedObjectIdArray = PickedObjectsArray.map(elem => elem.id.id);

    switch (drwStat) {
      case drawingTypes.POINT:
        mouseCor.setCoordinate(null, null, POINT_OFFSET)
        console.log(mouseCor)
        dispatch(actions.addPoint(mouseCor))
        dispatch(actions.setDrwStatIdle())
        break;

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
