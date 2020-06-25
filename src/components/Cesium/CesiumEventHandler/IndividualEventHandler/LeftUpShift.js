import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType, KeyboardEventModifier } from 'cesium';
import * as drawingTypes from '../../../../store/action/drawing/drawingTypes'
import * as actions from '../../../../store/action/index'


const LeftUpShiftHandler = (props) => {
  const dispatch = useDispatch()
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const pickedId = useSelector(state => state.undoable.present.picked.pickedId)

  const leftUpActions = (event) => {
    switch (drwStat) {
      case drawingTypes.IDLE:
        if (pickedId) {
          console.log('mouseupshift')
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
