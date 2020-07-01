import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, List, Divider, Row, Collapse } from 'antd';
import * as actions from '../../../store/action/index'
const { Panel } = Collapse;

export const Drawing = () => {
  const dispatch = useDispatch()

  const onCreateBuilding = () => {
    dispatch(actions.setUICreateBuilding())
  }

  return (
    <Collapse defaultActiveKey={['1']} ghost>
      <Panel header="房屋轮廓" key="1">
        房屋轮廓
      </Panel>
      <Panel header="屋顶障碍物" key="2">
        屋顶障碍物
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
