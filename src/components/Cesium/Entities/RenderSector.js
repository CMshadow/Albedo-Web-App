import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Entity } from 'resium';
import { CallbackProperty, Cartesian3, NearFarScalar, Math as CesiumMath, VerticalOrigin } from 'cesium';
import Coordinate from '../../../infrastructure/point/coordinate'
import { SECTOR } from '../../../store/action/drawing/objTypes'
import * as actions from '../../../store/action/index'


export const RenderSector = ({sector}) => {
  const dispatch = useDispatch()
  const showAngle = useSelector(state => state.cesium.showAngle)
  const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)
  const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)

  return (
    <Entity
      key={sector.entityId}
      id={sector.entityId}
      polyline={{
        positions: new CallbackProperty(() => {
          return new Cartesian3.fromDegreesArrayHeights(
            sector.getPointsCoordinatesArray()
          );
        }, false),
        width: sector.width,
        material: sector.color
      }}
      show={sector.show}
      onMouseEnter={(move, tar) => {
        if (!drawingId && !pickedId) {
          dispatch(actions.setHoverObj(SECTOR, sector.entityId))
        }
      }}
    >
      <Entity
        key={`${sector.entityId}.label`}
        id={`${sector.entityId}.label`}
        position={
          new CallbackProperty(() => {
            return Coordinate.toCartesian(sector.originCor)
          }, false)
        }
        label={{
          text: `Radius: ${sector.radius.toFixed(2)} m`,
          showBackground: true,
          font: "16px sans-serif",
          eyeOffset: new Cartesian3(sector.brng > 0 && sector.brng < 180 ? 3 : -3, 1, -2),
          show: showAngle,
          translucencyByDistance: new NearFarScalar(100, 1.0, 500, 0.0),
          rotation : CesiumMath.toRadians(180),
          alignedAxis : Cartesian3.UNIT_Z,
          verticalOrigin : VerticalOrigin.TOP
        }}
        show={sector.show}
      />
    </Entity>
  )
}
