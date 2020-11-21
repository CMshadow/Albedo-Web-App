import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Rect, Line, Group, Text, Circle } from 'react-konva'
import { useDispatch, useSelector } from 'react-redux'
import { setInterConnectData } from '../../store/action/index'

const InterConnecter = props => {
  const dispatch = useDispatch()
  const width = useSelector(state => state.SLD.width)
  const inverterAccessPorts = useSelector(state => state.SLD.inverterAccessPorts)
  const numOfInverter = props.numOfInverter > 3 ? 3 : props.numOfInverter
  const minSize = [width * 1.5, (numOfInverter + 1) * width * 0.5]
  const prevDistance = inverterAccessPorts[0]
  const stroke_Width = 2
  const font_size = Math.floor(minSize[0] / 9)
  const interConnectName = props.combineBoxName
  let unitLineGap = numOfInverter > 5 ? 15 : 65
  if (props.numOfInverter === 1) unitLineGap = 200
  let groupOfInterConnect = []
  let startX = prevDistance[0] + numOfInverter * unitLineGap
  let startY = prevDistance[1] - width * 0.5

  const DrawInverterCollection = () => {
    groupOfInterConnect.push(
      <Rect
        key={'InterConnect-Rect-' + uuidv4()}
        x={startX}
        y={startY}
        width={minSize[0]}
        height={minSize[1]}
        stroke='white'
        strokeWidth={3}
      ></Rect>
    )

    for (let i = 1; i <= numOfInverter; ++i) {
      groupOfInterConnect.push(
        <Circle
          key={'InterConnect-Access-' + uuidv4()}
          x={startX}
          y={startY + (minSize[1] / (numOfInverter + 1)) * i}
          radius={5}
          fill='white'
        ></Circle>
      )

      if (inverterAccessPorts[i - 1][1] !== startY + (minSize[1] / (numOfInverter + 1)) * i) {
        groupOfInterConnect.push(
          <Line
            key={'InterConnect-ConnectLine-' + uuidv4()}
            points={[
              startX,
              startY + (minSize[1] / (numOfInverter + 1)) * i,
              inverterAccessPorts[i - 1][0],
              startY + (minSize[1] / (numOfInverter + 1)) * i,
              inverterAccessPorts[i - 1][0],
              inverterAccessPorts[i - 1][1],
            ]}
            stroke='white'
            strokeWidth={stroke_Width}
            lineCap='round'
            lineJoin='round'
          ></Line>
        )
      } else {
        groupOfInterConnect.push(
          <Line
            key={'InterConnect-ConnectLine-' + uuidv4()}
            points={[
              startX,
              startY + (minSize[1] / (numOfInverter + 1)) * i,
              inverterAccessPorts[i - 1][0],
              startY + (minSize[1] / (numOfInverter + 1)) * i,
              inverterAccessPorts[i - 1][0],
              inverterAccessPorts[i - 1][1],
            ]}
            stroke='white'
            strokeWidth={stroke_Width}
            lineCap='round'
            lineJoin='round'
          ></Line>
        )
      }
      groupOfInterConnect.push(
        <Line
          key={'InterConnect-ConnectLine-' + uuidv4()}
          points={[
            startX,
            startY + (minSize[1] / (numOfInverter + 1)) * i,
            startX + minSize[0] * 0.2,
            startY + (minSize[1] / (numOfInverter + 1)) * i,
          ]}
          stroke='white'
          strokeWidth={stroke_Width}
          lineCap='round'
          lineJoin='round'
          tension={0.5}
        ></Line>
      )

      groupOfInterConnect.push(
        <Circle
          key={'InterConnect-BusLine-' + uuidv4()}
          x={startX + minSize[0] * 0.2}
          y={startY + (minSize[1] / (numOfInverter + 1)) * i}
          radius={3}
          fill='white'
        ></Circle>
      )

      groupOfInterConnect.push(
        <Circle
          key={'InterConnect-BusLine-' + uuidv4()}
          x={startX + minSize[0] * 0.35}
          y={startY + (minSize[1] / (numOfInverter + 1)) * i}
          radius={3}
          fill='white'
        ></Circle>
      )

      groupOfInterConnect.push(
        <Line
          key={'InterConnect-InnerConnectLine-' + uuidv4()}
          points={[
            startX + minSize[0] * 0.2,
            startY + (minSize[1] / (numOfInverter + 1)) * i,
            startX + minSize[0] * 0.275,
            startY + (minSize[1] / (numOfInverter + 1)) * i - 10,
            startX + minSize[0] * 0.35,
            startY + (minSize[1] / (numOfInverter + 1)) * i,
          ]}
          stroke='white'
          strokeWidth={stroke_Width}
          lineCap='round'
          lineJoin='round'
          tension={0.5}
        ></Line>
      )

      groupOfInterConnect.push(
        props.numOfInverter > 3 && i === 2 ? (
          <Line
            key={'InterConnect-Line-' + uuidv4()}
            points={[
              startX + minSize[0] * 0.275,
              startY + (minSize[1] / (numOfInverter + 1)) * i + 10,
              startX + minSize[0] * 0.275,
              startY + (minSize[1] / (numOfInverter + 1)) * i + 30,
            ]}
            stroke='white'
            strokeWidth={stroke_Width}
            lineCap='round'
            lineJoin='round'
            dash={[1, 5]}
          ></Line>
        ) : null
      )

      groupOfInterConnect.push(
        <Line
          key={'InterConnect-InnerConnectLine-' + uuidv4()}
          points={[
            startX + minSize[0] * 0.35,
            startY + (minSize[1] / (numOfInverter + 1)) * i,
            startX + minSize[0] * 0.5,
            startY + (minSize[1] / (numOfInverter + 1)) * i,
          ]}
          stroke='white'
          strokeWidth={stroke_Width}
          lineCap='round'
          lineJoin='round'
          tension={0.5}
        ></Line>
      )

      groupOfInterConnect.push(
        <Line
          key={'InterConnect-InnerConnectLine-' + uuidv4()}
          points={[
            startX + minSize[0] * 0.65,
            startY + minSize[1] * 0.15,
            startX + minSize[0] * 0.5,
            startY + minSize[1] * 0.15,
            startX + minSize[0] * 0.5,
            startY + (minSize[1] / (numOfInverter + 1)) * i,
          ]}
          stroke='white'
          strokeWidth={stroke_Width}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      groupOfInterConnect.push(
        <Circle
          key={'InterConnect-BusLine-' + uuidv4()}
          x={startX + minSize[0] * 0.65}
          y={startY + minSize[1] * 0.15}
          radius={3}
          fill='white'
        ></Circle>
      )

      groupOfInterConnect.push(
        <Line
          key={'InterConnect-InnerConnectLine-' + uuidv4()}
          points={[
            startX + minSize[0] * 0.65,
            startY + minSize[1] * 0.15,
            startX + minSize[0] * 0.75,
            startY + minSize[1] * 0.1,
            startX + minSize[0] * 0.85,
            startY + minSize[1] * 0.15,
          ]}
          stroke='white'
          strokeWidth={stroke_Width}
          lineCap='round'
          lineJoin='round'
          tension={0.5}
        ></Line>
      )

      groupOfInterConnect.push(
        <Circle
          key={'InterConnect-BusLine-' + uuidv4()}
          x={startX + minSize[0] * 0.85}
          y={startY + minSize[1] * 0.15}
          radius={3}
          fill='white'
        ></Circle>
      )

      groupOfInterConnect.push(
        <Line
          key={'InterConnect-InnerConnectLine-' + uuidv4()}
          points={[
            startX + minSize[0] * 0.85,
            startY + minSize[1] * 0.15,
            startX + minSize[0] * 1.2,
            startY + minSize[1] * 0.15,
          ]}
          stroke='white'
          strokeWidth={1.5}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )
    }
    groupOfInterConnect.push(
      <Text
        key={'InterConnect-Text-' + uuidv4()}
        x={startX}
        y={startY + minSize[1] * 1.05}
        text={interConnectName}
        fontSize={font_size}
        fontFamily='Arial'
        fill='white'
      ></Text>
    )

    groupOfInterConnect.push(
      <Text
        key={'InterConnect-Text-' + uuidv4()}
        x={startX + minSize[0] * 1.25}
        y={startY + minSize[1] * 0.55}
        text={props.combiTable}
        fontSize={font_size}
        fontFamily='Arial'
        fill='white'
      ></Text>
    )

    groupOfInterConnect.push(
      <Circle
        key={'InterConnect-Circle-' + uuidv4()}
        x={startX + minSize[0] * 1.2}
        y={startY + minSize[1] * 0.15}
        radius={5}
        fill='white'
      ></Circle>
    )

    groupOfInterConnect.push(
      <Line
        key={'InterConnect-Line-' + uuidv4()}
        points={[
          startX + minSize[0] * 1.2,
          startY + minSize[1] * 0.15,
          startX + minSize[0] * 1.2,
          startY + minSize[1] * 0.45,
          startX + minSize[0] * 1.35,
          startY + minSize[1] * 0.55,
        ]}
        stroke='white'
        strokeWidth={stroke_Width}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    dispatch(
      setInterConnectData(
        [startX + minSize[0] * 1.2, startY + minSize[1] * 0.15],
        [startX + minSize[0] * 1.5, startY],
        minSize
      )
    )

    return groupOfInterConnect
  }

  return <Group>{[...DrawInverterCollection()]}</Group>
}

export default InterConnecter
