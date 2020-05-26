import React from 'react';
import { Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { deleteProject, getProject } from './service';

// Project列表中触发删除一个Project
export const DeleteAction = ({record, setdata, setactiveData}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onDelete = () => {
    dispatch(deleteProject({projectID: record.projectID}))
    .then(() => {
      message.success(t('project.success.deleteProject'))
      dispatch(getProject()).then(data => {
        setdata(data)
        setactiveData(data)
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
