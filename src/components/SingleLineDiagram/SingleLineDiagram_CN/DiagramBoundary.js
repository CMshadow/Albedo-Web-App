import React from "react";
import {v4 as uuidv4} from 'uuid'
import {Rect, Line, Group, Text, Image} from "react-konva"
import {useSelector } from 'react-redux'
import logo from '../../../assets/logo.png'
// import useImage from 'use-image';

const DiagramBoundary = (params) => {
  const groupOfBoundary = []
  const width = useSelector(state => state.SLD.stageWidth)
  const height = useSelector(state => state.SLD.stageHeight)
  const startPosition = [width * 0.2, height * 0.1]
  const boundaryWidth = width * 0.6 > 600 ? width * 0.6
  : 600
  const boundaryHeight = boundaryWidth * (4/6);
  const unitHeight = boundaryHeight / 4 
  const unitWidth = boundaryWidth / 6
  const heightMark = ['A', 'B', 'C', 'D']
  const boundWidth = boundaryWidth * 17/18 - boundaryWidth * 0.01 //inner
  // const [diagramLogo] = useImage(logo) 

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
        y={startPosition[1]}
        text={index + 1}
        fontSize={boundaryWidth * 0.01 > 12 ? 12 : boundaryWidth * 0.01}
        fontFamily='Arial'
        fill='Black'
      ></Text>)

      groupOfBoundary.push(<Text
        key = {"Boundary-Text-" + uuidv4()}
        x={startPosition[0] + unitWidth * ( index + 0.5)}
        y={startPosition[1] + boundaryHeight - boundaryWidth * 0.01}
        text={index + 1}
        fontSize={boundaryWidth * 0.01 > 12 ? 12 : boundaryWidth * 0.01}
        fontFamily='Arial'
        fill='Black'
      ></Text>)
    }
    groupOfBoundary.push(<Rect
      key= {"Boundary-Rect-" + uuidv4()}
      x={startPosition[0] + boundaryWidth * 1 / 18}
      y={startPosition[1] + boundaryWidth * 0.01 }
      width={boundWidth}
      height={boundaryHeight - boundaryWidth * 0.02}
      stroke='black'
      strokeWidth={3}
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
      strokeWidth={3}
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

    
    // groupOfBoundary.push(<Image
    //   image={diagramLogo}
    // ></Image>)
  }
  

  return(
    <Group>
      {[...DrawBoundary()]}
    </Group>
  );
}


export default DiagramBoundary;