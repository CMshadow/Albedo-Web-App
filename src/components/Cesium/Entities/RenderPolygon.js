import React from 'react';
import { Entity } from 'resium';
import { Cartesian3, CallbackProperty, PolygonHierarchy } from 'cesium';


export const RenderPolygon = ({polygon}) => {
	return (
		<Entity
			id={polygon.entityId}

			polygon={{
				hierarchy: new CallbackProperty(() => {
          return new PolygonHierarchy(
            new Cartesian3.fromDegreesArrayHeights(polygon.hierarchy)
          )
        }, false),
				perPositionHeight: polygon.perPositionHeight,
				extrudedHeight: polygon.extrudedHeight,
				outline: true,
				outlineColor: polygon.outlineColor,
				outlineWidth: polygon.outlineWidth,
				material: polygon.material,
				shadows: polygon.shadow
			}}

			show={polygon.show}
		/>
	)
};
