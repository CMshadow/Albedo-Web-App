import React from 'react'
import { useSelector } from 'react-redux'
import { RenderCircle } from '../Entities/RenderCircle'

export const DrawingCircleRender = () => {
  const drawingCircle = useSelector(state => state.undoable.present.circle)

  return (
    Object.keys(drawingCircle).map(circleId =>
      <RenderCircle key={circleId} circle={drawingCircle[circleId].entity} />
    )
  )
}
