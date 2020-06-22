import React from 'react'
import { RenderPoint } from '../Entities/RenderPoint'
import Point from '../../../../infrastructure/point/point'

export const TestRender = () => {
  const testPoint = new Point(-117.842453, 33.645769, 5)
  return (
    <RenderPoint point={testPoint} />
  )
}
