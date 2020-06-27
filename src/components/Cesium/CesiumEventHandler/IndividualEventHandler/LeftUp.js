import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType } from 'cesium';
import * as objTypes from '../../../../store/action/drawing/objTypes'
import * as actions from '../../../../store/action/index'


const LeftUpHandler = (props) => {
  const dispatch = useDispatch()
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)

  const leftUpActions = (event) => {
    switch (drwStat) {
      case objTypes.IDLE:
        if (pickedId) {
          console.log('releasepicked')
          dispatch(actions.releasePickedObj())
          dispatch(actions.enableRotate())
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
    />
  );
};

export default LeftUpHandler
