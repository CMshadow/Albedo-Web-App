import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {Rect, Group, Line, Text, Arrow, Circle, Ellipse} from 'react-konva';
import {useSelector } from 'react-redux'

const SelfUseMeter = (props) => {

  const accessPort = useSelector(state => state.SLD.diagramMeterAccessPort)
  const groupOfMeter = []
  const width = useSelector(state => state.SLD.diagramWidth) * 0.8
  const height = width * (4/6)
  const unitHeight = height / 4 
  const unitWidth = width / 6
  const startX = accessPort[0] - unitWidth * 0.5
  const startY = accessPort[1] - unitHeight * 0.7

  const combiSelect = (combiboxIe) => {
    const standard = [32, 63, 80, 100, 125, 160, 225]
    for (let element = 0; element < standard.length; element++) {
      if (standard[element] > combiboxIe) return standard[element]
    }
  }
  const DrawMeter = () => {
    groupOfMeter.push(<Rect
      key= {"Backgroud-Rect-" + uuidv4()}
      x={startX}
      y={startY}
      width={unitWidth * 2.2}
      height={unitHeight * 0.7}
      stroke='black'
      strokeWidth={1}
      dash={[10,10]}
      fill='white'
    >
    </Rect>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0],
        accessPort[1],
        accessPort[0],
        accessPort[1] - unitHeight * 0.1
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0],
        accessPort[1] - unitHeight * 0.1,
        accessPort[0] - 10,
        accessPort[1] - unitHeight * 0.2,
      ]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0],
        accessPort[1] - unitHeight * 0.35,
        accessPort[0],
        accessPort[1] - unitHeight * 0.3 + 10
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)
    
    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] - 2.5,
        accessPort[1] - unitHeight * 0.3 + 10 - 2.5, 
        accessPort[0] + 2.5,
        accessPort[1] - unitHeight * 0.3 + 10 + 2.5
      ]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)
    
    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + 2.5,
        accessPort[1] - unitHeight * 0.3 + 10 - 2.5, 
        accessPort[0] - 2.5,
        accessPort[1] - unitHeight * 0.3 + 10 + 2.5
      ]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)
    
    groupOfMeter.push(<Text
      key = {"Meter-Text-" + uuidv4()}
      x={accessPort[0] - 50}
      y={accessPort[1] - unitHeight * 0.3 + 10 - 2.5}
      text={combiSelect(props.combiboxIe) + 'A'}
      fontSize={unitHeight * 0.08 > 12 ? 12 : unitHeight * 0.08}
      fontFamily='Arial'
      fill='Black'
    ></Text>)
    
    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0],
        accessPort[1] - unitHeight * 0.35,
        accessPort[0] + unitWidth * 1.2,
        accessPort[1] - unitHeight * 0.35
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.6,
        accessPort[1] - unitHeight * 0.35,
        accessPort[0] + unitWidth * 0.6,
        accessPort[1] - unitHeight * 0.35 + 10
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Circle
      key= {"Meter-Circle-" + uuidv4()}
      x={accessPort[0] + unitWidth * 0.6}
      y={accessPort[1] - unitHeight * 0.35} 
      radius={2} 
      fill="black"
    ></Circle>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.6,
        accessPort[1] - unitHeight * 0.35,
        accessPort[0] + unitWidth * 0.6,
        accessPort[1] - unitHeight * 0.35 + 10
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)
    
    groupOfMeter.push(<Circle
      key= {"Meter-Circle-" + uuidv4()}
      x={accessPort[0] + unitWidth * 0.63}
      y={accessPort[1] - unitHeight * 0.08} 
      radius={2} 
      fill="black"
    ></Circle>)
    groupOfMeter.push(<Circle
      key= {"Meter-Circle-" + uuidv4()}
      x={accessPort[0] + unitWidth * 0.65}
      y={accessPort[1] - unitHeight * 0.08} 
      radius={2} 
      fill="black"
    ></Circle>)
    groupOfMeter.push(<Circle
      key= {"Meter-Circle-" + uuidv4()}
      x={accessPort[0] + unitWidth * 0.67}
      y={accessPort[1] - unitHeight * 0.08} 
      radius={2} 
      fill="black"
    ></Circle>)

    drawSwictchPort([accessPort[0] + unitWidth * 0.6, 
      accessPort[1] - unitHeight * 0.35 + 10])
    drawMeterBox()
    drawServicePanel()
    drawMarks()
    return groupOfMeter
  }

  const drawSwictchPort = (position) => {
    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        position[0] - 2.5,
        position[1] - 2.5,
        position[0] + 2.5,
        position[1] + 2.5]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        position[0] + 2.5,
        position[1] - 2.5,
        position[0] - 2.5,
        position[1] + 2.5]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        position[0] - 10,
        position[1] - 2.5,
        position[0],
        position[1] + 0.05 * unitHeight + 2.5
      ]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        position[0],
        position[1] + 0.05 * unitHeight + 2.5,
        position[0],
        position[1] + 0.05 * unitHeight + 10
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)
  }
  

  const drawServicePanel= (params) => {
    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.6,
        accessPort[1] - unitHeight * 0.3 + 20,
        accessPort[0] + unitWidth * 0.6,
        accessPort[1] - unitHeight * 0.2 + 12.5
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Ellipse
      key= {"Meter-Line-" + uuidv4()}
      x= {accessPort[0] + unitWidth * 0.6}
      y= {accessPort[1] - unitHeight * 0.35 + 25 + 4}
      radiusX={10}
      radiusY={4}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Ellipse>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.6 - 20,
        accessPort[1] - unitHeight * 0.3 + 20,
        accessPort[0] + unitWidth * 0.6 - 25,
        accessPort[1] - unitHeight * 0.3 + 20,
        accessPort[0] + unitWidth * 0.6 - 25,
        accessPort[1] - unitHeight * 0.3,
        accessPort[0] + unitWidth * 0.6 - 20,
        accessPort[1] - unitHeight * 0.3
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.3,
        accessPort[1] - unitHeight * 0.2 + 12.5,
        accessPort[0] + unitWidth * 0.9,
        accessPort[1] - unitHeight * 0.2 + 12.5
      ]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.4,
        accessPort[1] - unitHeight * 0.2 + 12.5,
        accessPort[0] + unitWidth * 0.4,
        accessPort[1] - unitHeight * 0.15 + 12.5
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

     groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.55,
        accessPort[1] - unitHeight * 0.2 + 12.5,
        accessPort[0] + unitWidth * 0.55,
        accessPort[1] - unitHeight * 0.15 + 12.5
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

      groupOfMeter.push(<Line
        key= {"Meter-Line-" + uuidv4()}
        points={[
          accessPort[0] + unitWidth * 0.75,
          accessPort[1] - unitHeight * 0.2 + 12.5,
          accessPort[0] + unitWidth * 0.75,
          accessPort[1] - unitHeight * 0.15 + 12.5
        ]}
        stroke='#7b7b85'
        strokeWidth={1}
        lineCap='round'
        lineJoin='round'
      ></Line>)

      drawSwictchPort([accessPort[0] + unitWidth * 0.4,
        accessPort[1] - unitHeight * 0.15 + 12.5])
      drawSwictchPort([accessPort[0] + unitWidth * 0.55,
        accessPort[1] - unitHeight * 0.15 + 12.5])
      drawSwictchPort([accessPort[0] + unitWidth * 0.75,
        accessPort[1] - unitHeight * 0.15 + 12.5])
  }
  

  const drawMeterBox = () => {    
    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 1.2,
        accessPort[1] - unitHeight * 0.35 - 5,
        accessPort[0] + unitWidth * 1.2,
        accessPort[1] - unitHeight * 0.35
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)
    groupOfMeter.push(<Rect
      key= {"Meter-Rect-" + uuidv4()}
      x={accessPort[0] + unitWidth * 1.2 - unitWidth * 0.07}
      y={accessPort[1] - unitHeight * 0.5 - 5}
      width={unitWidth * 0.15}
      height={unitHeight * 0.15}
      stroke='black'
      strokeWidth={2}>
      </Rect>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 1.2 - unitWidth * 0.07,
        accessPort[1] - unitHeight * 0.5,
        accessPort[0] + unitWidth * 1.35 - unitWidth * 0.07,
        accessPort[1] - unitHeight * 0.5]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Arrow
      key= {"Meter-Line-" + uuidv4()}
      points={[accessPort[0] + unitWidth * 1.2, accessPort[1] - unitHeight * 0.5 - 5, accessPort[0] + unitWidth * 1.2, accessPort[1] - unitHeight * 0.7]}
      pointerLength={5}
      pointerWidth={5}
      stroke='black'
      strokeWidth={1}
      ></Arrow>)
  }
  const drawMarks = () => {
    groupOfMeter.push(<Text
      key = {"Meter-Text-" + uuidv4()}
      x={accessPort[0] + unitWidth * 1.2- unitWidth * 0.07}
      y={accessPort[1] - unitHeight * 0.5 + 5}
      text={" Wh"}
      fontSize={unitHeight * 0.08 > 12 ? 12 : unitHeight * 0.08}
      fontFamily='Arial'
      fill='Black'
    ></Text>)
    groupOfMeter.push(<Text
      key = {"Meter-Text-" + uuidv4()}
      x={startX}
      y={startY + 10}
      text={"  户用配电设备"}
      fontSize={unitHeight * 0.08 > 16 ? 16 : unitHeight * 0.08}
      fontFamily='Arial'
      fill='Black'
    ></Text>)

    groupOfMeter.push(<Text
      key = {"Meter-Text-" + uuidv4()}
      x={accessPort[0] + unitWidth * 1.1}
      y={accessPort[1] - unitHeight * 0.7 - 15}
      text={" 公用电网"}
      fontSize={unitHeight * 0.08 > 12 ? 12 : unitHeight * 0.08}
      fontFamily='Arial'
      fill='Black'
    ></Text>)

    groupOfMeter.push(<Text
      key = {"Meter-Text-" + uuidv4()}
      x={accessPort[0] + unitWidth * 1.37 - unitWidth * 0.07}
      y={accessPort[1] - unitHeight * 0.5 - 5}
      text={" METER"}
      fontSize={unitHeight * 0.08 > 12 ? 12 : unitHeight * 0.08}
      fontFamily='Arial'
      fill='Black'
    ></Text>)
  }
  
  const drawEllipsis = (position) => {
    groupOfMeter.push(<Circle
      key= {"Meter-Circle-" + uuidv4()}
      x={accessPort[0] + unitWidth * 0.6}
      y={accessPort[1] - unitHeight * 0.35} 
      radius={2} 
      fill="black"
    ></Circle>)
    groupOfMeter.push(<Circle
      key= {"Meter-Circle-" + uuidv4()}
      x={accessPort[0] + unitWidth * 0.6}
      y={accessPort[1] - unitHeight * 0.35} 
      radius={2} 
      fill="black"
    ></Circle>)
    groupOfMeter.push(<Circle
      key= {"Meter-Circle-" + uuidv4()}
      x={accessPort[0] + unitWidth * 0.6}
      y={accessPort[1] - unitHeight * 0.35} 
      radius={2} 
      fill="black"
    ></Circle>)
  }

  return (
    <Group>
      {[...DrawMeter()]}
    </Group>
  );
}

export default SelfUseMeter;