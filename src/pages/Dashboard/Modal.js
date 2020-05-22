import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { amapGeocoder, googleGeocoder, getApiKey } from './service';
import { Tabs, Form, Input, Select, Modal, Divider, Button, notification, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getLanguage } from '../../utils/getLanguage';
import GoogleMap from './GoogleMap';
import AMap from './AMap';
import * as styles from './Modal.module.scss';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

const labelCol = { xs: {span: 24}, sm: {span: 24}, md: {span: 4}};
const wrapperCol = { xs: {span: 24}, sm: {span: 24}, md: {span: 20}};

const initValues = {projectType: 'domestic'}

export const CreateProjectModal = ({showModal, setshowModal, google}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [validated, setvalidated] = useState(false);
  const [mapPos, setmapPos] = useState({lon: -117.843687, lat: 33.676542})
  const [googleMapKey, setgoogleMapKey] = useState('')
  const [aMapKey, setaMapKey] = useState('')
  const [aMapWebKey, setaMapWebKey] = useState('')
  const [selectedMap, setselectedMap] = useState(getLanguage() === 'zh-CN' ? 'aMap' : 'googleMap')
  const [form] = Form.useForm();

  // 高德的地理编码解析
  const amapDecode = () => {
    const address = form.getFieldValue('address')
    amapGeocoder({address: address, key: aMapWebKey})
    .then(res => {
      const payload = res.data.geocodes
      if (payload.length === 0) {
        setvalidated(false)
        notification.error({message: t('project.error.invalid-address')})
      } else {
        form.setFieldsValue({address: payload[0].formatted_address})
        setvalidated(true)
        setmapPos({
          lon: payload[0].location.split(',')[0],
          lat: payload[0].location.split(',')[1]
        })
      }
    })
    .catch(err => {
      setvalidated(false)
      notification.error({message: t(`error.http`)})
    })
  }

  // 谷歌的地理编码解析
  const googleDecode = () => {
    console.log('hello')
    const address = form.getFieldValue('address')
    googleGeocoder({address: address, key: googleMapKey})
    .then(res => {
      console.log(res)
      const payload = res.data.results
      if (payload.length === 0) {
        setvalidated(false)
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
      console.log(err)
      setvalidated(false)
      notification.error({message: t(`error.http`)})
    })
  }

  //调用服务验证用户输入地址
  const validateAddress = () => {
    if (selectedMap === 'aMap') amapDecode()
    else googleDecode()
  }

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  // modal取消键onclick
  const handleCancel = () => {
    setshowModal(false);
  };

  // modal确认键onclick
  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form.validateFields()
    .then(success => {
      console.log(success)
      setloading(true);
      form.submit()
    })
    .catch(err => {
      form.scrollToField(err.errorFields[0].name[0])
      return
    })
  }

  // 表单提交
  const submitForm = (values) => {
    console.log(values)
  }

  // 组件渲染后获取浏览器位置 及 获取地图服务api key
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setmapPos({lon: pos.coords.longitude, lat: pos.coords.latitude})
      });
    }
    dispatch(getApiKey())
    .then(res => {
      setgoogleMapKey(res.data.payload.GOOGLE_MAP_API_KEY)
      setaMapKey(res.data.payload.A_MAP_API_KEY)
      setaMapWebKey(res.data.payload.A_MAP_WEB_API_KEY)
    })
  }, [dispatch])

  return (
    <Modal
      title={t('project.create-project')}
      visible={showModal}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={handleCancel}
      okButtonProps={{disabled: !validated}}
      okText={t('action.confirm')}
      cancelText={t('action.cancel')}
      maskClosable={false}
      width={'50vw'}
      style={{ top: 20 }}
    >

      <Tabs
        defaultActiveKey={selectedMap}
        animated={false}
        type="card"
        onChange={activeKey => setselectedMap(activeKey)}
      >
        <TabPane
          tab={t(`project.map.aMap`)}
          key="aMap"
          forceRender
        >
          <AMap mapPos={mapPos} validated={validated} apiKey={aMapKey} />
        </TabPane>
        <TabPane
          tab={t(`project.map.googleMap`)}
          key="googleMap"
          forceRender
        >
          <GoogleMap mapPos={mapPos} validated={validated} apiKey={googleMapKey}/>
        </TabPane>
      </Tabs>

      <Divider />

      <Form
        colon={false}
        form={form}
        className={styles.form}
        initialValues={initValues}
        name="create-Project"
        scrollToFirstError
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        hideRequiredMark
        validateMessages={validateMessages}
        onFinish={submitForm}
      >
        <FormItem name='projectTitle' label={t('project.create.title')} rules={[{required: true}]}>
          <Input placeholder={t('project.create.title.placeholder')} />
        </FormItem>
        <FormItem name='projectAddress'
          label={
            <div>
              <Tooltip title={t(`project.create.address.hint`)}>
                <QuestionCircleOutlined className={styles.icon}/>
              </Tooltip>
              {t('project.create.address')}
            </div>
          }
          rules={[{required: true}]}
        >
          <Input.Search
            onSearch={() => validateAddress()}
            enterButton={<Button danger={!validated}>{t('project.create.validation')}</Button>}
            placeholder={t('project.create.address.placeholder')}
          />
        </FormItem>
        <FormItem name='projectType' label={t('project.create.type')} rules={[{required: true}]}>
          <Select>
            <Option key='domestic' value='domestic'>{t(`project.type.domestic`)}</Option>
            <Option key='commercial' value='commercial'>{t(`project.type.commercial`)}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  )
}
