import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ScreenSpaceEvent } from 'resium';
import { ScreenSpaceEventType, defined, Cartesian3, Color } from 'cesium';
import Coordinate from '../../../../infrastructure/point/coordinate'
import * as objTypes from '../../../../store/action/drawing/objTypes'
import * as actions from '../../../../store/action/index';

const MouseMoveHandler = () => {
  const dispatch = useDispatch()
  const viewer = useSelector(state => state.cesium.viewer)
  const drwStat = useSelector(state => state.undoable.present.drwStat.status)
  const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)
  const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)
  const pickedType = useSelector(state => state.undoable.present.drawing.pickedType)
  const hoverId = useSelector(state => state.undoable.present.drawing.hoverId)
  const hoverType = useSelector(state => state.undoable.present.drawing.hoverType)

  const allPolygon = useSelector(state => state.undoable.present.polygon)

  const mouseMoveActions = (event) => {
    const ellipsoid = viewer.scene.globe.ellipsoid;
    const mouseEndPos = new Cartesian3(event.endPosition.x, event.endPosition.y)
    const mouseEndCart3 = viewer.camera.pickEllipsoid(mouseEndPos, ellipsoid)
    const mouseStartPos = new Cartesian3(event.startPosition.x, event.startPosition.y)
    const mouseStartCart3 = viewer.camera.pickEllipsoid(mouseStartPos, ellipsoid)
    // const mouseEndCart3 = viewer.scene.pickPosition(event.endPosition)
    // const mouseStartCart3 = viewer.scene.pickPosition(event.startPosition)
    if (!defined(mouseEndCart3) || !defined(mouseStartCart3)) return
    const mouseEndCor = Coordinate.fromCartesian(mouseEndCart3)
    const mouseStartCor = Coordinate.fromCartesian(mouseStartCart3)


    if (!pickedId) {
      const pickedObjIdArray = viewer.scene.drillPick(event.endPosition).map(elem => elem.id.id)
      if (!pickedObjIdArray.includes(hoverId)) {
        switch (hoverType) {
          case objTypes.POLYLINE:
          case objTypes.POINT:
          case objTypes.POLYGON:
          case objTypes.CIRCLE:
          case objTypes.SECTOR:
            dispatch(actions.releaseHoverObj())
            break

          default:
            break
        }
      }
    }

    switch(drwStat) {
      case objTypes.IDLE:
        if (pickedId && pickedType === objTypes.POINT) {
          dispatch(actions.pointMoveHori(pickedId, mouseEndCor))
        } else if ( pickedId && pickedType === objTypes.POLYGON && allPolygon[pickedId].props.polygonPos) {
          const brng = Coordinate.bearing(mouseStartCor, mouseEndCor)
          const dist = Coordinate.linearDistance(mouseStartCor, mouseEndCor)
          dispatch(actions.polygonMoveHori(pickedId, brng, dist))
        }
        break;

      case objTypes.LINE:
      case objTypes.POLYLINE:
        if (drawingId) {
          dispatch(actions.polylineDynamic(drawingId, mouseEndCor))
        }
        break

      case objTypes.POLYGON:
        if (drawingId) {
          dispatch(actions.polygonDynamic(drawingId, mouseEndCor))
          const outPolylineId = allPolygon[drawingId].outPolylineId
          dispatch(actions.polylineDynamic(outPolylineId, mouseEndCor))
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

export default MouseMoveHandler
