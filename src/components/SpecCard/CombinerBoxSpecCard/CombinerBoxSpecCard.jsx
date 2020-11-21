import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteCombibox } from '../../../store/action/index'
import * as styles from './CombinerBoxSpecCard.module.scss'

export const CombinerBoxSpecCard = ({
  id,
  buildingID,
  combiboxIndex,
  editingCombibox,
  seteditingCombibox,
  ...props
}) => {
  const dispatch = useDispatch()
  const [editing, setediting] = useState(props.combibox_vac === null)
  const [loading, setloading] = useState(false)

  return (
    <Card
      id={id}
      className={styles.card}
      bodyStyle={{ padding: 0 }}
      loading={loading}
      actions={[
        <Button
          key='edit'
          disabled={editing || editingCombibox !== null}
          type='link'
          shape='circle'
          icon={
            <EditTwoTone
              twoToneColor={editing || editingCombibox !== null ? '#bfbfbf' : '#1890ff'}
            />
          }
          onClick={() => {
            setediting(true)
            seteditingCombibox(combiboxIndex)
          }}
        />,
        <Button
          key='delete'
          type='link'
          shape='circle'
          danger
          icon={
            <DeleteTwoTone
              twoToneColor={
                editingCombibox !== null && editingCombibox !== combiboxIndex
                  ? '#bfbfbf'
                  : '#f5222d'
              }
            />
          }
          disabled={editingCombibox !== null && editingCombibox !== combiboxIndex}
          onClick={() => {
            setloading(true)
            setediting(false)
            seteditingCombibox(null)
            setTimeout(() => {
              setloading(false)
              dispatch(deleteCombibox({ buildingID, combiboxIndex }))
            }, 500)
          }}
        />,
      ]}
    >
      <div className={styles.content}>
        {editing ? (
          <EditForm
            buildingID={buildingID}
            combiboxIndex={combiboxIndex}
            seteditingFalse={() => {
              setediting(false)
              seteditingCombibox(null)
            }}
          />
        ) : (
          <SpecView buildingID={buildingID} combiboxIndex={combiboxIndex} />
        )}
      </div>
    </Card>
  )
}
