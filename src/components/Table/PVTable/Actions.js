import React from 'react'
import { Button, Popconfirm, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setPVData } from '../../../store/action/index'
import { getPV, deletePV } from '../../../pages/PVTable/service'

// PV列表中触发删除一个PV
export const DeleteAction = ({ record, setactiveData }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onDelete = () => {
    dispatch(deletePV({ pvID: record.pvID })).then(() => {
      message.success(t('PV.success.deletePV'))
      dispatch(getPV()).then(data => {
        dispatch(setPVData(data))
        setactiveData(data)
      })
    })
  }

  return (
    <Popconfirm
      title={t('warning.delete')}
      onConfirm={onDelete}
      onCancel={() => {
        return
      }}
      okText={t('action.confirm')}
      cancelText={t('action.cancel')}
      placement='topRight'
    >
      <Button type='link' danger icon={<DeleteOutlined />} />
    </Popconfirm>
  )
}
