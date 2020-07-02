import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Entity } from 'resium';
import { CallbackProperty, Cartesian3, Color, NearFarScalar, Math as CesiumMath, VerticalOrigin, Cartesian2 } from 'cesium';
import Coordinate from '../../../infrastructure/point/coordinate'
import { angleBetweenBrngs } from '../../../infrastructure/math/math'
import { POLYLINE } from '../../../store/action/drawing/objTypes'
import * as actions from '../../../store/action/index'

export const RenderPolyline = ({polyline}) => {
  const dispatch = useDispatch()
  const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)
  const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)
  const segmentPolylines = polyline.getSegmentPolyline()

  const showLength = useSelector(state => state.cesium.showLength)
  const showAngle = useSelector(state => state.cesium.showAngle)

  const getMidpoint = (startCor, endCor) => {
    const brng = Coordinate.bearing(startCor, endCor)
    const dist = Coordinate.surfaceDistance(startCor, endCor)
    const midDest = Coordinate.destination(startCor, brng, dist / 2)
    return Coordinate.toCartesian(midDest)
  }

  let enclosedAngle
  if (
    polyline.points.length > 2 &&
    Coordinate.isEqual(polyline.points[0], polyline.points.slice(-1)[0])
  ) {
    const brngStart = Coordinate.bearing(polyline.points[0], polyline.points[1])
    const brngEnd = Coordinate.bearing(
      polyline.points[0], polyline.points.slice(-2)[0]
    )
    enclosedAngle = angleBetweenBrngs(brngStart, brngEnd)
  }

  return ([
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
        material: polyline.color
      }}
      show={polyline.show}

      onMouseEnter={(move, tar) => {
        if (!drawingId && !pickedId) {
          dispatch(actions.polylineSetColor(polyline.entityId, Color.ORANGE))
          dispatch(actions.setHoverObj(POLYLINE, polyline.entityId))
        }
      }}
    />,
    ...segmentPolylines.map(subline =>
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
          eyeOffset: new Cartesian3(0.0, 1, -2),
          show: showLength && polyline.show,
          translucencyByDistance: new NearFarScalar(100, 1.0, 500, 0.0),
          rotation : CesiumMath.toRadians(180),
          alignedAxis : Cartesian3.UNIT_Z,
          verticalOrigin : VerticalOrigin.TOP
        }}
        show={polyline.show}
      />
    ),
    ...segmentPolylines.slice(1, ).map((subline, index) => {
      console.log(subline)
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
          backgroundColor: Color.STEELBLUE,
          font: "12px sans-serif",
          eyeOffset: new Cartesian3(0, 1, -2),
          show: showAngle && polyline.show,
          translucencyByDistance: new NearFarScalar(100, 1.0, 1000, 0.0),
          pixelOffset: new Cartesian2(10, 10),
          // pixelOffsetScaleByDistance: new NearFarScalar(1, 0.0, 500, 10.0),
          rotation : CesiumMath.toRadians(180),
          alignedAxis : Cartesian3.UNIT_Z,
          verticalOrigin : VerticalOrigin.TOP
        }}
        show={polyline.show}
      />
    }),
    enclosedAngle ?
    <Entity
      key={`${polyline.entityId}.lastangle`}
      id={`${polyline.entityId}.lastangle`}
      position={Coordinate.toCartesian(polyline.points[0])}
      label={{
        text: `${enclosedAngle.toFixed(2)} °`,
        showBackground: true,
        backgroundColor: Color.STEELBLUE,
        font: "12px sans-serif",
        eyeOffset: new Cartesian3(0, 1, -2),
        show: showAngle && polyline.show,
        translucencyByDistance: new NearFarScalar(100, 1.0, 1000, 0.0),
        pixelOffset: new Cartesian2(10, 10),
        // pixelOffsetScaleByDistance: new NearFarScalar(1, 0.0, 500, 10.0),
        rotation : CesiumMath.toRadians(180),
        alignedAxis : Cartesian3.UNIT_Z,
        verticalOrigin : VerticalOrigin.TOP
      }}
      show={polyline.show}
    /> : null
  ])
}
