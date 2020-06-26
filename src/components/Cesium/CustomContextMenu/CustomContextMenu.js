import React from 'react';
import { useSelector } from 'react-redux';
import * as objTypes from '../../../store/action/drawing/objTypes';
import EditPointContextMenu from './IndividualContextMenu/EditPointContextMenu';

export const CustomContextMenu = (props) => {
  const hoverId = useSelector(state => state.undoable.present.drawing.hoverId)
  const hoverType = useSelector(state => state.undoable.present.drawing.hoverType)

  let menu
  switch (hoverType) {
    case objTypes.POINT:
      menu = <EditPointContextMenu hoverId={hoverId}/>
      break
    default:
      menu = null
  }

  return (
    <>{menu}</>
  );
}
