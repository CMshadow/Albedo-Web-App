import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Rect, Line, Group, Text, Circle } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'
import { setGrid } from '../../store/action/index'

const Meter = () => {
  const dispatch = useDispatch()
  const serverPanelAccess = useSelector(state => state.SLD.serverPanelAccess)
  const startPosition = useSelector(state => state.SLD.meterPosition)
  const width = (serverPanelAccess[1] - startPosition[1]) * 2
  const groupOfMeter = []
  const minSize = [width, width]
  const stroke_Width = 3
  let font_size = 16 //Math.floor(minSize[1] * 0.5);

  const DrawMeter = () => {
    let startX = startPosition[0] + width * 3
    let startY = startPosition[1]

    groupOfMeter.push(
      <Rect
        key={'Meter-Rect-' + uuidv4()}
        x={startX}
        y={startY}
        width={minSize[0]}
        height={minSize[1]}
        stroke="white"
        strokeWidth={stroke_Width}
      ></Rect>
    )

    groupOfMeter.push(
      <Circle
        key={'Metere-Circle-' + uuidv4()}
        x={startX + minSize[0] * 0.5}
        y={startY + minSize[1] * 0.5}
        radius={minSize[1] * 0.35}
        stroke="white"
      ></Circle>
    )

    groupOfMeter.push(
      <Line
        key={'Meter-ConnectLine-' + uuidv4()}
        points={[startX, startY + minSize[1] / 2, serverPanelAccess[0], serverPanelAccess[1]]}
        stroke="white"
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
      ></Line>
    )

    groupOfMeter.push(
      <Text
        key={'Meter-Text-' + uuidv4()}
        x={startX - 2}
        y={startY + minSize[1] * 1.05}
        text={'Meter'}
        fontSize={font_size}
        fontFamily="Arial"
        fill="white"
      ></Text>
    )

    dispatch(setGrid([startX + minSize[0], startY + minSize[1] * 0.5], [startX + minSize[0], startY]))
    return groupOfMeter
  }

  return <Group>{[...DrawMeter()]}</Group>
}

export default Meter
