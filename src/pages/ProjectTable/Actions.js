import React from 'react';
import { Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getProject } from '../Project/service'
import { deleteProject, getProject as getAllProject } from './service';
import { deleteReport, deleteProductionData } from '../Report/service'

// Project列表中触发删除一个Project
export const DeleteAction = ({record, setdata}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onDelete = () => {
    dispatch(getProject({projectID: record.projectID}))
    .then(async res => {
      await Promise.all(res.buildings.map(building =>
        dispatch(deleteReport({projectID: record.projectID, buildingID: building.buildingID}))
      ))
      await Promise.all(res.buildings.map(building =>
        dispatch(deleteProductionData({projectID: record.projectID, buildingID: building.buildingID}))
      ))
      dispatch(deleteProject({projectID: record.projectID}))
      .then(() => {
        message.success(t('project.success.deleteProject'))
        dispatch(getAllProject()).then(data => {
          setdata(data)
        })
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
