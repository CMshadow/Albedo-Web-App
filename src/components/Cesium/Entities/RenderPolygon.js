import React, { useState } from 'react';
import { Entity } from 'resium';
import { useSelector, useDispatch } from 'react-redux'
import { Cartesian3, CallbackProperty, PolygonHierarchy, Color } from 'cesium';
import * as actions from '../../../store/action/index'
import { POLYGON } from '../../../store/action/drawing/objTypes'

export const RenderPolygon = ({polygon}) => {
	const dispatch = useDispatch()
	const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)
	const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)
	const [color, setcolor] = useState(polygon.material)

	return (
		<Entity
			id={polygon.entityId}

			polygon={{
				hierarchy:
					new CallbackProperty(() => {
	          return new PolygonHierarchy(
	            new Cartesian3.fromDegreesArrayHeights(polygon.hierarchy)
	          )
	        }, false),
				perPositionHeight: polygon.perPositionHeight,
				extrudedHeight: polygon.extrudedHeight,
				outline: true,
				outlineColor: polygon.outlineColor,
				outlineWidth: polygon.outlineWidth,
				material: color,
				shadows: polygon.shadow
			}}

			show={polygon.show}

			onMouseDown={() => {
        if (!pickedId) {
					console.log('setpicked')
          dispatch(actions.disableRotate())
          dispatch(actions.setPickedObj(POLYGON, polygon.entityId))
        }
      }}

			onMouseEnter={(move, tar) => {
				if (drawingId !== polygon.entityId) {
					setcolor(Color.ORANGE.withAlpha(0.2))
	        polygon.setColor(Color.ORANGE.withAlpha(0.2))
	        dispatch(actions.setHoverObj(POLYGON, polygon.entityId))
				}
      }}

      onMouseLeave={(move, tar) => {
				if (drawingId !== polygon.entityId) {
					setcolor(Color.WHITE.withAlpha(0.2))
	        polygon.setColor(Color.WHITE.withAlpha(0.2))
	        dispatch(actions.releaseHoverObj())
				}
      }}
		/>
	)
};
