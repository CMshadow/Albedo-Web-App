import React from 'react';
import { Rect, Line, Group } from 'react-konva';
import { useDispatch } from 'react-redux'
import { setResize } from '../../store/action/index'


const BackgroundGrids = (props) => {
  const size_times = 1;
  const averageHori = 50;
  const averageVeri = 10;
  const dispatch = useDispatch();
  const grids = () => {
    let grid = [];
    for (let i = 0; i < props.height * size_times / averageHori; ++i) {
      grid.push(
        <Line
          key={"0" + String(i*averageHori) + 
          String(Math.floor(100000000 + Math.random() * 900000000))}
          points={[0, i * averageHori, 
            props.width * size_times, i * averageHori]}
          stroke='#7b7b85'
          strokeWidth={1.5}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )
    }
    for (let i = 0; i < props.height * size_times / averageVeri; ++i) {
      grid.push(
        <Line
          key={"0" + String(i*averageVeri)+
          String(Math.floor(100000000 + Math.random() * 900000000))}
          points={[0, i * averageVeri , 
            props.width * size_times, i * averageVeri]}
          stroke='#3f3f4c'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
      ></Line>
      );
    }
    for (let i = 0; i < props.width * size_times / averageHori; ++i) {
      grid.push(
        <Line
          key={String(averageHori * i)+"0"+
          String(Math.floor(100000000 + Math.random() * 900000000))}
          points={[i * averageHori, 0, 
            i * averageHori,props.height * size_times]}
          stroke='#7b7b85'
          strokeWidth={1.5}
          lineCap='round'
          lineJoin='round'
        ></Line>
      )
    }
    for (let i = 0; i < props.width * size_times / averageVeri; ++i) {
      grid.push(
        <Line
          key={String(averageVeri * i)+"0"+
          String(Math.floor(100000000 + Math.random() * 900000000))}
          points={[i * averageVeri, 0, 
            i * averageVeri,props.height * size_times,]}
          stroke='#3f3f4c'
          strokeWidth={1}
          lineCap='round'
          lineJoin='round'
      ></Line>
      );
    }

    // dispatch(setResize(300,300));
    return grid;
  }

  return (
    <Group>
      <Rect
      x={0}
      y={0}
      width={props.width * size_times}
      height={window.innerHeight * size_times}
      fill={'#0a0a0a'}>
      </Rect>
      {[...grids()]}
    </Group>
  );
}

export default BackgroundGrids;