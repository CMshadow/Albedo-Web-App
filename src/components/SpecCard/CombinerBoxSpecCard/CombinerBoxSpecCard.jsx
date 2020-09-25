import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteCombibox } from '../../../store/action/index'
import * as styles from './CombinerBoxSpecCard.module.scss';

export const CombinerBoxSpecCard = ({id, buildingID, combiboxIndex, editingCombibox, seteditingCombibox, ...props}) => {
  const dispatch = useDispatch()
  const [editing, setediting] = useState(true)
  const [loading, setloading] = useState(false)

  useEffect(() => {
    if (props.combibox_vac !== null) setediting(false)
  }, [props.combibox_vac])

  return (
    <Card
      id={id}
      className={styles.card}
      bodyStyle={{padding: 0}}
      loading={loading}
      actions={[
        <Button
          disabled={editing || editingCombibox !== null}
          type='link'
          shape="circle"
          icon={<EditTwoTone twoToneColor={editing || editingCombibox !== null ? '#bfbfbf' : '#1890ff'}/>}
          onClick={() => {
            setediting(true)
            seteditingCombibox(combiboxIndex)
          }}
        />,
        <Button
          type='link'
          shape="circle"
          danger
          icon={
            <DeleteTwoTone 
              twoToneColor={
                editingCombibox !== null && editingCombibox !== combiboxIndex ? 
                '#bfbfbf' : '#f5222d'
              }
            />
          }
          disabled={editingCombibox !== null && editingCombibox !== combiboxIndex}
          onClick={() => {
            setloading(true)
            setTimeout(() => {
              seteditingCombibox(null)
              setloading(false)
              dispatch(deleteCombibox({buildingID, combiboxIndex}))
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
              seteditingCombibox(null)
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
