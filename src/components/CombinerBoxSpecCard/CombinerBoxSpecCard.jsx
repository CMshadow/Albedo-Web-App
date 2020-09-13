import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button } from 'antd';
import { EditTwoTone, DeleteOutlined } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteCombibox } from '../../store/action/index'
import * as styles from './CombinerBoxSpecCard.module.scss';

export const CombinerBoxSpecCard = ({buildingID, combiboxIndex, ...props}) => {
  const dispatch = useDispatch()
  const { projectID } = useParams()
  const [editing, setediting] = useState(true)
  const [invLimits, setinvLimits] = useState({})
  const [loading, setloading] = useState(false)

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)

  useEffect(() => {
    if (props.combibox_name !== null) setediting(false)
  }, [props.combibox_name])

  return (
    <Card
      className={styles.card}
      bodyStyle={{padding: '0px'}}
      loading={loading}
      hoverable
      actions={[
        <Button
          disabled={editing}
          type='link'
          shape="circle"
          icon={<EditTwoTone twoToneColor={editing ? '#bfbfbf' : '#1890ff'}/>}
          onClick={() => setediting(true)}
        />,
        <Button
          // disabled={disabled}
          type='link'
          shape="circle"
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            dispatch(deleteCombibox({buildingID, combiboxIndex}))
          }
        />,
      ]}
    >
      <div className={styles.content}>
        {
          editing ?
          <EditForm
            initInvLimits={invLimits}
            buildingID={buildingID}
            combiboxIndex={combiboxIndex}
            setediting={setediting}
            // disabled={disabled}
          /> :
          <SpecView
            initInvLimits={invLimits}
            buildingID={buildingID}
            combiboxIndex={combiboxIndex}
          />
        }
      </div>
    </Card>
  )
}
