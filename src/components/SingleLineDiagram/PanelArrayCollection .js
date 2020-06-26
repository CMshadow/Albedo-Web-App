import React from 'react';
import { Rect, Line, Group, Text, Circle } from 'react-konva';
import { useDispatch } from 'react-redux'
import { setPVDist, setInverterWidth } from '../../store/action/index'

const PanelArrayCollection = (props) => {

  const dispatch = useDispatch();
  const minSize = [150, 100];//w,h
  const startPosition = [props.width * 0.05, props.height * 0.1 + 83];
  const stroke_Width = 2;
  const connectAccess = [];
  const groupOfPancelsArray =[];
  const stringOfPanels = props.stringOfPanels;
  const panelsOfInverter = props.panelsOfInverter;
  const moduleCount = stringOfPanels * panelsOfInverter;
  let startX = startPosition[0];
  let startY = startPosition[1];
  let font_size = Math.floor(minSize[1] / 7);
  let numOfArray = props.numOfArray > 3 ? 3 : props.numOfArray;
  let overSized = props.numOfArray > 3 ? true : false;
  let pancelOfinverter = 3;

  const zoomAuto = () => {
    if (props.width * 0.1 > minSize[0]) 
      minSize[0] = props.width * 0.1;
    if (props.height * 0.1 > minSize[1]) 
      minSize[1] = props.height * 0.1;
    if (startX < props.width * 0.07 ) 
      startX = props.width * 0.07;
     
  }

  const drawPanelArray = () => {

    zoomAuto();
    dispatch(setPVDist([startX + minSize[0] * 1.5, startPosition[1]]));
    for(let i = 0; i < numOfArray; ++i){
      startY = startPosition[1] + minSize[1] * 1.8 * i;
      if (i === 1 && overSized) {
        drawDashLine(startX + 0.5 * minSize[0], startY + minSize[1] * 1.2 * i);
      }
      const accessPorts = drawSinglePanelArray(i);
      connectAccess.push(accessPorts);
    }
    dispatch(setInverterWidth(minSize[1], connectAccess, minSize[1] * 1.8));
    return groupOfPancelsArray;
  }

  const drawSinglePanelArray = (index) =>{

    let  accessPorts = [];
    drawFirstRowOfSanelArray(accessPorts, index);
    if (pancelOfinverter > 1)
      drawSecondRowOfSanelArray(accessPorts, index);
    return accessPorts;
  }

  const drawFirstRowOfSanelArray = (accessPorts, index) => {

    let firstPanelWidth = minSize[0] * 0.2;
    let firstPanelHeight = minSize[1] * 0.15;
    let startPanelPointX = startX + minSize[0] * 0.1; 
    let startPanelPointY = startY + minSize[1] * 0.1;

    let secondPanelWidth = minSize[0] * 0.2;
    let secondPanelHeight = minSize[1] * 0.15;
    let secondPanelStartPointX = startPanelPointX + minSize[0] * 0.26;
    let secondPanelStartPointY = startPanelPointY;

    let lastPanelWidth = minSize[0] * 0.2;
    let lastPanelHeight = minSize[1] * 0.15;
    let lastPanelStartPointX = secondPanelStartPointX + secondPanelWidth * 1.8;
    let lastPanelStartPointY = secondPanelStartPointY;


    groupOfPancelsArray.push(<Rect
      x={startX}
      y={startY}
      width={minSize[0]}
      height={minSize[1]}
      stroke= 'white'
      strokeWidth={3}
      dash={[15, 5]}
    ></Rect>);

    groupOfPancelsArray.push(<Rect
      x={startPanelPointX}
      y={startPanelPointY}
      width={firstPanelWidth}
      height={firstPanelHeight}
      stroke='white'
      strokeWidth={stroke_Width}
      
    ></Rect>)
    
    groupOfPancelsArray.push(<Line
      points={[startPanelPointX, startPanelPointY,
        startPanelPointX + firstPanelWidth * 0.3,
        startPanelPointY + firstPanelHeight* 0.5,
        startPanelPointX, startPanelPointY + firstPanelHeight]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)
    
    groupOfPancelsArray.push(<Text
      x={startPanelPointX + firstPanelWidth * 0.5}
      y={startPanelPointY + firstPanelHeight * 0.1}
      text='1'
      fontSize={font_size}
      fontFamily='Arial'
      fill='white'
    ></Text>)

    groupOfPancelsArray.push(<Line
      points={[startPanelPointX + firstPanelWidth,
        startPanelPointY + firstPanelHeight* 0.5,
        startPanelPointX + firstPanelWidth * 1.3,
        startPanelPointY + firstPanelHeight* 0.5]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfPancelsArray.push(<Rect
      x={secondPanelStartPointX}
      y={secondPanelStartPointY}
      width={secondPanelWidth}
      height={secondPanelHeight}
      stroke='white'
      strokeWidth={stroke_Width}
    ></Rect>)

    groupOfPancelsArray.push(<Line
      points={[secondPanelStartPointX, 
        secondPanelStartPointY,
        secondPanelStartPointX + secondPanelWidth * 0.3, 
        secondPanelStartPointY + secondPanelHeight* 0.5,
        secondPanelStartPointX, 
        secondPanelStartPointY + secondPanelHeight]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)


    groupOfPancelsArray.push(<Text
      x={secondPanelStartPointX + secondPanelWidth * 0.5}
      y={secondPanelStartPointY + secondPanelHeight * 0.1}
      text='2'
      fontSize={font_size}
      fontFamily='Arial'
      fill='white'
    ></Text>)

    groupOfPancelsArray.push(<Line
      points={[secondPanelStartPointX + secondPanelWidth,
        secondPanelStartPointY + secondPanelHeight* 0.5,
        secondPanelStartPointX + secondPanelWidth * 1.8,
        secondPanelStartPointY + secondPanelHeight* 0.5]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)


    groupOfPancelsArray.push(<Circle
      x={secondPanelStartPointX + secondPanelWidth * 1.4}
      y={secondPanelStartPointY + secondPanelHeight* 0.5}
      radius={secondPanelHeight * 0.25}
      fill='white'
    ></Circle>)
    
    groupOfPancelsArray.push(<Line
      points={[secondPanelStartPointX + secondPanelWidth * 1.4,       secondPanelStartPointY + secondPanelHeight* 0.5,
      secondPanelStartPointX + secondPanelWidth * 1.4,
      secondPanelStartPointY - secondPanelHeight* 0.25,
      secondPanelStartPointX + secondPanelWidth * 0.7,
      secondPanelStartPointY - secondPanelHeight]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)
      
    groupOfPancelsArray.push(<Text
      x={secondPanelStartPointX}
      y={secondPanelStartPointY - secondPanelHeight * 2}
      text='props.线ID 10 AWG Copper'
      fontSize={font_size}
      fontFamily='Arial'
      fill='white'
    ></Text>)
    
    groupOfPancelsArray.push(<Rect
      x={lastPanelStartPointX}
      y={lastPanelStartPointY}
      width={lastPanelWidth}
      height={lastPanelHeight}
      stroke='white'
      strokeWidth={stroke_Width}
    ></Rect>)

    groupOfPancelsArray.push(<Line
      points={[lastPanelStartPointX, 
        lastPanelStartPointY,
        lastPanelStartPointX + lastPanelWidth * 0.3, 
        lastPanelStartPointY + lastPanelHeight* 0.5,
        lastPanelStartPointX, 
        lastPanelStartPointY + lastPanelHeight]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfPancelsArray.push(<Text
      x={lastPanelStartPointX + lastPanelWidth * 0.5}
      y={lastPanelStartPointY + lastPanelHeight * 0.1}
      text={stringOfPanels[index]}
      fontSize={font_size}
      fontFamily='Arial'
      fill='white'
    ></Text>)

    groupOfPancelsArray.push(<Text
      x={startPanelPointX + font_size}
      y={startPanelPointY + firstPanelHeight * 1.5}
      text={'String Count: ' + panelsOfInverter[index]}
      fontSize={font_size * 0.85}
      fontFamily='Arial'
      fill='white'
    ></Text>)

    groupOfPancelsArray.push(<Text
      x={startPanelPointX + font_size}
      y={startPanelPointY + firstPanelHeight * 1.5 + font_size }
      text={'Module Count: ' + stringOfPanels[index] * panelsOfInverter[index]}
      fontSize={font_size * 0.85}
      fontFamily='Arial'
      fill='white'
    ></Text>)
    
    if (panelsOfInverter[index] > 2) 
      groupOfPancelsArray.push(<Line
      points={[startPanelPointX + 3, 
        startPanelPointY + firstPanelHeight * 1.5 + 6, 
        startPanelPointX + 3, 
        startPanelPointY + firstPanelHeight * 1.5 + font_size + 18]}
      stroke='white'
      strokeWidth={stroke_Width * 2}
      lineCap= 'round'
      lineJoin='round'
      dash={[1,10]}
    ></Line>)

    accessPorts.push([lastPanelStartPointX + lastPanelWidth, lastPanelStartPointY + lastPanelHeight* 0.5]);
  }

  const drawSecondRowOfSanelArray = (accessPorts, index) => {

    let firstPanelWidth = minSize[0] * 0.2;
    let firstPanelHeight = minSize[1] * 0.15;
    let startPanelPointX = startX + minSize[0] * 0.1; 
    let startPanelPointY = startY + minSize[1] * 0.75;

    let secondPanelWidth = minSize[0] * 0.2;
    let secondPanelHeight = minSize[1] * 0.15;
    let secondPanelStartPointX = startPanelPointX + firstPanelWidth * 1.3;
    let secondPanelStartPointY = startPanelPointY;

    let lastPanelWidth = minSize[0] * 0.2;
    let lastPanelHeight = minSize[1] * 0.15;
    let lastPanelStartPointX = secondPanelStartPointX + secondPanelWidth * 1.8;
    let lastPanelStartPointY = secondPanelStartPointY;


    groupOfPancelsArray.push(<Rect
      x={startX}
      y={startY}
      width={minSize[0]}
      height={minSize[1]}
      stroke= 'white'
      strokeWidth={3}
      dash={[15, 5]}
    ></Rect>);

    groupOfPancelsArray.push(<Rect
      x={startPanelPointX}
      y={startPanelPointY}
      width={firstPanelWidth}
      height={firstPanelHeight}
      stroke='white'
      strokeWidth={stroke_Width}
      
    ></Rect>)
    
    groupOfPancelsArray.push(<Line
      points={[startPanelPointX, startPanelPointY,
        startPanelPointX + firstPanelWidth * 0.3,
        startPanelPointY + firstPanelHeight* 0.5,
        startPanelPointX, startPanelPointY + firstPanelHeight]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)
    
    groupOfPancelsArray.push(<Text
      x={startPanelPointX + firstPanelWidth * 0.5}
      y={startPanelPointY + firstPanelHeight * 0.1}
      text='1'
      fontSize={font_size}
      fontFamily='Arial'
      fill='white'
    ></Text>)

    groupOfPancelsArray.push(<Line
      points={[startPanelPointX + firstPanelWidth,
        startPanelPointY + firstPanelHeight* 0.5,
        startPanelPointX + firstPanelWidth * 1.3,
        startPanelPointY + firstPanelHeight* 0.5]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)

    groupOfPancelsArray.push(<Rect
      x={secondPanelStartPointX}
      y={secondPanelStartPointY}
      width={secondPanelWidth}
      height={secondPanelHeight}
      stroke='white'
      strokeWidth={stroke_Width}
    ></Rect>)

    groupOfPancelsArray.push(<Line
      points={[secondPanelStartPointX, 
        secondPanelStartPointY,
        secondPanelStartPointX + secondPanelWidth * 0.3, 
        secondPanelStartPointY + secondPanelHeight* 0.5,
        secondPanelStartPointX, 
        secondPanelStartPointY + secondPanelHeight]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)


    groupOfPancelsArray.push(<Text
      x={secondPanelStartPointX + secondPanelWidth * 0.5}
      y={secondPanelStartPointY + secondPanelHeight * 0.1}
      text='2'
      fontSize={font_size}
      fontFamily='Arial'
      fill='white'
    ></Text>)

    groupOfPancelsArray.push(<Line
      points={[secondPanelStartPointX + secondPanelWidth,
        secondPanelStartPointY + secondPanelHeight* 0.5,
        secondPanelStartPointX + secondPanelWidth * 1.8,
        secondPanelStartPointY + secondPanelHeight* 0.5]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)
    
    groupOfPancelsArray.push(<Rect
      x={lastPanelStartPointX}
      y={lastPanelStartPointY}
      width={lastPanelWidth}
      height={lastPanelHeight}
      stroke='white'
      strokeWidth={stroke_Width}
    ></Rect>)
    
    groupOfPancelsArray.push(<Line
      points={[lastPanelStartPointX, 
        lastPanelStartPointY,
        lastPanelStartPointX + lastPanelWidth * 0.3, 
        lastPanelStartPointY + lastPanelHeight* 0.5,
        lastPanelStartPointX, 
        lastPanelStartPointY + lastPanelHeight]}
      stroke='white'
      strokeWidth={stroke_Width}
      lineCap= 'round'
      lineJoin='round'
    ></Line>)
    groupOfPancelsArray.push(<Text
      x={lastPanelStartPointX + lastPanelWidth * 0.5}
      y={lastPanelStartPointY + lastPanelHeight * 0.1}
      text={stringOfPanels[index]}
      fontSize={font_size}
      fontFamily='Arial'
      fill='white'
    ></Text>)

    accessPorts.push([lastPanelStartPointX + lastPanelWidth, lastPanelStartPointY + lastPanelHeight* 0.5]);
  }

  const drawDashLine = (startPanelPointX, startPanelPointY) => {
    groupOfPancelsArray.push(<Line
    points={[startPanelPointX, 
      startPanelPointY, 
      startPanelPointX, 
      startPanelPointY + minSize[1] * 0.3]}
    stroke='white'
    strokeWidth={stroke_Width * 2}
    lineCap= 'round'
    lineJoin='round'
    dash={[1,10]}
    ></Line>)
  }

  return (<Group key={"panelArrays"}>
    {[...drawPanelArray()]}
  </Group>);
}

export default PanelArrayCollection;