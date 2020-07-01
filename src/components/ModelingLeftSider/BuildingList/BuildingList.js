import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, List, Divider, Row } from 'antd';
import * as actions from '../../../store/action/index'

export const BuildingList = () => {
  const dispatch = useDispatch()

  const onCreateBuilding = () => {
    dispatch(actions.setUICreateBuilding())
  }

  return (
    <>
      <Row justify='center' align='middle'>
        <Button type='primary' size='large' onClick={onCreateBuilding}>Add Building</Button>
      </Row>
      <List
        // grid={{ gutter: 16, column: 4 }}
        // dataSource={data}
        // renderItem={item => (
        //   <List.Item>
        //     <Card title={item.title}>Card content</Card>
        //   </List.Item>
        // )}
      />
    </>
  )
}
