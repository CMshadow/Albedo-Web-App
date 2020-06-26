import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType, defined } from 'cesium';
import Coordinate from '../../../../infrastructure/point/coordinate'
import * as objTypes from '../../../../store/action/drawing/objTypes'
import * as actions from '../../../../store/action/index';

const POINT_OFFSET = 0.15
const POLYGON_OFFSET = 0.1

const MouseMoveHandler = () => {
  const dispatch = useDispatch()
  const viewer = useSelector(state => state.cesium.viewer)
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)
  const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)
  const pickedType = useSelector(state => state.undoable.present.drawing.pickedType)

  const mouseMoveActions = (event) => {
    const mouseCart3 = viewer.scene.pickPosition(event.endPosition);
    if (!defined(mouseCart3)) return
    const mouseCor = Coordinate.fromCartesian(mouseCart3)

    switch(drwStat) {
      case objTypes.IDLE:
      mouseCor.setCoordinate(null, null, POINT_OFFSET)
        if (pickedId && pickedType === objTypes.POINT) {
          dispatch(actions.moveHoriPoint(pickedId, mouseCor))
        }
        break;

      case objTypes.POLYGON:
        mouseCor.setCoordinate(null, null, POLYGON_OFFSET)
        if (drawingId) {
          dispatch(actions.polygonDynamic(mouseCor))
        }
        break

      default:
        return;
    }
  };

  return (
    <ScreenSpaceEvent
      action={(event) => mouseMoveActions(event)}
      type={ScreenSpaceEventType.MOUSE_MOVE}
    />
  );
};

export default MouseMoveHandler;
