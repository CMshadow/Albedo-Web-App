import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteCombibox } from '../../../store/action/index'
import styles from './CombinerBoxSpecCard.module.scss'
import { Combibox } from '../../../@types'

type CombinerBoxSpecCardProps = Combibox & {
  id: string
  buildingID: string
  combiboxIndex: number
  editingCombibox: number | undefined
  seteditingCombibox: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const CombinerBoxSpecCard: React.FC<CombinerBoxSpecCardProps> = ({
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
          disabled={editing || editingCombibox !== undefined}
          type='link'
          shape='circle'
          icon={
            <EditTwoTone
              twoToneColor={editing || editingCombibox !== undefined ? '#bfbfbf' : '#1890ff'}
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
                editingCombibox !== undefined && editingCombibox !== combiboxIndex
                  ? '#bfbfbf'
                  : '#f5222d'
              }
            />
          }
          disabled={editingCombibox !== undefined && editingCombibox !== combiboxIndex}
          onClick={() => {
            setloading(true)
            setediting(false)
            seteditingCombibox(undefined)
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
              seteditingCombibox(undefined)
            }}
          />
        ) : (
          <SpecView buildingID={buildingID} combiboxIndex={combiboxIndex} />
        )}
      </div>
    </Card>
  )
}
