import React from 'react'
import { Line, Text, Arrow, Group, Rect } from 'react-konva'
import { v4 as uuidv4 } from 'uuid'
import { useSelector } from 'react-redux'

const MeterAllIn = props => {
  const groupOfMeterAllIn = []
  // const dispatch = useDispatch()
  const accessPort = useSelector(state => state.SLD.diagramMeterAccessAllIn)
  const width = useSelector(state => state.SLD.diagramWidth) * 0.8
  const height = width * (4 / 6)
  const unitHeight = height / 4
  const unitWidth = width / 6
  const startX = accessPort[0]
  const startY = accessPort[1]
  const drawMeter = () => {
    drawSwictchPort([startX, startY - 15], groupOfMeterAllIn)
    groupOfMeterAllIn.push(
      <Line
        key={'Meter-Line-' + uuidv4()}
        points={[startX, startY - 15, startX, startY - unitHeight * 0.25]}
        stroke='#7b7b85'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    drawMeterBox([startX, startY - unitHeight * 0.25], groupOfMeterAllIn)

    return groupOfMeterAllIn
  }

  const combiSelect = combiboxIe => {
    const standard = [32, 63, 80, 100, 125, 160, 225]
    for (let element = 0; element < standard.length; element++) {
      if (standard[element] > combiboxIe) return standard[element]
    }
  }

  const drawSwictchPort = (position, groupOfMeter) => {
    groupOfMeterAllIn.push(
      <Line
        key={'Meter-Line-' + uuidv4()}
        points={[position[0] - 2.5, position[1] - 4.5, position[0] + 2.5, position[1] + 0.5]}
        stroke='black'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfMeterAllIn.push(
      <Line
        key={'Meter-Line-' + uuidv4()}
        points={[position[0] + 2.5, position[1] - 4.5, position[0] - 2.5, position[1] + 0.5]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfMeter.push(
      <Text
        key={'Meter-Text-' + uuidv4()}
        x={position[0] + 15}
        y={position[1] - 4.5}
        text={combiSelect(props.combiboxIe) + 'A'}
        fontSize={unitHeight * 0.08 > 12 ? 12 : unitHeight * 0.08}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )

    groupOfMeterAllIn.push(
      <Line
        key={'Meter-Line-' + uuidv4()}
        points={[
          position[0] - 10,
          position[1] - 2.5,
          position[0],
          position[1] + 0.05 * unitHeight + 2.5,
        ]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfMeterAllIn.push(
      <Line
        key={'Meter-Line-' + uuidv4()}
        points={[
          position[0],
          position[1] + 0.05 * unitHeight + 2.5,
          position[0],
          position[1] + 0.05 * unitHeight + 10,
        ]}
        stroke='#7b7b85'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )
  }

  const drawMeterBox = (accessPort, groupOfMeter) => {
    groupOfMeter.push(
      <Rect
        key={'Meter-Rect-All' + uuidv4()}
        x={accessPort[0] - unitWidth * 0.1}
        y={accessPort[1] - unitHeight * 0.2}
        width={unitWidth * 0.2}
        height={unitHeight * 0.2}
        stroke='black'
        strokeWidth={2}
      ></Rect>
    )

    groupOfMeter.push(
      <Line
        key={'Meter-Line-All' + uuidv4()}
        points={[
          accessPort[0] - unitWidth * 0.1,
          accessPort[1] - unitHeight * 0.15,
          accessPort[0] + unitWidth * 0.1,
          accessPort[1] - unitHeight * 0.15,
        ]}
        stroke='#7b7b85'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfMeter.push(
      <Arrow
        key={'Meter-Line-All' + uuidv4()}
        points={[
          startX,
          accessPort[1] - unitHeight * 0.2,
          startX,
          accessPort[1] - unitHeight * 0.35,
        ]}
        pointerLength={5}
        pointerWidth={5}
        stroke='black'
        strokeWidth={1}
      ></Arrow>
    )

    groupOfMeter.push(
      <Text
        key={'Meter-Text-All' + uuidv4()}
        x={accessPort[0] - unitWidth * 0.1 + 5}
        y={accessPort[1] - unitHeight * 0.1}
        text={' Wh'}
        fontSize={unitHeight * 0.08 > 15 ? 15 : unitHeight * 0.08}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )

    const font = unitHeight * 0.08 > 16 ? 16 : unitHeight * 0.08
    groupOfMeter.push(
      <Text
        key={'Meter-Text-All' + uuidv4()}
        x={accessPort[0] + unitWidth * 0.1 + 5}
        y={accessPort[1] - unitHeight * 0.2}
        text={' METER'}
        fontSize={font}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )

    groupOfMeter.push(
      <Text
        key={'Meter-Text-All' + uuidv4()}
        x={startX - unitWidth * 0.1}
        y={accessPort[1] - unitHeight * 0.35 - font}
        text={' 公用电网'}
        fontSize={font}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )
  }

  return <Group>{[...drawMeter()]}</Group>
}

export default MeterAllIn
