import React from 'react';
import { Button, Popconfirm, notification, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { deletePV, getPV } from './service';

export const DeleteAction = ({record, setdata, setactiveData}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onDelete = () => {
    dispatch(deletePV({pvID: record.pvID}))
    .then(() => {
      message.success(t('PV.success.deletePV'))
      const response = dispatch(getPV())
      response.then(data => {
        setdata(data)
        setactiveData(data)
      })
    }).catch(err => {
      console.log(err)
      notification.error({
        message: err.errorType,
        description: err.errorMessage
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
