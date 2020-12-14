import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Rect, Line, Group, Text } from 'react-konva'
import { useSelector, useDispatch } from 'react-redux'
import { setDiagramHeight } from '../../../store/action/index'

const ComponentTable = props => {
  const dispatch = useDispatch()
  const groupOfTable = []
  const width = useSelector(state => state.SLD.diagramWidth)
  const allPVArray = props.allPVArray
  const numOfRoofTop = new Set(allPVArray.map(index => index.inverter_serial_number[0])).size

  const numOfpvArray = allPVArray.length
  const boundaryWidth = width * 0.8 > 800 ? width * 0.8 : 800
  const boundaryHeight =
    numOfpvArray > 0
      ? (numOfpvArray + numOfRoofTop) * 40 + 50 + boundaryWidth * 0.04
      : 50 + boundaryWidth * 0.04

  const offset = ((boundaryWidth * 4) / 6 + 100) * (props.index - 1)
  const startPosition = [width * 0.1, 100 + offset]
  const headerFont = boundaryWidth * 0.03 > 16 ? 16 : boundaryWidth * 0.03
  const bodyFont = 12
  const sortedArray = new Map()
  const pvArray = allPVArray.map(index => [index.inverter_serial_number[0], index])

  const sortPVArray = PV => {
    PV.forEach(element => {
      if (sortedArray.has(element[0])) sortedArray.get(element[0]).push(element[1])
      else {
        sortedArray.set(element[0], [element[1]])
      }
    })
  }

  const filterDCType = dcArray => {
    const dcSet = new Set(dcArray)
    return Array.from(dcSet)
  }

  const DrawBasicCompomentTable = () => {
    sortPVArray(pvArray)
    drawBasicTable(startPosition, sortedArray)
    drawComponentTable([startPosition[0], startPosition[1] + boundaryHeight + 100], sortedArray)
    drawInverterTable(
      [startPosition[0], startPosition[1] + (boundaryHeight + 100) * 2],
      sortedArray
    )
    drawCombiBoxTable([startPosition[0], startPosition[1] + (boundaryHeight + 100) * 3])

    dispatch(setDiagramHeight(startPosition[1] + (boundaryHeight + 100) * 3 + 300))
    return groupOfTable
  }

  const drawBasicTable = (position, pvArray) => {
    groupOfTable.push(
      <Rect
        key={'ComponentTable-Rect-' + uuidv4()}
        x={position[0]}
        y={position[1]}
        width={boundaryWidth}
        height={boundaryHeight}
        stroke='black'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
        fill='white'
      ></Rect>
    )

    groupOfTable.push(
      <Rect
        key={'ComponentTable-Rect-' + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.03}
        width={boundaryWidth * 0.98}
        height={boundaryHeight - boundaryWidth * 0.04}
        stroke='black'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
        fill='white'
      ></Rect>
    )

    groupOfTable.push(
      <Text
        key={'CompTable-Text-' + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.01}
        text={'附表1： 组件参数表'}
        fontSize={headerFont}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )

    groupOfTable.push(
      <Line
        key={'CompoTable-Line-' + uuidv4()}
        points={[
          position[0] + boundaryWidth * 0.01,
          position[1] + boundaryWidth * 0.03 + 50,
          position[0] + boundaryWidth * 0.99,
          position[1] + boundaryWidth * 0.03 + 50,
        ]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    const unitRow = (boundaryWidth * 0.98) / 7

    for (let index = 1; index <= 6; index++) {
      groupOfTable.push(
        <Line
          key={'CompoTable-Line-' + uuidv4()}
          points={[
            position[0] + boundaryWidth * 0.01 + index * unitRow,
            position[1] + boundaryWidth * 0.03,
            position[0] + boundaryWidth * 0.01 + index * unitRow,
            position[1] + boundaryWidth * 0.03 + 50,
          ]}
          stroke='#7b7b85'
          strokeWidth={2}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      if (index === 1) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'组件型号'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }

      if (index === 2) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'组件类型'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }
      if (index === 3) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'Voc'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }
      if (index === 4) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'Vmp'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }
      if (index === 5) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'Isc'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }
      if (index === 6) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'Imp'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }
    }
    let rowCount = 0
    Array.from(pvArray).forEach((element, index) => {
      const numRows = element[1].length + 1
      drawSingleRowBlock(
        [
          position[0] + boundaryWidth * 0.01,
          position[1] + boundaryWidth * 0.03 + (rowCount + 1) * 40,
        ],
        numRows,
        unitRow,
        element[0],
        element[1],
        1
      )
      rowCount += numRows
    })
  }

  const drawComponentTable = (position, pvArray) => {
    groupOfTable.push(
      <Rect
        key={'ComponentTable-Rect-' + uuidv4()}
        x={position[0]}
        y={position[1]}
        width={boundaryWidth}
        height={boundaryHeight}
        stroke='black'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
        fill='white'
      ></Rect>
    )

    groupOfTable.push(
      <Rect
        key={'ComponentTable-Rect-' + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.03}
        width={boundaryWidth * 0.98}
        height={boundaryHeight - boundaryWidth * 0.04}
        stroke='black'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
        fill='white'
      ></Rect>
    )

    groupOfTable.push(
      <Text
        key={'CompTable-Text-' + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.01}
        text={'附表2： 直流接线表'}
        fontSize={headerFont}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )

    groupOfTable.push(
      <Line
        key={'CompoTable-Line-' + uuidv4()}
        points={[
          position[0] + boundaryWidth * 0.01,
          position[1] + boundaryWidth * 0.03 + 50,
          position[0] + boundaryWidth * 0.99,
          position[1] + boundaryWidth * 0.03 + 50,
        ]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    const unitRow = (boundaryWidth * 0.98) / 7

    for (let index = 1; index <= 6; index++) {
      groupOfTable.push(
        <Line
          key={'CompoTable-Line-' + uuidv4()}
          points={[
            position[0] + boundaryWidth * 0.01 + index * unitRow,
            position[1] + boundaryWidth * 0.03,
            position[0] + boundaryWidth * 0.01 + index * unitRow,
            position[1] + boundaryWidth * 0.03 + 50,
          ]}
          stroke='#7b7b85'
          strokeWidth={2}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      if (index === 1) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'组件型号'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 2) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'并联组串数'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 3) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'光伏组件数/组串'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 4) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'光伏组件数量'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 5) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'电缆类型'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 6) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'电缆芯数/截面积'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }
    }
    for (let i = 0; i < numOfpvArray; i++) {
      groupOfTable.push(
        <Line
          key={'CompoTable-Line-' + uuidv4()}
          points={[
            position[0] + boundaryWidth * 0.01,
            position[1] + boundaryWidth * 0.03 + 40 * i + 50,
            position[0] + boundaryWidth * 0.99,
            position[1] + boundaryWidth * 0.03 + 40 * i + 50,
          ]}
          stroke='#7b7b85'
          strokeWidth={0.5}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )
    }

    let rowCount = 0
    Array.from(pvArray).forEach((element, index) => {
      const numRows = element[1].length + 1
      drawSingleRowBlock(
        [
          position[0] + boundaryWidth * 0.01,
          position[1] + boundaryWidth * 0.03 + (rowCount + 1) * 40,
        ],
        numRows,
        unitRow,
        element[0],
        element[1],
        2
      )
      rowCount += numRows
    })
  }

  const drawInverterTable = (position, pvArray) => {
    groupOfTable.push(
      <Rect
        key={'ComponentTable-Rect-' + uuidv4()}
        x={position[0]}
        y={position[1]}
        width={boundaryWidth}
        height={boundaryHeight}
        stroke='black'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
        fill='white'
      ></Rect>
    )

    groupOfTable.push(
      <Rect
        key={'ComponentTable-Rect-' + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.03}
        width={boundaryWidth * 0.98}
        height={boundaryHeight - boundaryWidth * 0.04}
        stroke='black'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
        fill='white'
      ></Rect>
    )

    groupOfTable.push(
      <Text
        key={'CompTable-Text-' + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.01}
        text={'附表3： 逆变器接线表'}
        fontSize={headerFont}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )

    groupOfTable.push(
      <Line
        key={'CompoTable-Line-' + uuidv4()}
        points={[
          position[0] + boundaryWidth * 0.01,
          position[1] + boundaryWidth * 0.03 + 50,
          position[0] + boundaryWidth * 0.99,
          position[1] + boundaryWidth * 0.03 + 50,
        ]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    const unitRow = (boundaryWidth * 0.98) / 6

    for (let index = 1; index <= 5; index++) {
      groupOfTable.push(
        <Line
          key={'CompoTable-Line-' + uuidv4()}
          points={[
            position[0] + boundaryWidth * 0.01 + index * unitRow,
            position[1] + boundaryWidth * 0.03,
            position[0] + boundaryWidth * 0.01 + index * unitRow,
            position[1] + boundaryWidth * 0.03 + 50,
          ]}
          stroke='#7b7b85'
          strokeWidth={2}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      if (index === 1) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'逆变器型号'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 2) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'额定输出功率(kW)'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 3) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'出口电缆类型'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 4) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'出口电缆型号'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 5) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'电缆芯数/截面积'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }
    }
    let rowCount = 0
    Array.from(pvArray).forEach((element, index) => {
      const numRows = element[1].length + 1
      drawInverterRowBlock(
        [
          position[0] + boundaryWidth * 0.01,
          position[1] + boundaryWidth * 0.03 + (rowCount + 1) * 40,
        ],
        numRows,
        unitRow,
        element[0],
        element[1],
        2
      )
      rowCount += numRows
    })
  }

  const drawCombiBoxTable = position => {
    groupOfTable.push(
      <Rect
        key={'ComponentTable-Rect-' + uuidv4()}
        x={position[0]}
        y={position[1]}
        width={boundaryWidth}
        height={90 + boundaryWidth * 0.04}
        stroke='black'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
        fill='white'
      ></Rect>
    )

    groupOfTable.push(
      <Rect
        key={'ComponentTable-Rect-' + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.03}
        width={boundaryWidth * 0.98}
        height={90}
        stroke='black'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
        fill='white'
      ></Rect>
    )

    groupOfTable.push(
      <Text
        key={'CompTable-Text-' + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.01}
        text={'附表4： 汇流箱接线表'}
        fontSize={headerFont}
        fontFamily='Arial'
        fill='Black'
      ></Text>
    )

    groupOfTable.push(
      <Line
        key={'CompoTable-Line-' + uuidv4()}
        points={[
          position[0] + boundaryWidth * 0.01,
          position[1] + boundaryWidth * 0.03 + 50,
          position[0] + boundaryWidth * 0.99,
          position[1] + boundaryWidth * 0.03 + 50,
        ]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
      ></Line>
    )

    const unitRow = (boundaryWidth * 0.98) / 5
    for (let index = 1; index <= 4; index++) {
      groupOfTable.push(
        <Line
          key={'CompoTable-Line-' + uuidv4()}
          points={[
            position[0] + boundaryWidth * 0.01 + index * unitRow,
            position[1] + boundaryWidth * 0.03,
            position[0] + boundaryWidth * 0.01 + index * unitRow,
            position[1] + boundaryWidth * 0.03 + 90,
          ]}
          stroke='#7b7b85'
          strokeWidth={2}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      if (index === 1) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'汇流箱型号'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 2) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'出口电缆类型'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 3) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'出口电缆型号'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      } else if (index === 4) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={'电缆芯数/截面积'}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }
    }
    for (let i = 0; i < 1; i++) {
      groupOfTable.push(
        <Line
          key={'CompoTable-Line-' + uuidv4()}
          points={[
            position[0] + boundaryWidth * 0.01,
            position[1] + boundaryWidth * 0.03 + 40 * i + 50,
            position[0] + boundaryWidth * 0.99,
            position[1] + boundaryWidth * 0.03 + 40 * i + 50,
          ]}
          stroke='#7b7b85'
          strokeWidth={0.5}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      groupOfTable.push(
        <Text
          key={'CompTable-Text-' + uuidv4()}
          x={position[0] + boundaryWidth * 0.01}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={'   汇流箱'}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>
      )

      for (let j = 1; j <= 5; j++) {
        if (j === 1)
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + boundaryWidth * 0.01 + j * unitRow}
              y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
              text={`  ${props.combiboxName} `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        else if (j === 2)
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + boundaryWidth * 0.01 + j * unitRow}
              y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
              text={`    低压电缆 `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        else if (j === 3)
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + boundaryWidth * 0.01 + j * unitRow}
              y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
              text={`    ZRC-YJY23-0.6/1kV `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        else if (j === 4)
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + boundaryWidth * 0.01 + j * unitRow}
              y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
              text={`    ${props.combiBox} `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
      }
    }
  }

  const drawSingleRowBlock = (position, numOfRow, unitRow, blockIndex, blockData, table) => {
    for (let i = 0; i < numOfRow; ++i) {
      if (i === 0) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + unitRow * 3.45}
            y={position[1] + 20}
            text={`   屋面${blockIndex} `}
            fontSize={bodyFont + 2}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }
      if (i !== 0) {
        for (let j = 1; j <= 6; j++) {
          groupOfTable.push(
            <Line
              key={'CompoTable-Line-' + uuidv4()}
              points={[
                position[0] + j * unitRow,
                position[1] + 40 * i + 50,
                position[0] + j * unitRow,
                position[1] + 40 * (i - 1) + 50,
              ]}
              stroke='#7b7b85'
              strokeWidth={2}
              lineCap='round'
              lineJoin='round'
            ></Line>
          )
        }
      }
      groupOfTable.push(
        <Line
          key={'CompoTable-Line-' + uuidv4()}
          points={[
            position[0],
            position[1] + 40 * i + 50,
            position[0] + boundaryWidth * 0.98,
            position[1] + 40 * i + 50,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      for (let j = 0; j <= 6; j++) {
        if (j === 0 && i < numOfRow - 1) {
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    光伏子阵列 ${blockData[i].inverter_serial_number}  `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        } else if (j === 1 && i < numOfRow - 1) {
          const pvName =
            blockData[i].pvName.length > (unitRow / bodyFont) * 1.5
              ? blockData[i].pvName.slice(0, (unitRow / bodyFont) * 1.5 - 1)
              : blockData[i].pvName
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`  ${pvName} `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        } else if (j === 2 && i < numOfRow - 1) {
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    ${
                table === 1
                  ? blockData[i].siliconMaterial === 'c-Si'
                    ? '单晶硅'
                    : '多晶硅'
                  : blockData[i].string_per_inverter
              } `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        } else if (j === 3 && i < numOfRow - 1) {
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    ${table === 1 ? blockData[i].voc : blockData[i].panels_per_string} `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        } else if (j === 4 && i < numOfRow - 1) {
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    ${
                table === 1
                  ? blockData[i].vpm
                  : blockData[i].panels_per_string * blockData[i].string_per_inverter
              }`}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        } else if (j === 5 && i < numOfRow - 1) {
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    ${table === 1 ? blockData[i].isc : 'PV-F-1kV'} `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        } else if (j === 6 && i < numOfRow - 1) {
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    ${
                table === 1 ? blockData[i].ipm : filterDCType(blockData[i].dcCableChoice)
              } `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        }
      }
    }
  }

  const drawInverterRowBlock = (position, numOfRow, unitRow, blockIndex, blockData, table) => {
    for (let i = 0; i < numOfRow; ++i) {
      if (i === 0) {
        groupOfTable.push(
          <Text
            key={'CompTable-Text-' + uuidv4()}
            x={position[0] + unitRow * 2.95}
            y={position[1] + 20}
            text={`   屋面${blockIndex} `}
            fontSize={bodyFont + 2}
            fontFamily='Arial'
            fill='black'
          ></Text>
        )
      }
      if (i !== 0) {
        for (let j = 1; j <= 6; j++) {
          groupOfTable.push(
            <Line
              key={'CompoTable-Line-' + uuidv4()}
              points={[
                position[0] + j * unitRow,
                position[1] + 40 * i + 50,
                position[0] + j * unitRow,
                position[1] + 40 * (i - 1) + 50,
              ]}
              stroke='#7b7b85'
              strokeWidth={2}
              lineCap='round'
              lineJoin='round'
            ></Line>
          )
        }
      }
      groupOfTable.push(
        <Line
          key={'CompoTable-Line-' + uuidv4()}
          points={[
            position[0],
            position[1] + 40 * i + 50,
            position[0] + boundaryWidth * 0.98,
            position[1] + 40 * i + 50,
          ]}
          stroke='black'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )

      for (let j = 0; j <= 6; j++) {
        if (j === 0 && i < numOfRow - 1)
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    逆变器 ${blockData[i].inverter_serial_number}  `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        else if (j === 1 && i < numOfRow - 1)
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`  ${blockData[i].inverterName} `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        else if (j === 2 && i < numOfRow - 1)
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    ${blockData[i].paco} `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        else if (j === 3 && i < numOfRow - 1)
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    低压电缆 `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        else if (j === 4 && i < numOfRow - 1)
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    ZRC-YJY23-0.6/1kV `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
        else if (j === 5 && i < numOfRow - 1)
          groupOfTable.push(
            <Text
              key={'CompTable-Text-' + uuidv4()}
              x={position[0] + j * unitRow}
              y={position[1] + 40 * i + 60}
              text={`    ${blockData[i].acCableChoice} `}
              fontSize={bodyFont}
              fontFamily='Arial'
              fill='black'
            ></Text>
          )
      }
    }
  }

  return <Group>{[...DrawBasicCompomentTable()]}</Group>
}

export default ComponentTable
