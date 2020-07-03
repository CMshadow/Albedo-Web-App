import React from 'react'
import {v4 as uuidv4} from 'uuid'
import {Rect, Line, Group, Text, Circle} from "react-konva"
import {useSelector, useDispatch } from 'react-redux'
import {setDiagramHeight} from '../../../store/action/index'


const ComponentTable = (props) => {
  const dispatch = useDispatch()
  const groupOfTable = []
  const width = useSelector(state => state.SLD.diagramWidth)
  const height = useSelector(state => state.SLD.diagramHeight)
  const numOfpvArray = props.allPVArray.length
  const numOfInverter = props.numOfInv
  const boundaryWidth = width * 0.8 > 800 ? width * 0.8: 800
  const boundaryHeight = numOfpvArray > 0 ? 
    numOfpvArray  * 40 + 50 + boundaryWidth * 0.04 : 
    50 + boundaryWidth * 0.04
  
  const offset = (boundaryWidth * 4/6 + 100) * (props.index - 1)
  const startPosition = [width * 0.1, height * 0.1 + offset]
  const headerFont= boundaryWidth * 0.03 > 16 ? 16 : boundaryWidth * 0.03
  const bodyFont = 12


  const DrawBasicCompomentTable = () => {
    drawBasicTable(startPosition)
    drawComponentTable([startPosition[0], 
      startPosition[1] + boundaryHeight + 100])
    drawInverterTable([startPosition[0], 
      startPosition[1] + (boundaryHeight + 100) * 2])
    drawCombiBoxTable([startPosition[0], 
      startPosition[1] + (boundaryHeight + 100) * 3])
    
    dispatch(setDiagramHeight(startPosition[1] + (boundaryHeight + 100) * 3 + 300))
    return groupOfTable 
  }
  
  const drawBasicTable = (position) => {
    groupOfTable.push(<Rect
      key= {"ComponentTable-Rect-" + uuidv4()}
      x={position[0]}
      y={position[1]}
      width={boundaryWidth}
      height={boundaryHeight}
      stroke='black'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)

    groupOfTable.push(<Rect
      key= {"ComponentTable-Rect-" + uuidv4()}
      x={position[0] + boundaryWidth * 0.01}
      y={position[1] + boundaryWidth * 0.03}
      width={boundaryWidth * 0.98}
      height={boundaryHeight - boundaryWidth * 0.04}
      stroke='black'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)

    groupOfTable.push(<Text
      key = {"CompTable-Text-" + uuidv4()}
      x={position[0] + boundaryWidth * 0.01}
      y={position[1] + boundaryWidth * 0.01}
      text={ "附表1： 组件参数表"}
      fontSize={headerFont}
      fontFamily='Arial'
      fill='Black'
    ></Text>)

    groupOfTable.push(<Line 
      key= {"CompoTable-Line-" + uuidv4()}
      points={[position[0] + boundaryWidth * 0.01,
      position[1] + boundaryWidth * 0.03 + 50,
      position[0] + boundaryWidth * 0.99,
      position[1] + boundaryWidth * 0.03 + 50]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    const unitRow = boundaryWidth * 0.98 / 7

    for (let index = 1; index <= 6; index++) {
      groupOfTable.push(<Line 
        key= {"CompoTable-Line-" + uuidv4()}
        points={[position[0] + boundaryWidth * 0.01 + index * unitRow,
        position[1] + boundaryWidth * 0.03,
        position[0] + boundaryWidth * 0.01 + index * unitRow,
        position[1] + boundaryWidth * 0.03 + 50 + numOfpvArray * 40]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
        ></Line>)

        if (index === 1) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "组件型号"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'

          ></Text>)
        }

        if (index === 2) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "组件类型"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        if (index === 3) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "Voc"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        if (index === 4) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "Vmp"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        if (index === 5) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "Isc"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        if (index === 6) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "Imp"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
    }

    for (let i = 0; i < numOfpvArray; i++) {
      groupOfTable.push(<Line 
        key= {"CompoTable-Line-" + uuidv4()}
        points={[position[0] + boundaryWidth * 0.01,
        position[1] + boundaryWidth * 0.03 + 40 * i + 50,
        position[0] + boundaryWidth * 0.99,
        position[1] + boundaryWidth * 0.03 + 40 * i + 50]}
        stroke='#7b7b85'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
        ></Line>)

      for (let j = 1; j <= 6; j++) {
        const pvName = props.allPVArray[i].pvName.length > (unitRow/bodyFont) * 1.5 ? 
        props.allPVArray[i].pvName.slice(0, (unitRow/bodyFont) * 1.5  - 1 ) : 
        props.allPVArray[i].pvName

        if (j === 1) 
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.01 + j * unitRow}
            y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
            text={ `  ${pvName} `}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)

        else if (j === 2) 
        groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={ `    ${props.allPVArray[i].siliconMaterial === "c-Si" 
          ? "单晶硅" : "多晶硅"} `}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>)

        else if (j === 3) 
          groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={ `    ${props.allPVArray[i].voc} `}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>)

        else if (j === 4) 
          groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={ `    ${props.allPVArray[i].vpm} `}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>)

        else if (j === 5) 
          groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={ `    ${props.allPVArray[i].isc} `}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>)

        else if (j === 6) 
          groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={`   ${props.allPVArray[i].ipm}`}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
          ></Text>)
        
      }

      groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={ `   光伏阵列 ${props.allPVArray[i].inverter_serial_number} `}
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
      ></Text>)

    }
  }

  const drawComponentTable = (position) => {
    groupOfTable.push(<Rect
      key= {"ComponentTable-Rect-" + uuidv4()}
      x={position[0]}
      y={position[1]}
      width={boundaryWidth}
      height={boundaryHeight}
      stroke='black'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)

    groupOfTable.push(<Rect
      key= {"ComponentTable-Rect-" + uuidv4()}
      x={position[0] + boundaryWidth * 0.01}
      y={position[1] + boundaryWidth * 0.03}
      width={boundaryWidth * 0.98}
      height={boundaryHeight - boundaryWidth * 0.04}
      stroke='black'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)

    groupOfTable.push(<Text
      key = {"CompTable-Text-" + uuidv4()}
      x={position[0] + boundaryWidth * 0.01}
      y={position[1] + boundaryWidth * 0.01}
      text={ "附表2： 直流接线表"}
      fontSize={headerFont}
      fontFamily='Arial'
      fill='Black'
    ></Text>)

    groupOfTable.push(<Line 
      key= {"CompoTable-Line-" + uuidv4()}
      points={[position[0] + boundaryWidth * 0.01,
      position[1] + boundaryWidth * 0.03 + 50,
      position[0] + boundaryWidth * 0.99,
      position[1] + boundaryWidth * 0.03 + 50]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    const unitRow = boundaryWidth * 0.98 / 7

    for (let index = 1; index <= 6; index++) {
      groupOfTable.push(<Line 
        key= {"CompoTable-Line-" + uuidv4()}
        points={[position[0] + boundaryWidth * 0.01 + index * unitRow,
        position[1] + boundaryWidth * 0.03,
        position[0] + boundaryWidth * 0.01 + index * unitRow,
        position[1] + boundaryWidth * 0.03 + 50 + numOfpvArray * 40]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
        ></Line>)

        if (index === 1) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "组件型号"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'

          ></Text>)
        }

        else if (index === 2) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "光伏组件数/组串"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        else if (index === 3) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "并联组串数"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        else if (index === 4) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "光伏组件数量"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        else if (index === 5) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "电缆类型"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        else if (index === 6) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "电缆芯数/截面积"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
      }
    }
    for (let i = 0; i < numOfpvArray; i++) {
      groupOfTable.push(<Line 
        key= {"CompoTable-Line-" + uuidv4()}
        points={[position[0] + boundaryWidth * 0.01,
        position[1] + boundaryWidth * 0.03 + 40 * i + 50,
        position[0] + boundaryWidth * 0.99,
        position[1] + boundaryWidth * 0.03 + 40 * i + 50]}
        stroke='#7b7b85'
        strokeWidth={0.5}
        lineCap='round'
        lineJoin='round'
        ></Line>)

      groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={ `   光伏阵列 ${props.allPVArray[i].inverter_serial_number} `}
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
      ></Text>)

      for (let j = 1; j <= 6; j++) {
        const pvName = props.allPVArray[i].pvName.length > (unitRow/bodyFont) * 1.5 ? 
        props.allPVArray[i].pvName.slice(0, (unitRow/bodyFont) * 1.5  - 1 ) : 
        props.allPVArray[i].pvName

        if (j === 1) 
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.01 + j * unitRow}
            y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
            text={ `  ${pvName} `}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)

        else if (j === 2) 
        groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={ `    ${props.allPVArray[i].string_per_inverter} `}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>)

        else if (j === 3) 
          groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={ `    ${props.allPVArray[i].panels_per_string} `}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>)

        else if (j === 4) 
          groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={ `    ${props.allPVArray[i].string_per_inverter * 
            props.allPVArray[i].panels_per_string} `}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>)

        else if (j === 5) 
          groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={ `    PV-F-1kV `}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>)

        else if (j === 6) 
          groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={`   ${props.dcData[i]}`}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
          ></Text>)
      }
    }
  }

  const drawInverterTable = (position) => {
    groupOfTable.push(<Rect
      key= {"ComponentTable-Rect-" + uuidv4()}
      x={position[0]}
      y={position[1]}
      width={boundaryWidth}
      height={boundaryHeight}
      stroke='black'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)

    groupOfTable.push(<Rect
      key= {"ComponentTable-Rect-" + uuidv4()}
      x={position[0] + boundaryWidth * 0.01}
      y={position[1] + boundaryWidth * 0.03}
      width={boundaryWidth * 0.98}
      height={boundaryHeight - boundaryWidth * 0.04}
      stroke='black'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)

    groupOfTable.push(<Text
      key = {"CompTable-Text-" + uuidv4()}
      x={position[0] + boundaryWidth * 0.01}
      y={position[1] + boundaryWidth * 0.01}
      text={ "附表3： 逆变器接线表"}
      fontSize={headerFont}
      fontFamily='Arial'
      fill='Black'
    ></Text>)

    groupOfTable.push(<Line 
      key= {"CompoTable-Line-" + uuidv4()}
      points={[position[0] + boundaryWidth * 0.01,
      position[1] + boundaryWidth * 0.03 + 50,
      position[0] + boundaryWidth * 0.99,
      position[1] + boundaryWidth * 0.03 + 50]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    const unitRow = boundaryWidth * 0.98 / 6

    for (let index = 1; index <= 5; index++) {
      groupOfTable.push(<Line 
        key= {"CompoTable-Line-" + uuidv4()}
        points={[position[0] + boundaryWidth * 0.01 + index * unitRow,
        position[1] + boundaryWidth * 0.03,
        position[0] + boundaryWidth * 0.01 + index * unitRow,
        position[1] + boundaryWidth * 0.03 + 50 + numOfpvArray * 40]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
        ></Line>)

        if (index === 1) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "逆变器型号"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'

          ></Text>)
        }

        else if (index === 2) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "额定输出功率(kW)"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        else if (index === 3) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "出口电缆类型"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        else if (index === 4) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "出口电缆型号"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        else if (index === 5) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "电缆芯数/截面积"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
      }
    }
    for (let i = 0; i < numOfInverter; i++) {
      groupOfTable.push(<Line 
        key= {"CompoTable-Line-" + uuidv4()}
        points={[position[0] + boundaryWidth * 0.01,
        position[1] + boundaryWidth * 0.03 + 40 * i + 50,
        position[0] + boundaryWidth * 0.99,
        position[1] + boundaryWidth * 0.03 + 40 * i + 50]}
        stroke='#7b7b85'
        strokeWidth={0.5}
        lineCap='round'
        lineJoin='round'
        ></Line>)

      groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={ `   逆变器 ${props.allPVArray[i].inverter_serial_number} `}
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
      ></Text>)


    for (let j = 1; j <= 6; j++) {
      const pvName = props.allPVArray[i].pvName.length > (unitRow/bodyFont) * 1.5 ? 
      props.allPVArray[i].pvName.slice(0, (unitRow/bodyFont) * 1.5  - 1 ) : 
      props.allPVArray[i].pvName

      if (j === 1) 
        groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={ `  ${props.allPVArray[i].inverterName} `}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>)

      else if (j === 2) 
      groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01 + j * unitRow}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={ `    ${props.allPVArray[i].paco} `}
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
      ></Text>)

      else if (j === 3) 
        groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01 + j * unitRow}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={ `    低压电缆 `}
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
      ></Text>)

      else if (j === 4) 
        groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01 + j * unitRow}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={ `    ZRC-YJY23-0.6/1kV `}
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
      ></Text>)

      else if (j === 5) 
        groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01 + j * unitRow}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={`   ${props.acData[i]}`}
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
        ></Text>)
      }
    }
  }

  const drawCombiBoxTable = (position) => {
    groupOfTable.push(<Rect
      key= {"ComponentTable-Rect-" + uuidv4()}
      x={position[0]}
      y={position[1]}
      width={boundaryWidth}
      height={90 + boundaryWidth * 0.04}
      stroke='black'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)

    groupOfTable.push(<Rect
      key= {"ComponentTable-Rect-" + uuidv4()}
      x={position[0] + boundaryWidth * 0.01}
      y={position[1] + boundaryWidth * 0.03}
      width={boundaryWidth * 0.98}
      height={90}
      stroke='black'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)

    groupOfTable.push(<Text
      key = {"CompTable-Text-" + uuidv4()}
      x={position[0] + boundaryWidth * 0.01}
      y={position[1] + boundaryWidth * 0.01}
      text={ "附表4： 汇流箱接线表"}
      fontSize={headerFont}
      fontFamily='Arial'
      fill='Black'
    ></Text>)

    groupOfTable.push(<Line 
      key= {"CompoTable-Line-" + uuidv4()}
      points={[position[0] + boundaryWidth * 0.01,
      position[1] + boundaryWidth * 0.03 + 50,
      position[0] + boundaryWidth * 0.99,
      position[1] + boundaryWidth * 0.03 + 50]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    const unitRow = boundaryWidth * 0.98 / 5
    for (let index = 1; index <= 4; index++) {
      groupOfTable.push(<Line 
        key= {"CompoTable-Line-" + uuidv4()}
        points={[position[0] + boundaryWidth * 0.01 + index * unitRow,
        position[1] + boundaryWidth * 0.03,
        position[0] + boundaryWidth * 0.01 + index * unitRow,
        position[1] + boundaryWidth * 0.03 + 90]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
        ></Line>)

        if (index === 1) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "汇流箱型号"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'

          ></Text>)
        }

        else if (index === 2) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "出口电缆类型"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        else if (index === 3) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "出口电缆型号"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
        }
        else if (index === 4) {
          groupOfTable.push(<Text
            key = {"CompTable-Text-" + uuidv4()}
            x={position[0] + boundaryWidth * 0.02 + index * unitRow}
            y={position[1] + boundaryWidth * 0.04}
            text={ "电缆芯数/截面积"}
            fontSize={bodyFont}
            fontFamily='Arial'
            fill='black'
          ></Text>)
      }
    }
    for (let i = 0; i < 1; i++) {
      groupOfTable.push(<Line 
        key= {"CompoTable-Line-" + uuidv4()}
        points={[position[0] + boundaryWidth * 0.01,
        position[1] + boundaryWidth * 0.03 + 40 * i + 50,
        position[0] + boundaryWidth * 0.99,
        position[1] + boundaryWidth * 0.03 + 40 * i + 50]}
        stroke='#7b7b85'
        strokeWidth={0.5}
        lineCap='round'
        lineJoin='round'
        ></Line>)

      groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={ "   汇流箱" } 
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
      ></Text>)


    for (let j = 1; j <= 5; j++) {
      if (j === 1) 
        groupOfTable.push(<Text
          key = {"CompTable-Text-" + uuidv4()}
          x={position[0] + boundaryWidth * 0.01 + j * unitRow}
          y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
          text={ `  ${props.combiboxName} `}
          fontSize={bodyFont}
          fontFamily='Arial'
          fill='black'
        ></Text>)

      else if (j === 2) 
        groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01 + j * unitRow}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={ `    低压电缆 `}
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
      ></Text>)

      else if (j === 3) 
        groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01 + j * unitRow}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={ `    ZRC-YJY23-0.6/1kV `}
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
      ></Text>)

      else if (j === 4) 
        groupOfTable.push(<Text
        key = {"CompTable-Text-" + uuidv4()}
        x={position[0] + boundaryWidth * 0.01 + j * unitRow}
        y={position[1] + boundaryWidth * 0.03 + 40 * i + 60}
        text={ `    ${props.combiBox} `}
        fontSize={bodyFont}
        fontFamily='Arial'
        fill='black'
        ></Text>)
      }
    }
  }

  return(<Group>
    {[...DrawBasicCompomentTable()]}
  </Group>)
}

export default ComponentTable;