import React from 'react';
import {v4 as uuidv4} from 'uuid';
import {Rect, Line, Group, Text, Circle} from 'react-konva';
import {useDispatch, useSelector } from 'react-redux'
import { setWidth } from '../../store/action/index'

const Grid = (props) => {
  const dispatch = useDispatch();
  const meterAccessPort = useSelector(state => state.SLD.meterAccessPosition);
  const startPosition = useSelector(state => state.SLD.gridPosition);
  const width = (meterAccessPort[1] - startPosition[1]) * 2;
  let minSize = [width, width];
  let stroke_Width = 2;
  let font_size = Math.floor(minSize[1] / 2);
  if (font_size < 12) {
    font_size = 12;
  }
  if (font_size < 8) {
    font_size = 8;
  }

  const groupOfGrid = [];

  
  const DrawDraw = () => {
    
    let startX = startPosition[0] + width * 2;
    let startY = startPosition[1];
    let newWidth = props.width > startX + minSize[0] + 100 ? props.width : startX + minSize[0] + 100;
    dispatch(setWidth(newWidth))
    groupOfGrid.push(<Rect
        key= {"Grid-Rect-" + uuidv4()}
        x={startX}
        y={startY}
        width={minSize[0]}
        height={minSize[1]}
        stroke= 'white'
        strokeWidth={stroke_Width}
    ></Rect>)

    groupOfGrid.push(<Line
      key={"Grid-ConnectLine-" + uuidv4()}
      points={[startX, 
        startY + (minSize[1] / 2), 
        meterAccessPort[0], 
        meterAccessPort[1] ]} 
      stroke='white'
      strokeWidth={2}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfGrid.push(<Line
      key={"Grid-ConnectLine-" + uuidv4()}
      points={[startX + 0.4 * minSize[0], 
        startY + 0.1 * minSize[1],
        startX + 0.6 * minSize[0], 
        startY + 0.1 * minSize[1],
        startX + 0.7 * minSize[0], 
        startY + 0.9 * minSize[1],
        startX + 0.35 * minSize[0], 
        startY + 0.55 * minSize[1] ]} 
      stroke='white'
      strokeWidth={2}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfGrid.push(<Line
      key={"Grid-ConnectLine-" + uuidv4()}
      points={[startX + 0.6 * minSize[0], 
        startY + 0.1 * minSize[1],
        startX + 0.4 * minSize[0], 
        startY + 0.1 * minSize[1],
        startX + 0.3 * minSize[0], 
        startY + 0.9 * minSize[1],
        startX + 0.65 * minSize[0], 
        startY + 0.55 * minSize[1] ]} 
      stroke='white'
      strokeWidth={2}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfGrid.push(<Line
      key={"Grid-ConnectLine-" + uuidv4()}
      points={[startX + 0.4 * minSize[0], 
        startY + 0.1 * minSize[1],
        startX + 0.6 * minSize[0], 
        startY + 0.1 * minSize[1],
        startX + 0.8 * minSize[0], 
        startY + 0.2 * minSize[1],
        startX + 0.2 * minSize[0], 
        startY + 0.2 * minSize[1] ]} 
      stroke='white'
      strokeWidth={2}
      lineCap= 'round'
      lineJoin='round'
      closed={true}
    ></Line>)

    groupOfGrid.push(<Line
      key={"Grid-ConnectLine-" + uuidv4()}
      points={[startX + 0.2 * minSize[0], 
        startY + 0.2 * minSize[1],
        startX + 0.2 * minSize[0], 
        startY + 0.3 * minSize[1]]} 
      stroke='white'
      strokeWidth={2}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfGrid.push(<Line
      key={"Grid-ConnectLine-" + uuidv4()}
      points={[startX + 0.8 * minSize[0], 
        startY + 0.2 * minSize[1],
        startX + 0.8 * minSize[0], 
        startY + 0.3 * minSize[1]]} 
      stroke='white'
      strokeWidth={2}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfGrid.push(<Line
      key={"Grid-ConnectLine-" + uuidv4()}
      points={[startX + 0.4 * minSize[0], 
        startY + 0.35 * minSize[1],
        startX + 0.6 * minSize[0], 
        startY + 0.35 * minSize[1],
        startX + 0.8 * minSize[0], 
        startY + 0.45 * minSize[1],
        startX + 0.2 * minSize[0], 
        startY + 0.45 * minSize[1] ]} 
      stroke='white'
      strokeWidth={2}
      lineCap= 'round'
      lineJoin='round'
      closed={true}
    ></Line>)

    groupOfGrid.push(<Line
      key={"Grid-ConnectLine-" + uuidv4()}
      points={[startX + 0.2 * minSize[0], 
        startY + 0.45 * minSize[1],
        startX + 0.2 * minSize[0], 
        startY + 0.55 * minSize[1]]} 
      stroke='white'
      strokeWidth={2}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfGrid.push(<Line
      key={"Grid-ConnectLine-" + uuidv4()}
      points={[startX + 0.8 * minSize[0], 
        startY + 0.45 * minSize[1],
        startX + 0.8 * minSize[0], 
        startY + 0.55 * minSize[1]]} 
      stroke='white'
      strokeWidth={2}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfGrid.push(<Text
      key= {"Grid-Text-" + uuidv4()}
      x={startX}
      y={startY + minSize[1] * 1.05}
      text={'Grid'}
      fontSize={font_size}
      fontFamily='Arial'
      fill='white'
    ></Text>)
    return groupOfGrid;
  }

  return(<Group>
    {[...DrawDraw()]}
  </Group>)
}

export default Grid;