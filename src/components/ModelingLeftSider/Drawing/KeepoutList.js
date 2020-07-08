import React from 'react'
import { EyeTwoTone, EyeInvisibleTwoTone, DeleteOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClone } from '@fortawesome/pro-light-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { Button, List, Typography } from 'antd';
import * as actions from '../../../store/action/index'
const Text = Typography.Text

const KEEPOUT = 'KEEPOUT'

export const KeepoutList = () => {
  const dispatch = useDispatch()
  const modelingReducer = useSelector(state => state.undoable.present.modeling)
  const buildingKeepoutId = modelingReducer.keepoutId

  const allPolygon = useSelector(state => state.undoable.present.polygon)
  return (
    <List
      itemLayout="horizontal"
      dataSource={buildingKeepoutId}
      renderItem={(kptPolygonId, index) => (
        <List.Item
          actions={[
            <Button size='small' type='link'
              icon={
                allPolygon[kptPolygonId] && allPolygon[kptPolygonId].entity.show ?
                <EyeTwoTone twoToneColor='#1890ff'/> :
                <EyeInvisibleTwoTone twoToneColor='#1890ff'/>
              }
              onClick={() =>
                allPolygon[kptPolygonId] && allPolygon[kptPolygonId].entity.show ?
                dispatch(actions.polygonSetShow(kptPolygonId, false)) :
                dispatch(actions.polygonSetShow(kptPolygonId, true))
              }
            />,
            <Button size='small' type='link'
              icon={<FontAwesomeIcon icon={faClone} />}
              onClick={() =>
                dispatch(actions.polygonClone(kptPolygonId))
              }
            />,
            <Button size='small' type='link' danger
              icon={<DeleteOutlined />}
              onClick={() => {
                dispatch(actions.polygonDelete(kptPolygonId))
                dispatch(actions.deleteDrawingObj({objType: KEEPOUT, objId: kptPolygonId}))
              }}
            />
          ]}
          onMouseEnter={() => {
            dispatch(actions.releaseHoverObj())
            dispatch(actions.polygonHighlight(kptPolygonId))
          }}
          onMouseLeave={() => {
            dispatch(actions.releaseHoverObj())
            dispatch(actions.polygonDeHighlight(kptPolygonId))
          }}
        >
          <Text>{`屋顶障碍物${index + 1}`}</Text>
        </List.Item>
      )}
    />
  )
}
