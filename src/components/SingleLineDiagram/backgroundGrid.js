import React from 'react';
import {v4 as uuidv4} from 'uuid';
import { Rect, Line, Group } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux'


const BackgroundGrids = (props) => {
  const size_times = 1;
  const averageHori = 50;
  const averageVeri = 10;
  const windowHeight = useSelector(state => state.SLD.stageHeight);
  const windowWidth = useSelector(state => state.SLD.stageWidth);
  const grids = () => {
    let grid = [];
    for (let i = 0; i < windowHeight * size_times / averageHori; ++i) {
      grid.push(<Line 
        key= {"Backgroud-Line-" + uuidv4()}
        points={[0, i * averageHori, 
          windowWidth * size_times, i * averageHori]}
        stroke='#7b7b85'
        strokeWidth={1.5}
        lineCap='round'
        lineJoin='round'
      ></Line>
      )
    }
    for (let i = 0; i < windowHeight * size_times / averageVeri; ++i) {
      grid.push(
        <Line
          key= {"Backgroud-Line-" + uuidv4()}
          points={[0, i * averageVeri , 
            windowWidth * size_times, i * averageVeri]}
          stroke='#3f3f4c'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
      ></Line>
      );
    }
    for (let i = 0; i < windowWidth * size_times / averageHori; ++i) {
      grid.push(
        <Line
          key= {"Backgroud-Line-" + uuidv4()}
          points={[i * averageHori, 0, 
            i * averageHori,windowHeight * size_times]}
          stroke='#7b7b85'
          strokeWidth={1.5}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )
    }
    for (let i = 0; i < windowWidth * size_times / averageVeri; ++i) {
      grid.push(
        <Line
          key= {"Backgroud-Line-" + uuidv4()}
          points={[i * averageVeri, 0, 
            i * averageVeri,windowHeight * size_times,]}
          stroke='#3f3f4c'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
      ></Line>
      );
    }
    return grid;
  }

  return (
    <Group>
      <Rect
        key= {"Backgroud-Rect-" + uuidv4()}
        x={0}
        y={0}
        width={windowWidth}
        height={windowHeight}
        fill={'#0a0a0a'}>
      </Rect>
      {[...grids()]}
    </Group>
  );
}

export default BackgroundGrids;