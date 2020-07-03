import React from "react";
import {v4 as uuidv4} from 'uuid'
import {Rect, Line, Group, Text, Image} from "react-konva"
import {useSelector, useDispatch } from 'react-redux'
import Logo from '../../../assets/logo.png'
import {setDiagramWidth, setStartPosition } from '../../../store/action/index'
import useImage from 'use-image';

const DiagramBoundary = (props) => {
  const [logo] = useImage(Logo)
  const dispatch = useDispatch()
  const groupOfBoundary = []
  const width = useSelector(state => state.SLD.diagramWidth)
  const height = useSelector(state => state.SLD.diagramHeight)
  const boundaryWidth = width * 0.8 > 800 ? width * 0.8: 800
  const boundaryHeight = boundaryWidth * (4/6)
  const offset = props.index === 1 ? 0 : boundaryHeight + 100
  const startPosition = [width * 0.1, height * 0.1 + offset]
  const unitHeight = boundaryHeight / 4 
  const unitWidth = boundaryWidth / 6
  const heightMark = ['A', 'B', 'C', 'D']
  const boundWidth = boundaryWidth * 17/18 - boundaryWidth * 0.01 //inner
  const combiBoxData = props.combiBox
  const numOfInverter = props.numOfInv
  const acData = props.acData.length > 0 ? props.acData : []
  const acDataSet = new Set(acData)
  const aggrePacpData = props.aggrePacpData
  const sortedPacoKeys = Object.keys(aggrePacpData).sort((a,b) => 
    aggrePacpData[a] > aggrePacpData[b] ? -1 : 1)
  const dcData = props.dcData.length > 0 ? props.dcData[0] : ''
  const dcDataSet = new Set(props.dcData)
  const allPVArray = props.allPVArray
  const pv_Cell = allPVArray[0].siliconMaterial === "c-Si" ? "单晶硅" : "多晶硅"
  const diagramType = props.index === 1 ? "(余电上网)" : "(全额上网)"
  const pvNames = allPVArray.map( i => i.pvName)
  const pvNameSet = new Set(pvNames)

  const DrawBoundary = () => {
    
    groupOfBoundary.push(<Rect
      key= {"Boundary-Rect-" + uuidv4()}
      x={startPosition[0]}
      y={startPosition[1]}
      width={boundaryWidth}
      height={boundaryHeight}
      stroke='black'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)

    drawInnerBound()
    drawIcon()
    drawDiagramShelf()
    if (props.index === 1) 
      dispatch(setStartPosition([startPosition[0] + boundaryWidth * 1 / 18,startPosition[1] + boundaryWidth * 0.01]))
    if (width * 0.8 < 800) {
      dispatch(setDiagramWidth(width * 0.4 + boundaryWidth))
    }
    return groupOfBoundary;
  }  
  const drawInnerBound = () => {
    for (let i = 0; i < 4; ++i) {
      groupOfBoundary.push(<Line 
        key= {"Boundary-Line-" + uuidv4()}
        points={[startPosition[0],
         startPosition[1] + i * unitHeight, 
         startPosition[0] + boundaryWidth,
         startPosition[1] + i * unitHeight]}
        stroke='#7b7b85'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      ></Line>
      )
      
      groupOfBoundary.push(<Text
        key = {"Boundary-Text-" + uuidv4()}
        x={startPosition[0] + unitWidth * 0.25}
        y={startPosition[1] + (i + 0.5) * unitHeight}
        text={heightMark[i]}
        fontSize={boundaryWidth * 0.01 > 16 ? 16 : boundaryWidth * 0.01}
        fontFamily='Arial'
        fill='Black'
      ></Text>)

      groupOfBoundary.push(<Text
        key = {"Boundary-Text-" + uuidv4()}
        x={startPosition[0] + boundaryWidth  - boundaryWidth * 0.01 + 2}
        y={startPosition[1] + (i + 0.5) * unitHeight}
        text={heightMark[i]}
        fontSize={boundaryWidth * 0.01 > 16 ? 16 : boundaryWidth * 0.01}
        fontFamily='Arial'
        fill='Black'
      ></Text>)
    }

    for (let index = 0; index < 6; index++) {
      groupOfBoundary.push(<Line 
        key= {"Boundary-Line-" + uuidv4()}
        points={[startPosition[0] + index * unitWidth,
         startPosition[1], 
         startPosition[0] + index * unitWidth,
         startPosition[1] + boundaryHeight]}
        stroke='#7b7b85'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
        ></Line>)

      groupOfBoundary.push(<Text
        key = {"Boundary-Text-" + uuidv4()}
        x={startPosition[0] + unitWidth * ( index + 0.5)}
        y={startPosition[1] + 1}
        text={index + 1}
        fontSize={boundaryWidth * 0.01 > 12 ? 12 : boundaryWidth * 0.01}
        fontFamily='Arial'
        fill='Black'
      ></Text>)

      groupOfBoundary.push(<Text
        key = {"Boundary-Text-" + uuidv4()}
        x={startPosition[0] + unitWidth * ( index + 0.5)}
        y={startPosition[1] + boundaryHeight - boundaryWidth * 0.01 + 1}
        text={index + 1}
        fontSize={boundaryWidth * 0.01 > 10 ? 10 : boundaryWidth * 0.01}
        fontFamily='Arial'
        fill='Black'
      ></Text>)
    }
    groupOfBoundary.push(<Rect
      key= {"Boundary-Rect-" + uuidv4()}
      x={startPosition[0] + boundaryWidth * 1 / 18}
      y={startPosition[1] + boundaryWidth * 0.01}
      width={boundWidth}
      height={boundaryHeight - boundaryWidth * 0.02}
      stroke='black'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)
  }
  const drawIcon = () => {
    const startX = startPosition[0] + boundaryWidth * 1 / 18 + boundWidth
    const startY = startPosition[1] + boundaryWidth * 0.01 + boundaryHeight - boundaryWidth * 0.02
    const iconWidth = -boundWidth * 0.416
    const iconHeight = -(boundaryHeight - boundaryWidth * 0.02) * 0.15
    groupOfBoundary.push(<Rect
      key= {"Boundary-Rect-" + uuidv4()}
      x={startX}
      y={startY}
      width={iconWidth}
      height={iconHeight}
      stroke='black'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      fill="white"
    ></Rect>)

    groupOfBoundary.push(<Line 
      key= {"Boundary-Line-" + uuidv4()}
      points={[startX + iconWidth * 0.6,
        startY + iconHeight,
        startX + iconWidth * 0.6,
        startY]}
      stroke='black'
      strokeWidth={1.5}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfBoundary.push(<Line 
      key= {"Boundary-Line-" + uuidv4()}
      points={[startX,
        startY + iconHeight * 0.7,
        startX + iconWidth * 0.6,
        startY + iconHeight * 0.7]}
      stroke='black'
      strokeWidth={1.5}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfBoundary.push(<Line 
      key= {"Boundary-Line-" + uuidv4()}
      points={[startX,
        startY + iconHeight * 0.15,
        startX + iconWidth * 0.6,
        startY + iconHeight * 0.15]}
      stroke='black'
      strokeWidth={1.5}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfBoundary.push(<Line 
      key= {"Boundary-Line-" + uuidv4()}
      points={[startX + iconWidth,
        startY + iconHeight * 0.5,
        startX + iconWidth * 0.6,
        startY + iconHeight * 0.5]}
      stroke='black'
      strokeWidth={1.5}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    const font = iconHeight * 0.1 > 18 ? 18 : iconHeight * 0.1
    groupOfBoundary.push(<Text
      key = {"Boundary-Text-" + uuidv4()}
      x={startX + iconWidth}
      y={startY + iconHeight * 0.2}
      text={"  Albedo Inc.对侵权保留追索权\n   版权所有(C):仅限本项目使用"}
      fontSize={font - 2}
      fontFamily='Arial'
      fill='Black'
    ></Text>)

    
    groupOfBoundary.push(<Text
      key = {"Boundary-Text-" + uuidv4()}
      x={startX + iconWidth * 0.6}
      y={startY + iconHeight * 0.7 + font}
      text={"   项目: " + props.projectData.projectTitle}
      fontSize={font}
      fontFamily='Arial'
      fill='Black'
    ></Text>)

    groupOfBoundary.push(<Text
      key = {"Boundary-Text-" + uuidv4()}
      x={startX + iconWidth * 0.6}
      y={startY + iconHeight * 0.4}
      text={"   屋顶光伏发电系统电气主接线图" + diagramType}
      fontSize={font}
      fontFamily='Arial'
      fill='Black'
    ></Text>)

    groupOfBoundary.push(<Image 
      x={startX + iconWidth * 0.9}
      y={startY + iconHeight * 0.95}
      width={-iconWidth * 0.2}
      height={-iconHeight * 0.35}
      image={logo}

    ></Image>)
  }
  const drawDiagramShelf = () => {
    let lastPosition = []
    const unitHeight = boundWidth * 0.7 / 8
    const font = unitHeight * 0.2 > 14 ? 14 : unitHeight * 0.2
    const heightOffSet = 10
    for (let index = 1; index < 7; index++) {
      groupOfBoundary.push(<Line 
        key= {"Boundary-Line-" + uuidv4()}
        points={[startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth,
         startPosition[1] + index * unitHeight, 
         startPosition[0] + boundaryWidth * 1 / 18 + 1.5 * unitWidth,
         startPosition[1] + index * unitHeight]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
        ></Line>)

        if (index === 1) {
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + heightOffSet}
            text={' 低压电缆'}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + font * 1.5 + heightOffSet}
            text={' 型号: ZRC-YJY23-0.6/1KV'}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + 3 * font + heightOffSet}
            text={' 芯数x截面: ' + combiBoxData}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
        } else if (index === 2) {
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + heightOffSet}
            text={' 交流汇流箱: '}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight+ 1.5 * font + heightOffSet}
            text={ ' ' + numOfInverter + ' in 1,  1台'}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
        } 
        else if (index === 3) {
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + heightOffSet}
            text={' 低压电缆'}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + font * 1.5 + heightOffSet}
            text={' 型号: ZRC-YJY23-0.6/1KV'}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)

          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + 3 * font + heightOffSet}
            text={` 芯数x截面: ${acData[0]} ${acDataSet.size > 1 ? ", ..." : ''}`}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
         
        } else if (index === 4) {
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + heightOffSet}
            text={`  ${sortedPacoKeys[0]} kW 组串式逆变器${Object.keys(aggrePacpData).length > 1 ? ', ...' : '' } `}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)

          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + 1.5 * font + heightOffSet}
            text={`  ${aggrePacpData[sortedPacoKeys[0]]} 台, ${Object.keys(aggrePacpData).length > 1 ? ', ...' : '' } `}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          
        } else if (index === 5) {
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + heightOffSet}
            text={' 光伏专用电缆 '}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + 1.5 * font + heightOffSet}
            text={' 型号: PV-F-1kV'}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + 3 * font + heightOffSet}
            text={ ` 芯数x截面: ${dcData} ${ dcDataSet.size > 1 ? ", ..." : ''}`}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
        } else {
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + heightOffSet}
            text={ ` ${pv_Cell}电池组件  ${allPVArray[0].pmax}W${pvNameSet.size > 1 ? ", ..." : '' }`}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + font + heightOffSet}
            text={' Voc: '+ allPVArray[0].voc + 'V'}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + 2 * font + heightOffSet}
            text={' Vpm: ' + allPVArray[0].vpm + 'V'}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + 3 * font + heightOffSet}
            text={' Isc: ' + allPVArray[0].isc + 'A'}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + 4 * font + heightOffSet}
            text={' Ipm: ' + allPVArray[0].ipm + 'A'}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + 5.3 * font + heightOffSet}
            text={' 光伏组件数量(块): ' + allPVArray[0].string_per_inverter *   allPVArray[0].panels_per_string + " (子阵列: 1)"}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
          groupOfBoundary.push(<Text
            key = {"Boundary-Text-" + uuidv4()}
            x={startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth}
            y={startPosition[1] + index * unitHeight + 6.5 * font + heightOffSet}
            text={' 组串数量(串): ' + allPVArray[0].string_per_inverter}
            fontSize={font}
            fontFamily='Arial'
            fill='Black'
          ></Text>)
        }
      
      const connectHeight = index === 6 ? unitHeight * 0.7 : 0
      groupOfBoundary.push(<Line 
        key= {"Boundary-Line-" + uuidv4()}
        points={[startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth,
          startPosition[1] + index * unitHeight, 
          startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth,
          startPosition[1] + (index + 1) * unitHeight + connectHeight]}
        stroke='#7b7b85'
        strokeWidth={2}
        lineCap='round'
        lineJoin='round'
        ></Line>)
        lastPosition = [startPosition[0] + boundaryWidth * 1 / 18 + 0.5 * unitWidth, startPosition[1] + (index + 1) * unitHeight + connectHeight]
    }
    groupOfBoundary.push(<Line 
      key= {"Boundary-Line-" + uuidv4()}
      points={[lastPosition[0],
        lastPosition[1], 
        lastPosition[0] + unitWidth,
        lastPosition[1]]}
      stroke='black'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)
  }



  return(
    <Group>
      {[...DrawBoundary()]}
    </Group>
  );
}


export default DiagramBoundary