import React, { useState } from 'react'
import { PlusOutlined, EyeTwoTone, EyeInvisibleTwoTone, DeleteOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faObjectUngroup } from '@fortawesome/pro-light-svg-icons'
import { Button, List, Divider, Row, Collapse, Typography, Card } from 'antd';
import { KeepoutList } from './KeepoutList'
import { FoundationList } from './FoundationList'
import * as actions from '../../../store/action/index'
const { Panel } = Collapse;
const Text = Typography.Text

const FOUNDATION = 'FOUNDATION'
const KEEPOUT = 'KEEPOUT'

export const Drawing = () => {
  const dispatch = useDispatch()
  const modelingReducer = useSelector(state => state.undoable.present.modeling)
  const buildingPolygonId = modelingReducer.buildingPolygonId

  const drawFound = (event) => {
    event.stopPropagation()
    dispatch(actions.setDrwStatPolygon({
      pointHeight: false,
      polygonPos: false,
      polygonHeight: false,
      objType: FOUNDATION
    }))
  }

  const drawKeepout = (event) => {
    event.stopPropagation()
    dispatch(actions.setDrwStatPolygon({
      pointHeight: false,
      polygonPos: true,
      polygonHeight: false,
      objType: KEEPOUT
    }))
  }

  return (
    <Collapse bordered={false} defaultActiveKey={['1']} ghost>
      <Panel
        header="房屋外轮廓" key="1"
        extra={
          buildingPolygonId.length === 0 ?
          <Button size='small' type='primary' shape='circle' ghost
            icon={<FontAwesomeIcon icon={faPen}/>} onClick={e => drawFound(e)}
          /> :
          null
        }
      >
        {
          buildingPolygonId.length !== 0 ?
          <FoundationList/> :
          <Text>点击右上角画笔创建房屋轮廓</Text>
        }
      </Panel>
      <Panel
        header="屋顶障碍物" key="2"
        extra={
          <Button size='small' type='primary' shape='circle' ghost
            icon={<PlusOutlined/>} onClick={e => drawKeepout(e)}
          />
        }
      >
        <KeepoutList />
      </Panel>
      <Panel header="屋顶通道" key="3">
        屋顶通道
      </Panel>
      <Panel header="通风口" key="4">
        通风口
      </Panel>
      <Panel header="树木" key="5">
        树木
      </Panel>
      <Panel header="环境障碍物" key="6">
        环境障碍物
      </Panel>
    </Collapse>
  )
}
