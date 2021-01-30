import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Rect, Group } from 'react-konva'
import { useSelector } from 'react-redux'
import { RootState } from '../../../@types'

const BackgroundGrids = () => {
  const windowHeight = useSelector((state: RootState) => state.SLD.stageHeight)
  const windowWidth = useSelector((state: RootState) => state.SLD.stageWidth)

  return (
    <Group>
      <Rect
        key={'Backgroud-Rect-' + uuidv4()}
        x={0}
        y={0}
        width={windowWidth}
        height={windowHeight}
      ></Rect>
    </Group>
  )
}

export default BackgroundGrids
