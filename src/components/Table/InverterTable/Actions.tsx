import React from 'react'
import { Button, Popconfirm, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setInverterData } from '../../../store/action'
import { getInverter, deleteInverter } from '../../../services'
import { Inverter } from '../../../@types'

type DeleteActionProps = { record: Inverter }

// Inverter列表中触发删除一个Inverter
export const DeleteAction: React.FC<DeleteActionProps> = ({ record }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onDelete = () => {
    deleteInverter({ inverterID: record.inverterID }).then(() => {
      message.success(t('Inverter.success.deleteInverter'))
      const response = getInverter({})
      response.then(data => {
        dispatch(setInverterData(data))
      })
    })
  }

  return (
    <Popconfirm
      title={t('warning.delete')}
      onConfirm={e => {
        e?.stopPropagation()
        onDelete()
      }}
      onCancel={e => {
        e?.stopPropagation()
        return
      }}
      okText={t('action.confirm')}
      cancelText={t('action.cancel')}
      placement='topRight'
    >
      <Button type='link' danger icon={<DeleteOutlined />} onClick={e => e.stopPropagation()} />
    </Popconfirm>
  )
}
