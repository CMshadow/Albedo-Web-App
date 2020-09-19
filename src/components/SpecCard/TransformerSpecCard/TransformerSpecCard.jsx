import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteCombibox } from '../../store/action/index'
import * as styles from './TransformerSpecCard.module.scss';

export const TransformerSpecCard = ({transformerIndex,  ...props}) => {
  const dispatch = useDispatch()
  const [editing, setediting] = useState(true)
  const [loading, setloading] = useState(false)

  useEffect(() => {
    if (props.combibox_name !== null) setediting(false)
  }, [props.combibox_name])

  return (
    <Card
      className={styles.card}
      bodyStyle={{padding: '0px'}}
      loading={loading}
      actions={[
        <Button
          disabled={editing || disabled}
          type='link'
          shape="circle"
          icon={<EditTwoTone twoToneColor={editing || disabled ? '#bfbfbf' : '#1890ff'}/>}
          onClick={() => {
            setediting(true)
            seteditCombibox(true)
          }}
        />,
        <Button
          type='link'
          shape="circle"
          danger
          icon={<DeleteTwoTone twoToneColor='#f5222d'/>}
          onClick={() => {
            setloading(true)
            setTimeout(() => {
              dispatch(deleteCombibox({buildingID, combiboxIndex}))
              setloading(false)
            }, 500)
          }}
        />,
      ]}
    >
      <div className={styles.content}>
        {
          editing ?
          <EditForm
            buildingID={buildingID}
            combiboxIndex={combiboxIndex}
            seteditingFalse={() => {
              setediting(false)
              seteditCombibox(false)
            }}
          /> :
          <SpecView
            buildingID={buildingID}
            combiboxIndex={combiboxIndex}
          />
        }
      </div>
    </Card>
  )
}
