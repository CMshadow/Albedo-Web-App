import React from 'react'
import { useSelector } from 'react-redux'
import { RenderPolygon } from '../Entities/RenderPolygon'

export const DrawingPolygonRender = () => {
  const drawingPolygons = useSelector(state => state.undoable.present.polygon)

  return (
    Object.keys(drawingPolygons).map(polygonId =>
      <RenderPolygon key={polygonId} polygon={drawingPolygons[polygonId].entity} />
    )
  )
}
