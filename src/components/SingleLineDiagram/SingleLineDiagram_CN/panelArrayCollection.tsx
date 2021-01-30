import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Rect, Line, Group, Text, Circle } from 'react-konva'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, IAllPVArray } from '../../../@types'
import { setMeterAccess, setMeterAccessAllIn } from '../../../store/action/index'

type TPanelArrayProps = {
  index: number
  combiboxIe: number
  acIe: number[]
  numOfInv: number
  allPVArray: IAllPVArray[]
}

const PanelArrayCollection: React.FC<TPanelArrayProps> = props => {
  const dispatch = useDispatch()
  const groupOfPvArray: React.ReactNode[] = []
  const width = useSelector((state: RootState) => state.SLD.diagramWidth) * 0.8
  const height = width * (4 / 6)
  const unitHeight = height / 4
  const unitWidth = width / 6
  const offset = props.index === 1 ? 0 : height + 100
  const numOfArrays = props.numOfInv > 5 ? 5 : props.numOfInv
  const trigger = props.numOfInv > 5 ? true : false
  const inverterWidth = unitWidth * 3.3
  const inverterAccessPorts = []
  const startPosition = useSelector((state: RootState) => state.SLD.diagramBoundaryPosition)
  startPosition[1] += offset
  const InvOffset = props.numOfInv === 1 ? -inverterWidth * 0.5 : 0

  const combiSelect = (combiboxIe: number): number => {
    const standard = [32, 63, 80, 100, 125, 160, 225]
    for (let element = 0; element < standard.length; element++) {
      if (standard[element] > combiboxIe) return standard[element]
    }
    return combiboxIe
  }

  const DrawPanelArray = () => {
    drawInverter()
    return groupOfPvArray
  }
  const drawInverter = () => {
    groupOfPvArray.push(
      <Rect
        key={'Boundary-Rect-' + uuidv4()}
        x={startPosition[0] + unitWidth * 2 - 0.5 * InvOffset}
        y={startPosition[1] + 1.2 * unitHeight}
        width={inverterWidth + InvOffset}
        height={0.4 * unitHeight}
        stroke='black'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
      ></Rect>
    )

    groupOfPvArray.push(
      <Line
        key={'Boundary-Line-' + uuidv4()}
        points={[
          startPosition[0] + unitWidth * 2.165 - InvOffset * 0.5,
          startPosition[1] + 1.4 * unitHeight,
          startPosition[0] + unitWidth * 5.135 + InvOffset * 0.5,
          startPosition[1] + 1.4 * unitHeight,
        ]}
        stroke='black'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    drawAccessPorts(numOfArrays)
  }

  const drawAccessPorts = (numOfArray: number) => {
    const offSet = numOfArray > 1 ? (unitWidth / numOfArray - 1) * (6 - numOfArrays) : 0

    const fixedOffset = unitWidth / 4
    const unitArrayWidth = (unitWidth * 2.97 - fixedOffset) / 4
    const unitPortWidth =
      numOfArray > 1
        ? (unitWidth * 2.97 - offSet) / (numOfArray - 1)
        : (unitWidth * 2.97 - offSet) / 2
    for (let index = 0; index < numOfArray; index++) {
      if (numOfArray === 1) index = 1
      groupOfPvArray.push(
        <Line
          key={'Boundary-Line-' + uuidv4()}
          points={[
            startPosition[0] + unitWidth * 2.165 + index * unitPortWidth + offSet * 0.5,
            startPosition[1] + 1.4 * unitHeight,
            startPosition[0] + unitWidth * 2.165 + index * unitPortWidth + offSet * 0.5,
            startPosition[1] + 1.4 * unitHeight + 10,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      groupOfPvArray.push(
        <Line
          key={'Boundary-Line-' + uuidv4()}
          points={[
            startPosition[0] + unitWidth * 2.165 + index * unitPortWidth + offSet * 0.5 - 2.5,
            startPosition[1] + 1.4 * unitHeight + 7.5,
            startPosition[0] + unitWidth * 2.165 + index * unitPortWidth + offSet * 0.5 + 2.5,
            startPosition[1] + 1.4 * unitHeight + 12.5,
          ]}
          stroke='black'
          strokeWidth={2}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      groupOfPvArray.push(
        <Line
          key={'Boundary-Line-' + uuidv4()}
          points={[
            startPosition[0] + unitWidth * 2.165 + index * unitPortWidth + offSet * 0.5 + 2.5,
            startPosition[1] + 1.4 * unitHeight + 7.5,
            startPosition[0] + unitWidth * 2.165 + index * unitPortWidth + offSet * 0.5 - 2.5,
            startPosition[1] + 1.4 * unitHeight + 12.5,
          ]}
          stroke='black'
          strokeWidth={2}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      const endPoint =
        startPosition[1] + 1.5 * unitHeight + 12.5 > startPosition[1] + 1.65 * unitHeight
          ? startPosition[1] + 1.4 * unitHeight + 20
          : startPosition[1] + 1.5 * unitHeight + 12.5

      groupOfPvArray.push(
        <Line
          key={'Boundary-Line-' + uuidv4()}
          points={[
            startPosition[0] + unitWidth * 2.165 + index * unitPortWidth + offSet * 0.5 - 10,
            startPosition[1] + 1.4 * unitHeight + 10,
            startPosition[0] + unitWidth * 2.165 + index * unitPortWidth + offSet * 0.5 + 2.5,
            endPoint,
          ]}
          stroke='black'
          strokeWidth={1.5}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      const currentACIe = numOfArray === 1 ? props.acIe[0] : props.acIe[index]
      groupOfPvArray.push(
        <Text
          key={'Meter-Text-' + uuidv4()}
          x={startPosition[0] + unitWidth * 2.165 + index * unitPortWidth + offSet * 0.5 + 10}
          y={startPosition[1] + 1.4 * unitHeight + 10}
          text={combiSelect(currentACIe) + 'A'}
          fontSize={unitHeight * 0.08 > 12 ? 12 : unitHeight * 0.08}
          fontFamily='Arial'
          fill='Black'
        ></Text>
      )

      inverterAccessPorts.push([index * unitPortWidth + offSet * 0.5 + 2.5, endPoint])

      drawSingleArray(
        [
          startPosition[0] + unitWidth * 2.165 + index * unitPortWidth + offSet * 0.5 + 2.5,
          endPoint,
        ],
        unitArrayWidth,
        index
      )

      if (trigger && index === 3) {
        groupOfPvArray.push(
          <Circle
            key={'PV-Circle-' + uuidv4()}
            x={startPosition[0] + unitWidth * 2.165 + 3.4 * unitPortWidth + offSet * 0.5 + 2.5}
            y={endPoint - unitHeight * 0.05}
            radius={2}
            fill='black'
          ></Circle>
        )
        groupOfPvArray.push(
          <Circle
            key={'PV-Circle-' + uuidv4()}
            x={startPosition[0] + unitWidth * 2.165 + 3.45 * unitPortWidth + offSet * 0.5 + 2.5}
            y={endPoint - unitHeight * 0.05}
            radius={2}
            fill='black'
          ></Circle>
        )
        groupOfPvArray.push(
          <Circle
            key={'PV-Circle-' + uuidv4()}
            x={startPosition[0] + unitWidth * 2.165 + 3.5 * unitPortWidth + offSet * 0.5 + 2.5}
            y={endPoint - unitHeight * 0.05}
            radius={2}
            fill='black'
          ></Circle>
        )

        groupOfPvArray.push(
          <Circle
            key={'PV-Circle-' + uuidv4()}
            x={startPosition[0] + unitWidth * 2.165 + 3.4 * unitPortWidth + offSet * 0.5 + 2.5}
            y={endPoint + unitHeight * 0.2}
            radius={2}
            fill='black'
          ></Circle>
        )
        groupOfPvArray.push(
          <Circle
            key={'PV-Circle-' + uuidv4()}
            x={startPosition[0] + unitWidth * 2.165 + 3.45 * unitPortWidth + offSet * 0.5 + 2.5}
            y={endPoint + unitHeight * 0.2}
            radius={2}
            fill='black'
          ></Circle>
        )
        groupOfPvArray.push(
          <Circle
            key={'PV-Circle-' + uuidv4()}
            x={startPosition[0] + unitWidth * 2.165 + 3.5 * unitPortWidth + offSet * 0.5 + 2.5}
            y={endPoint + unitHeight * 0.2}
            radius={2}
            fill='black'
          ></Circle>
        )
      }
    }

    groupOfPvArray.push(
      <Line
        key={'Boundary-Line-' + uuidv4()}
        points={[
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 1.2 * unitHeight,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 1.25 * unitHeight,
        ]}
        stroke='black'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfPvArray.push(
      <Line
        key={'Boundary-Line-' + uuidv4()}
        points={[
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5 - 2.5,
          startPosition[1] + 1.25 * unitHeight - 2.5,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5 + 2.5,
          startPosition[1] + 1.25 * unitHeight + 2.5,
        ]}
        stroke='black'
        strokeWidth={1.5}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfPvArray.push(
      <Line
        key={'Boundary-Line-' + uuidv4()}
        points={[
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5 + 2.5,
          startPosition[1] + 1.25 * unitHeight - 2.5,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5 - 2.5,
          startPosition[1] + 1.25 * unitHeight + 2.5,
        ]}
        stroke='black'
        strokeWidth={1.5}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfPvArray.push(
      <Line
        key={'Boundary-Line-' + uuidv4()}
        points={[
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5 - 10,
          startPosition[1] + 1.25 * unitHeight,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 1.35 * unitHeight,
        ]}
        stroke='black'
        strokeWidth={1.5}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfPvArray.push(
      <Text
        key={'Meter-Text-' + uuidv4()}
        x={startPosition[0] + unitWidth * 2 + inverterWidth * 0.5 + 10}
        y={startPosition[1] + 1.25 * unitHeight}
        text={combiSelect(props.combiboxIe) + 'A'}
        fontSize={unitHeight * 0.08 > 12 ? 12 : unitHeight * 0.08}
        fontFamily='Arial'
        fill='black'
      ></Text>
    )

    groupOfPvArray.push(
      <Line
        key={'Boundary-Line-' + uuidv4()}
        points={[
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 1.35 * unitHeight,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 1.4 * unitHeight,
        ]}
        stroke='black'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfPvArray.push(
      <Line
        key={'Boundary-Line-' + uuidv4()}
        points={[
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 1.2 * unitHeight,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 0.8 * unitHeight,
        ]}
        stroke='black'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfPvArray.push(
      <Line
        key={'Boundary-Line-' + uuidv4()}
        points={[
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 1.15 * unitHeight,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5 + 5,
          startPosition[1] + 1.15 * unitHeight,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 1.15 * unitHeight - 5,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5 - 5,
          startPosition[1] + 1.15 * unitHeight,
        ]}
        stroke='black'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
        closed={true}
      ></Line>
    )

    groupOfPvArray.push(
      <Line
        key={'Boundary-Line-Triangle' + uuidv4()}
        points={[
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 1 * unitHeight,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5 + 5,
          startPosition[1] + 1 * unitHeight - 5,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 1 * unitHeight - 5,
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5 - 5,
          startPosition[1] + 1 * unitHeight - 5,
        ]}
        stroke='black'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
        closed={true}
      ></Line>
    )
    if (props.index === 1) {
      dispatch(
        setMeterAccess([
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 0.8 * unitHeight,
        ])
      )
    } else if (props.index === 2) {
      dispatch(
        setMeterAccessAllIn([
          startPosition[0] + unitWidth * 2 + inverterWidth * 0.5,
          startPosition[1] + 0.8 * unitHeight,
        ])
      )
    }
  }

  const drawSingleArray = (startPoint: [number, number], unitW: number, index: number) => {
    if (numOfArrays === 1) index = 0
    if (index === 4 && trigger) index = numOfArrays
    const unitArrayWidth = unitW / 5
    groupOfPvArray.push(
      <Line
        key={'PV-Array-Line-' + uuidv4()}
        points={[startPoint[0], startPoint[1], startPoint[0], startPoint[1] + 0.3 * unitHeight]}
        stroke='black'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfPvArray.push(
      <Line
        key={'PV-Array-Line-' + uuidv4()}
        points={[
          startPoint[0],
          startPoint[1] + 0.05 * unitHeight + 5,
          startPoint[0] + 5,
          startPoint[1] + 0.05 * unitHeight + 5,
          startPoint[0],
          startPoint[1] + 0.1 * unitHeight + 5,
          startPoint[0] - 5,
          startPoint[1] + 0.05 * unitHeight + 5,
        ]}
        stroke='black'
        strokeWidth={1.5}
        lineCap='round'
        lineJoin='round'
        closed={true}
      ></Line>
    )

    groupOfPvArray.push(
      <Line
        key={'PV-Array-Line-' + uuidv4()}
        points={[
          startPoint[0],
          startPoint[1] + 0.25 * unitHeight,
          startPoint[0] + 5,
          startPoint[1] + 0.25 * unitHeight,
          startPoint[0],
          startPoint[1] + 0.2 * unitHeight,
          startPoint[0] - 5,
          startPoint[1] + 0.25 * unitHeight,
        ]}
        stroke='black'
        strokeWidth={1.5}
        lineCap='round'
        lineJoin='round'
        closed={true}
      ></Line>
    )

    groupOfPvArray.push(
      <Text
        key={'PV-Array-Text-' + uuidv4()}
        x={startPoint[0] - unitW * 0.4 + 2}
        y={startPoint[1] + 0.3 * unitHeight - 24}
        text={`${
          props.numOfInv > 5 && index === 4
            ? props.allPVArray[props.numOfInv - 1].inverter_serial_number
            : props.allPVArray[index].inverter_serial_number
        }`}
        fontSize={12}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )

    groupOfPvArray.push(
      <Rect
        key={'PV-Array-Rect-' + uuidv4()}
        x={startPoint[0] - unitW * 0.4}
        y={startPoint[1] + 0.3 * unitHeight}
        width={unitW * 0.8}
        height={0.2 * unitHeight}
        stroke='black'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
      ></Rect>
    )

    groupOfPvArray.push(
      <Line
        key={'PV-Array-Line-' + uuidv4()}
        points={[
          startPoint[0] + unitW * 0.4,
          startPoint[1] + 0.3 * unitHeight,
          startPoint[0] - unitW * 0.4,
          startPoint[1] + 0.5 * unitHeight,
        ]}
        stroke='black'
        strokeWidth={0.5}
        lineCap='round'
        lineJoin='round'
        closed={true}
      ></Line>
    )

    groupOfPvArray.push(
      <Text
        key={'PV-Array-Text-' + uuidv4()}
        x={startPoint[0] - unitW * 0.4 + 2}
        y={startPoint[1] + 0.3 * unitHeight}
        text={'AC'}
        fontSize={10}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )

    groupOfPvArray.push(
      <Text
        key={'PV-Array-Text-' + uuidv4()}
        x={startPoint[0] + unitW * 0.4 - 13}
        y={startPoint[1] + 0.5 * unitHeight - 8}
        text={'DC'}
        fontSize={8}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )

    const DCOffset = width === 800 ? 0 : (width / 800 - 1) * 12
    groupOfPvArray.push(
      <Line
        key={'PV-Array-Line-' + uuidv4()}
        points={[
          startPoint[0] + unitW * 0.3,
          startPoint[1] + 0.3 * unitHeight + 12 + DCOffset,
          startPoint[0] + 0.2 * unitW,
          startPoint[1] + 0.3 * unitHeight + 12 + DCOffset,
        ]}
        stroke='black'
        strokeWidth={0.5}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfPvArray.push(
      <Line
        key={'PV-Array-Line-' + uuidv4()}
        points={[
          startPoint[0] + unitW * 0.3,
          startPoint[1] + 0.3 * unitHeight + 15 + DCOffset,
          startPoint[0] + 0.2 * unitW,
          startPoint[1] + 0.3 * unitHeight + 15 + DCOffset,
        ]}
        stroke='black'
        strokeWidth={0.5}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    groupOfPvArray.push(
      <Line
        key={'PV-Array-Line-' + uuidv4()}
        points={[
          startPoint[0] - unitW * 0.4 + 5,
          startPoint[1] + 0.3 * unitHeight + 15,
          startPoint[0] - unitW * 0.35 + 5,
          startPoint[1] + 0.3 * unitHeight + 11,
          startPoint[0] - unitW * 0.25 + 5,
          startPoint[1] + 0.3 * unitHeight + 16,
          startPoint[0] - unitW * 0.2 + 5,
          startPoint[1] + 0.3 * unitHeight + 12,
        ]}
        stroke='black'
        strokeWidth={0.5}
        lineCap='round'
        lineJoin='round'
        tension={0.5}
      ></Line>
    )

    let offset = 5
    const string_per_inverter =
      props.allPVArray[index].string_per_inverter > 4
        ? 4
        : props.allPVArray[index].string_per_inverter
    for (let string = 0; string < string_per_inverter; string++) {
      offset = string_per_inverter > 3 ? 5 : (0.8 * unitW) / (string_per_inverter + 1)
      if (string === 3 && string_per_inverter > 3) offset = unitArrayWidth * 0.75

      groupOfPvArray.push(
        <Line
          key={'PV-Array-Line-' + uuidv4()}
          points={[
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 0.5 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 0.8 * unitHeight,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
          closed={true}
        ></Line>
      )

      groupOfPvArray.push(
        <Line
          key={'PV-Array-Line-' + uuidv4()}
          points={[
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 0.55 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset + 5,
            startPoint[1] + 0.55 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 0.6 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 5,
            startPoint[1] + 0.55 * unitHeight,
          ]}
          stroke='black'
          strokeWidth={1.5}
          lineCap='round'
          lineJoin='round'
          closed={true}
        ></Line>
      )

      groupOfPvArray.push(
        <Line
          key={'PV-Array-Line-' + uuidv4()}
          points={[
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 0.725 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset + 5,
            startPoint[1] + 0.725 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 0.675 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 5,
            startPoint[1] + 0.725 * unitHeight,
          ]}
          stroke='black'
          strokeWidth={1.5}
          lineCap='round'
          lineJoin='round'
          closed={true}
        ></Line>
      )

      groupOfPvArray.push(
        <Rect
          key={'PV-Array-Rect-' + uuidv4()}
          x={startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 5}
          y={startPoint[1] + 0.8 * unitHeight}
          width={10}
          height={0.2 * unitHeight}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
        ></Rect>
      )

      groupOfPvArray.push(
        <Line
          key={'PV-Array-Line-' + uuidv4()}
          points={[
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 5,
            startPoint[1] + 0.8 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 0.85 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset + 5,
            startPoint[1] + 0.8 * unitHeight,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
          closed={true}
        ></Line>
      )

      groupOfPvArray.push(
        <Text
          key={'PV-Array-Text-' + uuidv4()}
          x={startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 3}
          y={startPoint[1] + 0.86 * unitHeight}
          text={'1'}
          fontSize={12}
          fontFamily='Arial'
          fill='Black'
        ></Text>
      )

      groupOfPvArray.push(
        <Line
          key={'PV-Array-Line-' + uuidv4()}
          points={[
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 1.0 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 1.05 * unitHeight,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
          closed={true}
        ></Line>
      )

      groupOfPvArray.push(
        <Rect
          key={'PV-Array-Rect-' + uuidv4()}
          x={startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 5}
          y={startPoint[1] + 1.05 * unitHeight}
          width={10}
          height={0.2 * unitHeight}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
        ></Rect>
      )

      groupOfPvArray.push(
        <Line
          key={'PV-Array-Line-' + uuidv4()}
          points={[
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 5,
            startPoint[1] + 1.05 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 1.1 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset + 5,
            startPoint[1] + 1.05 * unitHeight,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
          closed={true}
        ></Line>
      )

      groupOfPvArray.push(
        <Text
          key={'PV-Array-Text-' + uuidv4()}
          x={startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 3}
          y={startPoint[1] + 1.15 * unitHeight}
          text={'2'}
          fontSize={12}
          fontFamily='Arial'
          fill='Black'
        ></Text>
      )

      groupOfPvArray.push(
        <Line
          key={'PV-Array-Line-' + uuidv4()}
          points={[
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 1.25 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 1.38 * unitHeight,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
          closed={true}
        ></Line>
      )

      groupOfPvArray.push(
        <Circle
          key={'PV-Circle-' + uuidv4()}
          x={startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 7}
          y={startPoint[1] + 1.29 * unitHeight}
          radius={1}
          fill='black'
        ></Circle>
      )
      groupOfPvArray.push(
        <Circle
          key={'PV-Circle-' + uuidv4()}
          x={startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 7}
          y={startPoint[1] + 1.31 * unitHeight}
          radius={1}
          fill='black'
        ></Circle>
      )
      groupOfPvArray.push(
        <Circle
          key={'PV-Circle-' + uuidv4()}
          x={startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 7}
          y={startPoint[1] + 1.33 * unitHeight}
          radius={1}
          fill='black'
        ></Circle>
      )

      groupOfPvArray.push(
        <Line
          key={'PV-Array-Line-' + uuidv4()}
          points={[
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 3,
            startPoint[1] + 1.3 * unitHeight + 5,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 1.3 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset + 3,
            startPoint[1] + 1.3 * unitHeight + 5,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )
      groupOfPvArray.push(
        <Line
          key={'PV-Array-Line-' + uuidv4()}
          points={[
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 3,
            startPoint[1] + 1.32 * unitHeight + 5,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 1.32 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset + 3,
            startPoint[1] + 1.32 * unitHeight + 5,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      groupOfPvArray.push(
        <Rect
          key={'PV-Array-Rect-' + uuidv4()}
          x={startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 5}
          y={startPoint[1] + 1.38 * unitHeight}
          width={10}
          height={0.2 * unitHeight}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
        ></Rect>
      )

      groupOfPvArray.push(
        <Line
          key={'PV-Array-Line-' + uuidv4()}
          points={[
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 5,
            startPoint[1] + 1.38 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset,
            startPoint[1] + 1.43 * unitHeight,
            startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset + 5,
            startPoint[1] + 1.38 * unitHeight,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
          closed={true}
        ></Line>
      )

      groupOfPvArray.push(
        <Text
          key={'PV-Array-Text-' + uuidv4()}
          x={startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 4}
          y={startPoint[1] + 1.44 * unitHeight}
          text={'N'}
          fontSize={11}
          fontFamily='Arial'
          fill='black'
        ></Text>
      )

      groupOfPvArray.push(
        <Text
          key={'PV-Array-Text-' + uuidv4()}
          x={startPoint[0] - 0.4 * unitW + string * unitArrayWidth + offset - 5}
          y={startPoint[1] + 1.6 * unitHeight}
          text={
            props.allPVArray[index].string_per_inverter > 4 && string === 3 ? 'N' : `${string + 1}`
          }
          fontSize={11}
          fontFamily='Arial'
          fill='black'
        ></Text>
      )

      if (props.allPVArray[index].string_per_inverter > 4 && string === 3) {
        groupOfPvArray.push(
          <Circle
            key={'PV-Circle-' + uuidv4()}
            x={startPoint[0] - 0.4 * unitW + 2.05 * unitArrayWidth + offset}
            y={startPoint[1] + 1.48 * unitHeight}
            radius={1}
            fill='black'
          ></Circle>
        )
        groupOfPvArray.push(
          <Circle
            key={'PV-Circle-' + uuidv4()}
            x={startPoint[0] - 0.4 * unitW + 2.15 * unitArrayWidth + offset}
            y={startPoint[1] + 1.48 * unitHeight}
            radius={1}
            fill='black'
          ></Circle>
        )
        groupOfPvArray.push(
          <Circle
            key={'PV-Circle-' + uuidv4()}
            x={startPoint[0] - 0.4 * unitW + 2.25 * unitArrayWidth + offset}
            y={startPoint[1] + 1.48 * unitHeight}
            radius={1}
            fill='black'
          ></Circle>
        )
      }
    }
  }

  return <Group>{[...DrawPanelArray()]}</Group>
}

export default PanelArrayCollection
