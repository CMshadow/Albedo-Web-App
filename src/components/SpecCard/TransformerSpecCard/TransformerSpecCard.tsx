import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deleteTransformer } from '../../../store/action/index'
import styles from './TransformerSpecCard.module.scss'
import { Transformer } from '../../../@types'

type TransformerSpecCardProps = Transformer & {
  id: string
  transformerIndex: number
  editingTransformer: number | undefined
  seteditingTransformer: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const TransformerSpecCard: React.FC<TransformerSpecCardProps> = ({
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
          key='edit'
          disabled={editing || editingTransformer !== undefined}
          type='link'
          shape='circle'
          icon={
            <EditTwoTone
              twoToneColor={editing || editingTransformer !== undefined ? '#bfbfbf' : '#1890ff'}
            />
          }
          onClick={() => {
            setediting(true)
            seteditingTransformer(transformerIndex)
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
                editingTransformer !== undefined && editingTransformer !== transformerIndex
                  ? '#bfbfbf'
                  : '#f5222d'
              }
            />
          }
          disabled={editingTransformer !== undefined && editingTransformer !== transformerIndex}
          onClick={() => {
            setloading(true)
            setediting(false)
            seteditingTransformer(undefined)
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
              seteditingTransformer(undefined)
            }}
          />
        ) : (
          <SpecView transformerIndex={transformerIndex} />
        )}
      </div>
    </Card>
  )
}
