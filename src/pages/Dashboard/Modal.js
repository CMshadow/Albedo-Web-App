import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { googleGeocoder, getApiKey } from './service';
import { Form, Input, Select, Row, Col, Modal, Divider, message, Typography, Button, notification } from 'antd';
import GoogleMap from './GoogleMap';
import * as styles from './Modal.module.scss';
const FormItem = Form.Item;
const { Option } = Select;

const labelCol = { xs: {span: 24}, sm: {span: 24}, md: {span: 4}};
const wrapperCol = { xs: {span: 24}, sm: {span: 24}, md: {span: 20}};


export const CreateProjectModal = ({showModal, setshowModal, google}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [validated, setvalidated] = useState(false);
  const [mapPos, setmapPos] = useState({lon: -117.843687, lat: 33.676542})
  const [googleMapKey, setgoogleMapKey] = useState('')
  const [aMapKey, setaMapKey] = useState('')
  const [form] = Form.useForm();

  //调用服务验证用户输入地址
  const validateAddress = () => {
    const address = form.getFieldValue('address')
    dispatch(googleGeocoder({address: address}))
    .then(res => {
      const payload = res.data.payload
      if (payload.length === 0) {
        notification.error({message: t('project.error.invalid-address')})
      } else {
        form.setFieldsValue({address: payload[0].formatted_address})
        setvalidated(true)
        setmapPos({
          lon: payload[0].geometry.location.lng,
          lat: payload[0].geometry.location.lat
        })
      }
    })
    .catch(err => {
      notification.error({message: t(`error.http`)})
    })
  }

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  // modal被关闭后回调
  const onClose = () => {
  }

  // modal取消键onclick
  const handleCancel = () => {
    setshowModal(false);
  };

  // modal确认键onclick
  const handleOk = () => {
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setmapPos({lon: pos.coords.longitude, lat: pos.coords.latitude})
      });
    }
    dispatch(getApiKey())
    .then(res => {
      setgoogleMapKey(res.data.payload.GOOGLE_MAP_API_KEY)
    })
  }, [dispatch])

  return (
    <Modal
      title={t('project.create-project')}
      visible={showModal}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={handleCancel}
      okText={t('action.confirm')}
      cancelText={t('action.cancel')}
      maskClosable={false}
      width={'50vw'}
      afterClose={onClose}
    >
      <GoogleMap mapPos={mapPos} validated={validated} apiKey={googleMapKey}/>
      <Divider />
      <Form
        colon={false}
        form={form}
        className={styles.form}
        name="create-Project"
        scrollToFirstError
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        hideRequiredMark
        validateMessages={validateMessages}
        // onFinish={submitForm}
      >
        <FormItem
          name='title'
          label={t('project.create.title')}
          required
        >
          <Input placeholder={t('project.create.title.placeholder')} />
        </FormItem>
        <FormItem
          name='address'
          label={t('project.create.address')}
          required
        >
          <Input.Search
            onSearch={() => validateAddress()}
            enterButton={<Button danger={!validated}>{t('project.create.validation')}</Button>}
            placeholder={t('project.create.address.placeholder')}
          />
        </FormItem>
        <FormItem
          name='type'
          label={t('project.create.type')}
          required
        >
          <Select>
            <Option key='domestic' value='domestic'>{t(`project.type.domestic`)}</Option>
            <Option key='commercial' value='commercial'>{t(`project.type.commercial`)}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  )
}
