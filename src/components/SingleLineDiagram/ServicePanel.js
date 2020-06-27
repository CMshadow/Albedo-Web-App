import React from 'react';
import {v4 as uuidv4} from 'uuid';
import {Rect, Line, Group, Text, Circle} from 'react-konva';
import {useDispatch, useSelector } from 'react-redux'
import { setMeter } from '../../store/action/index'


const ServerPanel = (props) => {


  const dispatch = useDispatch();
  const width = useSelector(state => state.SLD.width);
  const disconnectAccessPort = useSelector(state => state.SLD.disconnecterAccess);
  const startPosition = useSelector(state => state.SLD.serverPanelPosition);
  const minSize = [width,width];
  const stroke_Width = 2;
  
  let font_size = 16;
  let groupOfServerPanel = [];

  const DrawServerPanel = () => {
    let startX = startPosition[0] + width;
    let startY = startPosition[1];
    groupOfServerPanel.push(<Rect
      key= {"ServerPanel-Rect-" + uuidv4()}
      x={startX}
      y={startY}
      width={minSize[0]}
      height={minSize[1]}
      stroke= 'white'
      strokeWidth={3}
    ></Rect>)

    groupOfServerPanel.push(<Circle
      key= {"ServerPanel-Circle-" + uuidv4()}
      x={startX + minSize[0] * 0.25}
      y={disconnectAccessPort[1]}
      radius={3}
      fill='white'
    ></Circle>)

    groupOfServerPanel.push(<Line
      key={"ServerPanel-ConnectLine-" + uuidv4()}
      points={[startX + minSize[0] * 0.25, 
        disconnectAccessPort[1], 
        startX + minSize[0] * 0.375, 
        disconnectAccessPort[1] - minSize[1] * 0.1, 
        startX + minSize[0] * 0.5, 
        disconnectAccessPort[1]]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
      tension={0.5}
    ></Line>)

    groupOfServerPanel.push(<Circle
      key= {"ServerPanel-Circle-" + uuidv4()}
      x={startX + minSize[0] * 0.5}
      y={disconnectAccessPort[1]}
      radius={3}
      fill='white'
    ></Circle>)

    groupOfServerPanel.push(<Line
      key={"ServerPanel-ConnectLine-" + uuidv4()}
      points={[startX + minSize[0] * 0.375, 
        startY + minSize[1] * 0.35,
        startX + minSize[0] * 0.375, 
        startY + minSize[1] * 0.65]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
      dash={[1, 10]}
    ></Line>)

    groupOfServerPanel.push(<Circle
      key= {"ServerPanel-Circle-" + uuidv4()}
      x={startX + minSize[0] * 0.25}
      y={startY + minSize[1] * 0.75}
      radius={3}
      fill='white'
    ></Circle>)

    groupOfServerPanel.push(<Line
      key={"ServerPanel-ConnectLine-" + uuidv4()}
      points={[startX + minSize[0] * 0.25, 
        startY + minSize[1] * 0.75, 
        startX + minSize[0] * 0.375, 
        startY + minSize[1] * 0.65, 
        startX + minSize[0] * 0.5, 
        startY + minSize[1] * 0.75]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
      tension={0.5}
    ></Line>)

    groupOfServerPanel.push(<Circle
      key= {"ServerPanel-Circle-" + uuidv4()}
      x={startX + minSize[0] * 0.5}
      y={startY + minSize[1] * 0.75}
      radius={3}
      fill='white'
    ></Circle>)

    groupOfServerPanel.push(<Line
      key={"ServerPanel-ConnectLine-" + uuidv4()}
      points={[startX + minSize[0] * 0.5, 
        startY + minSize[1] * 0.75, 
        startX + minSize[0] * 0.65, 
        startY + minSize[1] * 0.75]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfServerPanel.push(<Line
      key={"ServerPanel-ConnectLine-" + uuidv4()}
      points={[startX + minSize[0] * 0.65, 
        startY + minSize[1] * 0.15, 
        startX + minSize[0] * 0.65, 
        startY + minSize[1] * 0.75 ]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfServerPanel.push(<Line
      key={"ServerPanel-ConnectLine-" + uuidv4()}
      points={[startX + minSize[0] * 0.65, 
        startY + minSize[1] * 0.15, 
        startX + minSize[0] * 1.2, 
        startY + minSize[1] * 0.15 ]}  // access port
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfServerPanel.push(<Line
      key={"ServerPanel-ConnectLine-" + uuidv4()}
      points={[startX + minSize[0] * 0.25, 
        disconnectAccessPort[1], 
        disconnectAccessPort[0], 
        disconnectAccessPort[1] ]} 
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)
      
    groupOfServerPanel.push(<Text
      key= {"ServerPanel-Text-" + uuidv4()}
      x={startX}
      y={startY + minSize[1] * 1.05}
      text={'Server Panel'}
      fontSize={font_size}
      fontFamily='Arial'
      fill='white'
    ></Text>)


    dispatch(setMeter([startX + minSize[0] * 1.2, 
      startY + minSize[1] * 0.15], [startX + minSize[0], startY]));

    return groupOfServerPanel;
  }


  return(<Group>
    {[...DrawServerPanel()]}
  </Group>)
}

export default ServerPanel;