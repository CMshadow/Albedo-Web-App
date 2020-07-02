import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType, defined, KeyboardEventModifier } from 'cesium';
import Coordinate from '../../../../infrastructure/point/coordinate'
import * as objTypes from '../../../../store/action/drawing/objTypes'
import * as actions from '../../../../store/action/index';
import { Math as CesiumMath } from 'cesium';
import { angleBetweenBrngs, mapBrng } from '../../../../infrastructure/math/math'

const MouseMoveShiftHandler = () => {
  const dispatch = useDispatch()
  const viewer = useSelector(state => state.cesium.viewer)
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)
  const pickedType = useSelector(state => state.undoable.present.drawing.pickedType)
  const drwProps = useSelector(state => state.undoable.present.drwStat.props)

  const mouseMoveActions = (event) => {
    const mouseEndCart3 = viewer.scene.pickPosition(event.endPosition)
    const mouseStartCart3 = viewer.scene.pickPosition(event.startPosition)
    if (!defined(mouseEndCart3) || !defined(mouseStartCart3)) return
    const mouseEndCor = Coordinate.fromCartesian(mouseEndCart3)
    const mouseStartCor = Coordinate.fromCartesian(mouseStartCart3)

    switch(drwStat) {
      case objTypes.IDLE:
        if (pickedId && pickedType === objTypes.POINT && drwProps.pointHeight) {
          const deltaY = event.startPosition.y - event.endPosition.y;
          const heightChange = deltaY > 0 ?
            Math.min(0.5, deltaY) :
            Math.max(-0.5, deltaY)
          dispatch(actions.moveVertiPoint(pickedId, heightChange))
        }
        else if (pickedId && pickedType === objTypes.POLYGON && drwProps.polygonHeight) {
          const deltaY = event.startPosition.y - event.endPosition.y;
          const heightChange = deltaY > 0 ?
            Math.min(0.5, deltaY) :
            Math.max(-0.5, deltaY)
          dispatch(actions.polygonMoveVerti(pickedId, heightChange))
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
