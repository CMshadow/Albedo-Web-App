import React from 'react'
import { Button, Popconfirm, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { Project } from '../../@types'
import {
  deleteProject,
  getProject,
  deleteReport,
  deleteProductionData,
  deleteIrradianceData,
} from '../../services'

type DeleteActionType = {
  record: Project
  setdata: React.Dispatch<React.SetStateAction<Project[]>>
  setactiveData: React.Dispatch<React.SetStateAction<Project[]>>
  setloading: React.Dispatch<React.SetStateAction<boolean>>
}
// Project列表中触发删除一个Project
export const DeleteAction = (props: DeleteActionType) => {
  const { record, setdata, setactiveData, setloading } = props
  const { t } = useTranslation()

  const onDelete = async () => {
    setloading(true)
    const allPromise: Promise<void>[] = [
      deleteProductionData({ projectID: record.projectID }),
      deleteIrradianceData({ projectID: record.projectID }),
      deleteReport({ projectID: record.projectID }),
      deleteProject({ projectID: record.projectID }),
    ]
    await Promise.all(allPromise)
    message.success(t('project.success.deleteProject'))
    getProject({}).then(data => {
      setdata(data)
      setactiveData(data)
      setloading(false)
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
