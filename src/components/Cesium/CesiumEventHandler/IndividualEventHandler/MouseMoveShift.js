import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType, defined, KeyboardEventModifier } from 'cesium';
import Coordinate from '../../../../infrastructure/point/coordinate'
import * as drawingTypes from '../../../../store/action/drawing/drawingTypes'
import * as actions from '../../../../store/action/index';
import * as pickedObjTypes from '../../../../store/action/drawing/pickedObjTypes'

const MouseMoveShiftHandler = () => {
  const dispatch = useDispatch()
  const viewer = useSelector(state => state.cesium.viewer)
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const pickedId = useSelector(state => state.undoable.present.picked.pickedId)
  const pickedType = useSelector(state => state.undoable.present.picked.pickedType)

  const mouseMoveActions = (event) => {
    const mouseCart3 = viewer.scene.pickPosition(event.endPosition);
    if (!defined(mouseCart3)) return
    const mouseCor = Coordinate.fromCartesian(mouseCart3)

    switch(drwStat) {
      case drawingTypes.IDLE:
        if (pickedId && pickedType === pickedObjTypes.POINT) {
          dispatch(actions.moveVertiPoint(pickedId, mouseCor))
        }
        break;

      default:
        return;
    }
  };

  return (
    <ScreenSpaceEvent
      action={(event) => mouseMoveActions(event)}
      type={ScreenSpaceEventType.MOUSE_MOVE}
      modifier={KeyboardEventModifier.SHIFT}
    />
  );
};

export default MouseMoveShiftHandler;
