import React from 'react'
import { useSelector } from 'react-redux'
import { RenderPolyline } from '../Entities/RenderPolyline'

export const DrawingPolylineRender = () => {
  const drawingPolyline = useSelector(state => state.undoable.present.polyline)

  return (
    Object.keys(drawingPolyline).map(polylineId =>
      <RenderPolyline key={polylineId} polyline={drawingPolyline[polylineId].entity} />
    )
  )
}
