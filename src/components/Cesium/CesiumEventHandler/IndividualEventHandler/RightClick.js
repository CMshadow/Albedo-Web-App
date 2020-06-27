import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType, defined } from 'cesium'
import Coordinate from '../../../../infrastructure/point/coordinate'
import * as actions from '../../../../store/action/index'
import * as objTypes from '../../../../store/action/drawing/objTypes'


const RightClickHandler = () => {
  const dispatch = useDispatch()
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)
  const viewer = useSelector(state => state.cesium.viewer)

  const rightClickActions = (event) => {

    switch (drwStat) {
      case objTypes.POINT:
        break;

      case objTypes.POLYLINE:
        dispatch(actions.releasePickedObj())
        dispatch(actions.polylineTerminate(drawingId))
        dispatch(actions.setDrwStatIdle())
        dispatch(actions.enableRotate())
        break

      case objTypes.POLYGON:
        dispatch(actions.releasePickedObj())
        dispatch(actions.polygonTerminate(drawingId))
        dispatch(actions.setDrwStatIdle())
        dispatch(actions.enableRotate())
        break

      default:
        const mouseCart3 = viewer.scene.pickPosition(event.position);
        if (!defined(mouseCart3)) return
        const rightClickCor = Coordinate.fromCartesian(mouseCart3)
        dispatch(actions.setRightClickCor(rightClickCor))
        break;
    }
  };

  return (
    <ScreenSpaceEvent
      action={event => rightClickActions(event)}
      type={ScreenSpaceEventType.RIGHT_CLICK}
    />
  );
};


export default RightClickHandler;
