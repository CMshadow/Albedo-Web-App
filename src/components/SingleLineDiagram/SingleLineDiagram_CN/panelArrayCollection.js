import React, { PureComponent } from 'react'
import {v4 as uuidv4} from 'uuid'
import {Rect, Line, Group, Text, Image} from "react-konva"
import {useSelector, useDispatch } from 'react-redux'


const PanelArrayCollection = () => {

  const width = useSelector(state => state.SLD.diagramWidth)
  const height = width * (4/6)
  console.log(width)
  const startPosition = [width * 0.2, height * 0.1]


  const DrawPanelArray = () => {
    
  }
  
  const drawInverter = (params) => {
    
  }
  

  return(<Group>

  </Group>)
}

export default PanelArrayCollection
