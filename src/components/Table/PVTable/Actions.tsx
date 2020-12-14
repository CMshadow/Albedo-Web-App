import React from 'react'
import { Button, Popconfirm, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setPVData } from '../../../store/action'
import { getPV, deletePV } from '../../../services'
import { PV } from '../../../@types'

type DeleteActionProps = {
  record: PV
}

// PV列表中触发删除一个PV
export const DeleteAction: React.FC<DeleteActionProps> = ({ record }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onDelete = () => {
    deletePV({ pvID: record.pvID }).then(() => {
      message.success(t('PV.success.deletePV'))
      getPV({}).then(data => {
        dispatch(setPVData(data))
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
