import React, { useState } from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faObjectUngroup } from '@fortawesome/pro-light-svg-icons'
import { Button, List, Divider, Row, Collapse, Typography, Tooltip } from 'antd';
import { KeepoutList } from './KeepoutList'
import { FoundationList } from './FoundationList'
import { Color } from 'cesium'
import * as actions from '../../../store/action/index'
const { Panel } = Collapse;
const Text = Typography.Text

const FOUNDATION = 'FOUNDATION'
const KEEPOUT = 'KEEPOUT'

const POINT_OFFSET = 0.025
const POLYLINE_OFFSET = 0.0125
const POLYGON_OFFSET = 0

export const Drawing = () => {
  const dispatch = useDispatch()
  const modelingReducer = useSelector(state => state.undoable.present.modeling)
  const buildingPolygonId = modelingReducer.buildingPolygonId
  const modelingLoading = modelingReducer.modelingLoading

  const drawFound = (event) => {
    event.stopPropagation()
    dispatch(actions.setDrwStatPolygon({
      pointHeight: false,
      pointDelete: true,
      polylineAddVertex: true,
      polylineDelete: false,
      polygonPos: false,
      polygonHeight: false,
      polylineTheme: Color.STEELBLUE,
      polylineHighlight: Color.ORANGE,
      polygonTheme: Color.WHITE.withAlpha(0.2),
      polygonHighlight: Color.ORANGE,
      pointHt: 0.1 + POINT_OFFSET,
      polylineHt: 0.1 + POLYLINE_OFFSET,
      polygonHt: 0.1 + POLYGON_OFFSET,
      objType: FOUNDATION,
    }))
    dispatch(actions.setModelingLoading(FOUNDATION))
  }

  const drawKeepout = (event) => {
    event.stopPropagation()
    dispatch(actions.setDrwStatPolygon({
      pointHeight: false,
      pointDelete: true,
      polylineAddVertex: true,
      polylineDelete: false,
      polygonPos: true,
      polygonHeight: false,
      polylineTheme: Color.CRIMSON ,
      polylineHighlight: Color.ORANGE,
      polygonTheme: Color.WHITE.withAlpha(0.2),
      polygonHighlight: Color.ORANGE.withAlpha(0.2),
      pointHt: 0.15 + POINT_OFFSET,
      polylineHt: 0.15 + POLYLINE_OFFSET,
      polygonHt: 0.15 + POLYGON_OFFSET,
      objType: KEEPOUT
    }))
    dispatch(actions.setModelingLoading(KEEPOUT))
  }

  return (
    <Collapse bordered={false} defaultActiveKey={['1']} ghost>
      <Panel
        header="房屋外轮廓" key="1"
        extra={
          buildingPolygonId.length === 0 ?
          <Tooltip title='在地图上鼠标左键勾画轮廓，鼠标右键结束'>
            <Button size='small' type='primary' shape='circle' ghost
              disabled={modelingLoading}
              icon={
                modelingLoading === FOUNDATION ?
                <LoadingOutlined/> :
                <FontAwesomeIcon icon={faPen}/>
              }
              onClick={e => drawFound(e)}
            />
          </Tooltip> :
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
          <Tooltip title='在地图上鼠标左键勾画轮廓，鼠标右键结束'>
            <Button size='small' type='primary' shape='circle' ghost
              disabled={modelingLoading}
              icon={
                modelingLoading === KEEPOUT ?
                <LoadingOutlined/> :
                <PlusOutlined/>
              }
              onClick={e => drawKeepout(e)}
            />
          </Tooltip>
        }
      >
        <KeepoutList />
      </Panel>
      <Panel header="屋顶通道" key="3">
        <KeepoutList />
      </Panel>
      <Panel header="通风口" key="4">
        <KeepoutList />
      </Panel>
      <Panel header="树木" key="5">
        <KeepoutList />
      </Panel>
      <Panel header="环境障碍物" key="6">
        <KeepoutList />
      </Panel>
    </Collapse>
  )
}
