import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button } from 'antd'
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { EditForm } from './EditForm'
import { SpecView } from './SpecView'
import { deletePowercabinet } from '../../../store/action/index'
import styles from './PowerCabinetSpecCard.module.scss'
import { PowerCabinet } from '../../../@types'

type PowerCabinetSpecCardProps = PowerCabinet & {
  id: string
  powercabinetIndex: number
  editingPowercabinet: number | undefined
  seteditingPowercabinet: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const PowerCabinetSpecCard: React.FC<PowerCabinetSpecCardProps> = ({
  id,
  powercabinetIndex,
  editingPowercabinet,
  seteditingPowercabinet,
  ...props
}) => {
  const dispatch = useDispatch()
  const [editing, setediting] = useState(props.powercabinet_name === null)
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
          disabled={editing || editingPowercabinet !== undefined}
          type='link'
          shape='circle'
          icon={
            <EditTwoTone
              twoToneColor={editing || editingPowercabinet !== undefined ? '#bfbfbf' : '#1890ff'}
            />
          }
          onClick={() => {
            setediting(true)
            seteditingPowercabinet(powercabinetIndex)
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
                editingPowercabinet !== undefined && editingPowercabinet !== powercabinetIndex
                  ? '#bfbfbf'
                  : '#f5222d'
              }
            />
          }
          disabled={editingPowercabinet !== undefined && editingPowercabinet !== powercabinetIndex}
          onClick={() => {
            setloading(true)
            setediting(false)
            seteditingPowercabinet(undefined)
            setTimeout(() => {
              setloading(false)
              dispatch(deletePowercabinet(powercabinetIndex))
            }, 500)
          }}
        />,
      ]}
    >
      <div className={styles.content}>
        {editing ? (
          <EditForm
            powercabinetIndex={powercabinetIndex}
            seteditingFalse={() => {
              setediting(false)
              seteditingPowercabinet(undefined)
            }}
          />
        ) : (
          <SpecView powercabinetIndex={powercabinetIndex} />
        )}
      </div>
    </Card>
  )
}
