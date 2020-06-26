import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType, KeyboardEventModifier } from 'cesium';
import * as objTypes from '../../../../store/action/drawing/objTypes'
import * as actions from '../../../../store/action/index'


const LeftUpShiftHandler = (props) => {
  const dispatch = useDispatch()
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)

  const leftUpActions = (event) => {
    switch (drwStat) {
      case objTypes.IDLE:
        if (pickedId) {
          dispatch(actions.releasePickedObj())
        }
        break;

      default:
        break;
    }
  };

  return (
    <ScreenSpaceEvent
      action={(event) => leftUpActions(event)}
      type={ScreenSpaceEventType.LEFT_UP}
      modifier={KeyboardEventModifier.SHIFT}
    />
  );
};

export default LeftUpShiftHandler
