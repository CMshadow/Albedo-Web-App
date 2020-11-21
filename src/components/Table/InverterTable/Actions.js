import React from 'react'
import { Button, Popconfirm, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setInverterData } from '../../../store/action/index'
import { getInverter, deleteInverter } from '../../../pages/InverterTable/service'

// Inverter列表中触发删除一个Inverter
export const DeleteAction = ({ record, setactiveData }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onDelete = () => {
    dispatch(deleteInverter({ inverterID: record.inverterID })).then(() => {
      message.success(t('Inverter.success.deleteInverter'))
      const response = dispatch(getInverter())
      response.then(data => {
        dispatch(setInverterData(data))
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
