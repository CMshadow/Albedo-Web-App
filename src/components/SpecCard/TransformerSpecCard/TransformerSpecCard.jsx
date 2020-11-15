import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteTransformer } from '../../../store/action/index'
import * as styles from './TransformerSpecCard.module.scss'

export const TransformerSpecCard = ({
  id,
  transformerIndex,
  editingTransformer,
  seteditingTransformer,
  ...props
}) => {
  const dispatch = useDispatch()
  const [editing, setediting] = useState(props.transformer_name === null)
  const [loading, setloading] = useState(false)

  return (
    <Card
      id={id}
      className={styles.card}
      bodyStyle={{ padding: 0 }}
      loading={loading}
      actions={[
        <Button
          disabled={editing || editingTransformer !== null}
          type="link"
          shape="circle"
          icon={
            <EditTwoTone
              twoToneColor={editing || editingTransformer !== null ? '#bfbfbf' : '#1890ff'}
            />
          }
          onClick={() => {
            setediting(true)
            seteditingTransformer(transformerIndex)
          }}
        />,
        <Button
          type="link"
          shape="circle"
          danger
          icon={
            <DeleteTwoTone
              twoToneColor={
                editingTransformer !== null && editingTransformer !== transformerIndex
                  ? '#bfbfbf'
                  : '#f5222d'
              }
            />
          }
          disabled={editingTransformer !== null && editingTransformer !== transformerIndex}
          onClick={() => {
            setloading(true)
            setediting(false)
            seteditingTransformer(null)
            setTimeout(() => {
              setloading(false)
              dispatch(deleteTransformer(transformerIndex))
            }, 500)
          }}
        />,
      ]}
    >
      <div className={styles.content}>
        {editing ? (
          <EditForm
            transformerIndex={transformerIndex}
            seteditingFalse={() => {
              setediting(false)
              seteditingTransformer(null)
            }}
          />
        ) : (
          <SpecView transformerIndex={transformerIndex} />
        )}
      </div>
    </Card>
  )
}
