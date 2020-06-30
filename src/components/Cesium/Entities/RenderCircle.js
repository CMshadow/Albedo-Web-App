import React from 'react';
import { useSelector } from 'react-redux'
import { Entity } from 'resium';
import { CallbackProperty, Cartesian3, NearFarScalar, Math as CesiumMath, VerticalOrigin } from 'cesium';
import Coordinate from '../../../infrastructure/point/coordinate'


export const RenderCircle = ({circle}) => {
  const showAngle = useSelector(state => state.cesium.showAngle)

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
        material: circle.color
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
          show: showAngle,
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
