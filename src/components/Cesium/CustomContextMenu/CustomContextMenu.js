import React from 'react';
import { useSelector } from 'react-redux';
import * as pcikedObjTypes from '../../../store/action/drawing/pickedObjTypes';
import EditPointContextMenu from './IndividualContextMenu/EditPointContextMenu';

export const CustomContextMenu = (props) => {
  const hoverId = useSelector(state => state.undoable.present.picked.hoverId)
  const hoverType = useSelector(state => state.undoable.present.picked.hoverType)

  let menu
  switch (hoverType) {
    case pcikedObjTypes.POINT:
      menu = <EditPointContextMenu hoverId={hoverId}/>
      break
    default:
      menu = null
  }

  return (
    <>{menu}</>
  );
}
