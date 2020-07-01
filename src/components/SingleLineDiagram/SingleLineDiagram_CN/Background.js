import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import { Rect, Group } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux'


const BackgroundGrids = (props) => {

  const windowHeight = useSelector(state => state.SLD.stageHeight);
  const windowWidth = useSelector(state => state.SLD.stageWidth);

  return (
    <Group>
      <Rect
        key= {"Backgroud-Rect-" + uuidv4()}
        x={0}
        y={0}
        width={windowWidth}
        height={windowHeight}
        fill={'#f0f2f5'}>
      </Rect>
    </Group>
  );
}

export default BackgroundGrids;