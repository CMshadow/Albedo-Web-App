import React from 'react'
import { PlusOutlined, EyeTwoTone, EyeInvisibleTwoTone, DeleteOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { Button, List, Typography } from 'antd';
import { Color } from 'cesium'
import * as actions from '../../../store/action/index'
const Text = Typography.Text

const FOUNDATION = 'FOUNDATION'

export const FoundationList = () => {
  const dispatch = useDispatch()
  const modelingReducer = useSelector(state => state.undoable.present.modeling)
  const buildingPolygonId = modelingReducer.buildingPolygonId

  const allPolygon = useSelector(state => state.undoable.present.polygon)

  return (
    <List
      itemLayout="horizontal"
      dataSource={buildingPolygonId}
      renderItem={polygonId => (
        <List.Item
          actions={[
            <Button size='small' type='link'
              icon={
                allPolygon[polygonId] && allPolygon[polygonId].entity.show ?
                <EyeTwoTone twoToneColor='#1890ff'/> :
                <EyeInvisibleTwoTone twoToneColor='#1890ff'/>
              }
              onClick={() =>
                allPolygon[polygonId] && allPolygon[polygonId].entity.show ?
                dispatch(actions.polygonSetShow(polygonId, false)) :
                dispatch(actions.polygonSetShow(polygonId, true))
              }
            />
          ]}
        >
          <Text>房屋外轮廓</Text>
        </List.Item>
      )}
    />
  )
}
