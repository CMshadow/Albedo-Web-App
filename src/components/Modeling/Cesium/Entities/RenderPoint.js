import React, {useState} from 'react';
import { Entity } from 'resium';
import { useSelector, useDispatch } from 'react-redux'
import Coordinate from '../../../../infrastructure/point/coordinate'
import { CallbackProperty, Cartesian3, HeightReference, Color } from 'cesium';
import { disableRotate, enableRotate } from '../../../../store/action/index'

export const RenderPoint = ({point}) => {
  const dispatch = useDispatch()
  const viewer = useSelector(state => state.cesium.viewer)
  const [color, setcolor] = useState(point.color)
  const [mouseDown, setmouseDown] = useState(false)

  return (
    <Entity
      id={point.entityId}

      position={new CallbackProperty(() => {
        return new Cartesian3.fromDegrees(...point.getCoordinate(true));
      }, false)}

      point={{
        pixelSize: point.pixelSize,
        color: color,
        heightReference: HeightReference.RELATIVE_TO_GROUND
      }}

      show={point.show}

      onMouseDown={() => {
        setmouseDown(true)
        dispatch(disableRotate())
      }}

      onMouseUp={() => {
        setmouseDown(false)
        dispatch(enableRotate())
      }}

      onMouseEnter={(move, tar) => {
        setcolor(Color.ORANGE)
        point.setColor(Color.ORANGE)
      }}

      onMouseLeave={(move, tar) => {
        setcolor(Color.WHITE)
        point.setColor(Color.WHITE)
      }}

      onMouseMove={(move, tar) => {
        if (mouseDown) {
          const mousePos = new Cartesian3(move.endPosition.x, move.endPosition.y)
          const ellipsoid = viewer.scene.globe.ellipsoid;
          const cartesian3 = viewer.camera.pickEllipsoid(mousePos, ellipsoid)
          console.log(Coordinate.fromCartesian(cartesian3))
        }
      }}
    />
  )
}
