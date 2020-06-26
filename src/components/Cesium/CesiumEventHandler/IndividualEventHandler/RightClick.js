import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType } from 'cesium'
import * as actions from '../../../../store/action/index'
import * as objTypes from '../../../../store/action/drawing/objTypes'


const RightClickHandler = () => {
  const dispatch = useDispatch()
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)

  const rightClickActions = (event) => {

    switch (drwStat) {
      case objTypes.POINT:
        break;

      case objTypes.POLYGON:
        dispatch(actions.polygonTerminate())
        dispatch(actions.setDrwStatIdle())
        dispatch(actions.enableRotate())
        break

      default:
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
