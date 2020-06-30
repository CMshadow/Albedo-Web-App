import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Entity } from 'resium';
import { CallbackProperty, Cartesian3, Color, NearFarScalar, Math as CesiumMath, VerticalOrigin, Cartesian2 } from 'cesium';
import Coordinate from '../../../infrastructure/point/coordinate'
import { angleBetweenBrngs } from '../../../infrastructure/math/math'
import { POLYLINE } from '../../../store/action/drawing/objTypes'
import * as actions from '../../../store/action/index'

const polylineColor = Color.LIMEGREEN

export const RenderCircle = ({circle}) => {
  const dispatch = useDispatch()
  const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)
  const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)
  const [color, setcolor] = useState(circle.color)

  return (
    <Entity
      key={circle.entityId}
      id={circle.entityId}
      polyline={{
        positions: new CallbackProperty(() => {
          return new Cartesian3.fromDegreesArrayHeights(
            circle.getPointsCoordinatesArray()
          );
        }, false),
        width: circle.width,
        material: color
      }}
      show={circle.show}
    >
      <Entity
        key={`${circle.entityId}.label`}
        id={`${circle.entityId}.label`}
        position={
          new CallbackProperty(() => {
            return Coordinate.toCartesian(circle.centerPoint)
          }, false)
        }
        label={{
          text: `Radius: ${circle.radius.toFixed(2)} m`,
          showBackground: true,
          font: "16px sans-serif",
          eyeOffset: new Cartesian3(-4, 1, -2),
          show: true, //drawingId === polyline.entityId,
          translucencyByDistance: new NearFarScalar(100, 1.0, 500, 0.0),
          rotation : CesiumMath.toRadians(180),
          alignedAxis : Cartesian3.UNIT_Z,
          verticalOrigin : VerticalOrigin.TOP
        }}
        show={circle.show}
      />
    </Entity>
  )
}
