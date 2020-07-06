import React from 'react';
import { Entity } from 'resium';
import { useSelector, useDispatch } from 'react-redux'
import { Cartesian3, CallbackProperty, PolygonHierarchy } from 'cesium';
import * as actions from '../../../store/action/index'
import { POLYGON } from '../../../store/action/drawing/objTypes'

export const RenderPolygon = ({polygon}) => {
	const dispatch = useDispatch()
	const drawingId = useSelector(state => state.undoable.present.drawing.drawingId)
	const pickedId = useSelector(state => state.undoable.present.drawing.pickedId)

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
				outline: false,
				outlineColor: polygon.outlineColor,
				outlineWidth: polygon.outlineWidth,
				material: polygon.material,
				shadows: polygon.shadow
			}}

			show={polygon.show}

			onMouseDown={() => {
        if (!pickedId && !drawingId) {
          dispatch(actions.disableRotate())
          dispatch(actions.setPickedObj(POLYGON, polygon.entityId))
        }
      }}

			onMouseEnter={(move, tar) => {
				if (!drawingId && !pickedId) {
	        dispatch(actions.setHoverObj(POLYGON, polygon.entityId))
				}
      }}
		/>
	)
};
