import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Entity } from 'resium';
import { CallbackProperty, Cartesian3, Color, NearFarScalar, Math as CesiumMath, VerticalOrigin } from 'cesium';
import Coordinate from '../../../infrastructure/point/coordinate'
import { angleBetweenBrngs } from '../../../infrastructure/math/math'

export const RenderPolyline = ({polyline}) => {
  const dispatch = useDispatch()
  const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)
  const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)
  const [color, setcolor] = useState(polyline.color)
  const segmentPolylines = polyline.getSegmentPolyline()

  const getMidpoint = (startCor, endCor) => {
    const brng = Coordinate.bearing(startCor, endCor)
    const dist = Coordinate.surfaceDistance(startCor, endCor)
    const midDest = Coordinate.destination(startCor, brng, dist / 2)
    return Coordinate.toCartesian(midDest)
  }

  return (
    <Entity
      key={polyline.entityId}
      id={polyline.entityId}
      polyline={{
        positions: new CallbackProperty(() => {
          return new Cartesian3.fromDegreesArrayHeights(
            polyline.getPointsCoordinatesArray()
          );
        }, false),
        width: polyline.width,
        material: color
      }}
      show={polyline.show}
    >
      {
        segmentPolylines.map(subline =>
          <Entity
            key={`${subline.entityId}.length`}
            id={`${subline.entityId}.length`}
            position={
              new CallbackProperty(() => {
                return getMidpoint(subline.points[0], subline.points[1])
              }, false)
            }
            label={{
              text: `${subline.polylineLength()} m`,
              showBackground: true,
              font: "16px sans-serif",
              eyeOffset: new Cartesian3(0.0, 1, -10),
              show: drawingId === polyline.entityId,
              translucencyByDistance: new NearFarScalar(100, 1.0, 500, 0.0),
              rotation : CesiumMath.toRadians(180),
              alignedAxis : Cartesian3.UNIT_Z,
              verticalOrigin : VerticalOrigin.TOP
            }}
            show={subline.show}
          />
        )
      }
      {
        segmentPolylines.slice(1, ).map((subline, index) => {
          const brngThisLine = Coordinate.bearing(subline.points[0], subline.points[1])
          const brngPrevLine = Coordinate.bearing(
            segmentPolylines[index].points[1], segmentPolylines[index].points[0]
          )
          const angle = angleBetweenBrngs(brngThisLine, brngPrevLine)
          return <Entity
            key={`${subline.entityId}.angle`}
            id={`${subline.entityId}.angle`}
            position={Coordinate.toCartesian(subline.points[0])}
            label={{
              text: `${angle.toFixed(2)} °`,
              showBackground: true,
              font: "12px sans-serif",
              eyeOffset: new Cartesian3(2, 1, -2),
              show: drawingId === polyline.entityId,
              translucencyByDistance: new NearFarScalar(100, 1.0, 1000, 0.0),
              rotation : CesiumMath.toRadians(180),
              alignedAxis : Cartesian3.UNIT_Z,
              verticalOrigin : VerticalOrigin.TOP
            }}
            show={subline.show}
          />
        })
      }
    </Entity>
  )
}
