import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Rect, Line, Group, Text, Circle } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'
import { setServerPanel } from '../../store/action/index'

const ACDisconnecter = props => {
  const dispatch = useDispatch()
  const interConnectAccessPort = useSelector(state => state.SLD.interConnectAccessPorts)
  const startPosition = useSelector(state => state.SLD.disconnecterPosition)
  const groupOfDisconnecter = []
  const width = useSelector(state => state.SLD.disconnectSize)
  let minSize = [width * 0.487, width * 0.3]
  let stroke_Width = 2

  const DrawDisconnecter = () => {
    let offset = 0
    let startX = startPosition[0]
    let startY = startPosition[1]
    if (props.numOfArray === 1) {
      minSize[0] = minSize[0] * 2
      minSize[1] = minSize[1] * 2
      offset = -(startY + minSize[1] * 0.5 - interConnectAccessPort[1])
      startX += minSize[0]
      startY += offset
    }

    groupOfDisconnecter.push(
      <Rect
        key={'Disconnect-Rect-' + uuidv4()}
        x={startX}
        y={startY}
        width={minSize[0]}
        height={minSize[1]}
        stroke='white'
        strokeWidth={3}
      ></Rect>
    )

    groupOfDisconnecter.push(
      <Circle
        key={'Disconnect-Circle-' + uuidv4()}
        x={startX + minSize[0] * 0.25}
        y={startY + minSize[1] * 0.5}
        radius={3}
        fill='white'
      ></Circle>
    )

    groupOfDisconnecter.push(
      <Circle
        key={'Disconnect-Circle-' + uuidv4()}
        x={startX + minSize[0] * 0.8}
        y={startY + minSize[1] * 0.5}
        radius={3}
        fill='white'
      ></Circle>
    )

    const switchOffsetX = startX + 0.75 * minSize[0]
    const switchOffsetY = startY + minSize[1] * 0.25

    groupOfDisconnecter.push(
      <Line
        key={'Disconnect-AccessPortLine-' + uuidv4()}
        points={[startX + 0.25 * minSize[0], startY + minSize[1] / 2, switchOffsetX, switchOffsetY]}
        stroke='white'
        strokeWidth={stroke_Width}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfDisconnecter.push(
      <Line
        key={'Disconnect-AccessPortLine-' + uuidv4()}
        points={[
          startX + 0.25 * minSize[0],
          startY + minSize[1] / 2,
          interConnectAccessPort[0],
          interConnectAccessPort[1],
        ]}
        stroke='white'
        strokeWidth={stroke_Width}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfDisconnecter.push(
      <Line
        key={'Disconnect-AccessPortLine-' + uuidv4()}
        points={[
          startX + 0.8 * minSize[0],
          startY + minSize[1] * 0.5,
          startX + 1.2 * minSize[0],
          startY + minSize[1] / 2,
        ]}
        stroke='white'
        strokeWidth={stroke_Width}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfDisconnecter.push(
      <Text
        key={'Disconnect-Text-' + uuidv4()}
        x={startX}
        y={startY + minSize[1] * 1.05}
        text={'Disconnect'}
        fontSize={16}
        fontFamily='Arial'
        fill='white'
      ></Text>
    )

    dispatch(
      setServerPanel(
        [startX + 1.2 * minSize[0], startY + minSize[1] / 2],
        [startX + width * 0.5, startY]
      )
    )
    return groupOfDisconnecter
  }

  return <Group>{[...DrawDisconnecter()]}</Group>
}

export default ACDisconnecter
