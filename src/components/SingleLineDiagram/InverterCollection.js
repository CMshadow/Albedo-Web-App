import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Rect, Line, Group, Text, Circle } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'
import { InverterDataExport } from '../../store/action/index'

const InverterCollection = props => {
  const dispatch = useDispatch()
  const distance = useSelector(state => state.SLD.pvDist)
  const width = useSelector(state => state.SLD.width)
  const accessPorts = useSelector(state => state.SLD.pvAccessPorts)
  const inverterGap = useSelector(state => state.SLD.pvGap)
  const minSize = [width, width] //w,h
  const startPosition = [props.width * 0.5, props.height * 0.1]
  const accessNum = 2
  const stroke_Width = 2
  const groupOfInverter = []
  const pvTable = props.pvTable
  const inverterTable = props.invertersData
  let numOfInverter = props.numOfInverter > 3 ? 3 : props.numOfInverter
  let overSized = props.numOfInverter > 3 ? true : false
  let unitLineGap = numOfInverter > 5 ? 15 : 65
  let font_size = 16
  let toolKitTriggr = true
  const unitAccessPortDist = (numOfInverter * unitLineGap) / (numOfInverter + 1)

  const DrawSingleInverter = (i, accessPort) => {
    let startX = startPosition[0] * 0.05 + distance[0]
    let startY = startPosition[1] + inverterGap * i

    groupOfInverter.push(
      <Rect
        key={'Inverter-Rect-' + uuidv4()}
        x={startX}
        y={startY}
        width={minSize[0]}
        height={minSize[1]}
        stroke="white"
        strokeWidth={3}
        onMouseOver={() => {
          toolKitTriggr = !toolKitTriggr
        }}
      ></Rect>
    )
    for (let j = 1; j <= accessNum; ++j) {
      groupOfInverter.push(
        <Circle
          key={'Inverter-Circle-' + uuidv4()}
          x={startX}
          y={accessPorts[i][j - 1][1]}
          radius={5}
          fill="white"
        ></Circle>
      )

      groupOfInverter.push(
        <Line
          key={'Inverter-Line-' + uuidv4()}
          points={[startX, accessPorts[i][j - 1][1], accessPorts[i][j - 1][0], accessPorts[i][j - 1][1]]}
          stroke="white"
          strokeWidth={stroke_Width}
          lineCap="round"
          lineJoin="round"
        ></Line>
      )

      groupOfInverter.push(
        <Text
          key={'Inverter-Text-' + uuidv4()}
          x={0.45 * (startX + accessPorts[i][j - 1][0])}
          y={accessPorts[i][j - 1][1] + 5}
          text={
            props.numOfArray > 3 && i === 2 ? pvTable[props.numOfArray - 1].dc_cable_choice : pvTable[i].dc_cable_choice
          }
          fontSize={font_size}
          fontFamily="Arial"
          fill="white"
        ></Text>
      )
    }
    groupOfInverter.push(
      <Line
        key={'Inverter-Line-' + uuidv4()}
        points={[startX + minSize[0], startY, startX, startY + minSize[1]]}
        stroke="white"
        strokeWidth={stroke_Width}
        lineCap="round"
        lineJoin="round"
      ></Line>
    )

    groupOfInverter.push(
      <Line
        key={'Inverter-Line-' + uuidv4()}
        points={[
          startX + minSize[0] * 0.1,
          startY + minSize[1] * 0.1,
          startX + minSize[0] * 0.5,
          startY + minSize[1] * 0.1,
        ]}
        stroke="white"
        strokeWidth={stroke_Width}
        lineCap="round"
        lineJoin="round"
        dash={[1, 5]}
      ></Line>
    )

    groupOfInverter.push(
      <Line
        key={'Inverter-Line-' + uuidv4()}
        points={[
          startX + minSize[0] * 0.1,
          startY + minSize[1] * 0.15,
          startX + minSize[0] * 0.5,
          startY + minSize[1] * 0.15,
        ]}
        stroke="white"
        strokeWidth={stroke_Width}
        lineCap="round"
        lineJoin="round"
        // dash={[1, 5]}
      ></Line>
    )

    groupOfInverter.push(
      <Line
        key={'Inverter-Line-' + uuidv4()}
        points={[
          startX + minSize[0] * 0.1,
          startY + minSize[1] * 0.15,
          startX + minSize[0] * 0.5,
          startY + minSize[1] * 0.15,
        ]}
        stroke="white"
        strokeWidth={stroke_Width}
        lineCap="round"
        lineJoin="round"
      ></Line>
    )

    groupOfInverter.push(
      <Line
        key={'Inverter-Line-' + uuidv4()}
        points={[
          startX + minSize[0] * 0.5,
          startY + minSize[1] * 0.75,
          startX + minSize[0] * 0.6,
          startY + minSize[1] * 0.68,
          startX + minSize[0] * 0.75,
          startY + minSize[1] * 0.82,
          startX + minSize[0] * 0.85,
          startY + minSize[1] * 0.75,
        ]}
        stroke="white"
        strokeWidth={stroke_Width}
        lineCap="round"
        lineJoin="round"
        tension={0.5}
      ></Line>
    )

    groupOfInverter.push(
      <Line
        key={'Inverter-Line-' + uuidv4()}
        points={[
          startX + minSize[0],
          startY + minSize[1] * 0.5,
          startX + minSize[0] + (i + 1) * unitAccessPortDist,
          startY + minSize[1] * 0.5,
        ]}
        stroke="white"
        strokeWidth={stroke_Width}
        lineCap="round"
        lineJoin="round"
      ></Line>
    )

    accessPort.push([startX + minSize[0] + (i + 1) * unitAccessPortDist, startY + minSize[1] * 0.5])

    groupOfInverter.push(
      <Text
        key={'Inverter-Type' + uuidv4()}
        x={startX}
        y={startY + minSize[1] * 1.05}
        text={inverterTable[i].inverter_model}
        fontSize={font_size}
        fontFamily="Arial"
        fill="white"
      ></Text>
    )

    groupOfInverter.push(
      <Text
        key={'Inverter-Type' + uuidv4()}
        x={startX + minSize[0] + 10}
        y={startY + minSize[1] * 0.5 + 5}
        text={
          props.numOfArray > 3 && i === 2 ? pvTable[props.numOfArray - 1].ac_cable_choice : pvTable[i].ac_cable_choice
        }
        fontSize={font_size}
        fontFamily="Arial"
        fill="white"
      ></Text>
    )

    if (i === 1 && overSized) {
      drawDashLine(startX + minSize[0] * 0.5, startY + minSize[1] * 1.35)
    }
  }

  const DrawInverterCollection = () => {
    let accessPort = []
    for (let i = 0; i < numOfInverter; ++i) {
      DrawSingleInverter(i, accessPort)
    }
    dispatch(InverterDataExport(accessPort))

    return groupOfInverter
  }

  const drawDashLine = (startPanelPointX, startPanelPointY) => {
    groupOfInverter.push(
      <Line
        key={'Inverter-Line-' + uuidv4()}
        points={[startPanelPointX, startPanelPointY, startPanelPointX, startPanelPointY + minSize[1] * 0.3]}
        stroke="white"
        strokeWidth={stroke_Width * 2}
        lineCap="round"
        lineJoin="round"
        dash={[1, 10]}
      ></Line>
    )
  }

  return <Group>{[...DrawInverterCollection()]}</Group>
}

export default InverterCollection
