import React from 'react'
import { useSelector } from 'react-redux'
import { RenderPoint } from '../Entities/RenderPoint'

export const DrawingPointRender = () => {
  const drawingPoints = useSelector(state => state.undoable.present.point)

  return (
    Object.keys(drawingPoints).map(pointId =>
      <RenderPoint key={pointId} point={drawingPoints[pointId].entity} />
    )
  )
}
