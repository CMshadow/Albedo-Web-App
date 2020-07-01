import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {Rect, Group, Line, Text, Arrow, Circle} from 'react-konva';
import {useSelector } from 'react-redux'

const SelfUseMeter = (props) => {

  const accessPort = useSelector(state => state.SLD.diagramMeterAccessPort)
  const groupOfMeter = []
  const width = useSelector(state => state.SLD.diagramWidth) * 0.8
  const height = width * (4/6)
  const unitHeight = height / 4 
  const unitWidth = width / 6
  const startX = accessPort[0] - unitWidth * 0.5
  const startY = accessPort[1] - unitHeight * 0.65


  const DrawMeter = () => {
    groupOfMeter.push(<Rect
      key= {"Backgroud-Rect-" + uuidv4()}
      x={startX}
      y={startY}
      width={unitWidth * 2.2}
      height={unitHeight * 0.65}
      stroke='black'
      strokeWidth={1}
      dash={[10,10]}
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

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.6 - 2.5,
        accessPort[1] - unitHeight * 0.35 + 7.5,
        accessPort[0] + unitWidth * 0.6 + 2.5,
        accessPort[1] - unitHeight * 0.35 + 12.5
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.6 + 2.5,
        accessPort[1] - unitHeight * 0.35 + 7.5,
        accessPort[0] + unitWidth * 0.6 - 2.5,
        accessPort[1] - unitHeight * 0.35 + 12.5
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.6 + 2.5,
        accessPort[1] - unitHeight * 0.35 + 7.5,
        accessPort[0] + unitWidth * 0.6 - 2.5,
        accessPort[1] - unitHeight * 0.35 + 12.5
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.6 - 10,
        accessPort[1] - unitHeight * 0.35 + 7.5,
        accessPort[0] + unitWidth * 0.6,
        accessPort[1] - unitHeight * 0.3 + 12.5
      ]}
      stroke='#7b7b85'
      strokeWidth={2}
      lineCap='round'
      lineJoin='round'
      ></Line>)

    groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.6,
        accessPort[1] - unitHeight * 0.3 + 12.5,
        accessPort[0] + unitWidth * 0.6,
        accessPort[1] - unitHeight * 0.2 + 12.5
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
        accessPort[1] - unitHeight * 0.25 + 12.5,
        accessPort[0] + unitWidth * 0.9,
        accessPort[1] - unitHeight * 0.25 + 12.5
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
        accessPort[1] - unitHeight * 0.25 + 12.5,
        accessPort[0] + unitWidth * 0.4,
        accessPort[1] - unitHeight * 0.2 + 12.5
      ]}
      stroke='#7b7b85'
      strokeWidth={1}
      lineCap='round'
      lineJoin='round'
      ></Line>)

     groupOfMeter.push(<Line
      key= {"Meter-Line-" + uuidv4()}
      points={[
        accessPort[0] + unitWidth * 0.5,
        accessPort[1] - unitHeight * 0.25 + 12.5,
        accessPort[0] + unitWidth * 0.5,
        accessPort[1] - unitHeight * 0.2 + 12.5
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
      accessPort[1] - unitHeight * 0.25 + 12.5,
      accessPort[0] + unitWidth * 0.75,
      accessPort[1] - unitHeight * 0.2 + 12.5
    ]}
    stroke='#7b7b85'
    strokeWidth={1}
    lineCap='round'
    lineJoin='round'
    ></Line>)


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
      y={accessPort[1] - unitHeight * 0.7 - 10}
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



    return groupOfMeter
  }
  

  return (
    <Group>
      {[...DrawMeter()]}
    </Group>
  );
}

export default SelfUseMeter;