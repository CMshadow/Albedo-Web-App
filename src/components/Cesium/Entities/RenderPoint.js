import React, {useState} from 'react';
import { Entity } from 'resium';
import { useSelector, useDispatch } from 'react-redux'
import Coordinate from '../../../infrastructure/point/coordinate'
import { CallbackProperty, Cartesian3, HeightReference, Color, Cartesian2 } from 'cesium';
import * as actions from '../../../store/action/index'
import { POINT } from '../../../store/action/drawing/pickedObjTypes'

export const RenderPoint = ({point}) => {
  const dispatch = useDispatch()
  const pickedId = useSelector(state => state.undoable.present.picked.pickedId)
  const [color, setcolor] = useState(point.color)

  return (
    <Entity
      id={point.entityId}

      position={new CallbackProperty(() =>
        new Cartesian3.fromDegrees(...point.getCoordinate(true)), false
      )}

      point={{
        pixelSize: point.pixelSize,
        color: color,
        heightReference: HeightReference.RELATIVE_TO_GROUND
      }}

      label={{
        text: `${point.height} m`,
        showBackground: true,
        font: "20px sans-serif",
        pixelOffset: new Cartesian2(40, -20),
        show: pickedId === point.entityId
      }}

      show={point.show}

      onMouseDown={() => {
        if (!pickedId) {
          console.log('mousedown')
          dispatch(actions.disableRotate())
          dispatch(actions.setPickedObj(POINT, point.entityId))
        }
      }}

      onMouseEnter={(move, tar) => {
        setcolor(Color.ORANGE)
        point.setColor(Color.ORANGE)
        dispatch(actions.setHoverObj(POINT, point.entityId))
      }}

      onMouseLeave={(move, tar) => {
        setcolor(Color.WHITE)
        point.setColor(Color.WHITE)
        dispatch(actions.releaseHoverObj())
      }}
    />
  )
}
