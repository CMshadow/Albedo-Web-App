import React from 'react'
import { Button, Popconfirm, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { getProject } from '../Project/service'
import { deleteProject, getProject as getAllProject } from './service'
import { deleteReport, deleteProductionData, deleteIrradianceData } from '../Report/service'

// Project列表中触发删除一个Project
export const DeleteAction = ({ record, setdata, setactiveData, setloading }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onDelete = () => {
    setloading(true)
    dispatch(getProject({ projectID: record.projectID })).then(async res => {
      await dispatch(deleteProductionData({ projectID: record.projectID }))
      await dispatch(deleteIrradianceData({ projectID: record.projectID }))
      await dispatch(deleteReport({ projectID: record.projectID }))
      await dispatch(deleteProject({ projectID: record.projectID }))
      message.success(t('project.success.deleteProject'))
      dispatch(getAllProject()).then(data => {
        setdata(data)
        setactiveData(data)
        setloading(false)
      })
    })
  }

  return (
    <Popconfirm
      title={t('warning.delete')}
      onConfirm={onDelete}
      onCancel={() => {}}
      okText={t('action.confirm')}
      cancelText={t('action.cancel')}
      placement="topRight"
    >
      <Button type="link" danger icon={<DeleteOutlined />} />
    </Popconfirm>
  )
}
