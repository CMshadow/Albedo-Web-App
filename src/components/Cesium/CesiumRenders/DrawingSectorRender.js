import React from 'react'
import { useSelector } from 'react-redux'
import { RenderSector } from '../Entities/RenderSector'

export const DrawingSectorRender = () => {
  const drawingSector = useSelector(state => state.undoable.present.sector)

  return (
    Object.keys(drawingSector).map(sectorId =>
      <RenderSector key={sectorId} sector={drawingSector[sectorId].entity} />
    )
  )
}
