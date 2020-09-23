import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { amapGeocoder, googleGeocoder, getApiKey, createProject } from './service';
import { Tabs, Form, Input, Select, Modal, Divider, Button, notification, Tooltip, Collapse, Slider } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { genFullName } from '../../utils/genFullName';
import GoogleMap from './GoogleMap';
import AMap from './AMap';
import * as styles from './Modal.module.scss';

const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const labelCol = { xs: {span: 24}, sm: {span: 24}, md: {span: 5}};
const wrapperCol = { xs: {span: 24}, sm: {span: 24}, md: {span: 15, offset: 1}};
const markStyle = {overflow: 'hidden', whiteSpace: 'nowrap'}

const initValues = {
  projectType: 'domestic',
  albedo: 0.3,
  DCVolDropFac: 1,
  ACVolDropFac: 2
}

export const CreateProjectModal = ({showModal, setshowModal, google}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const cognitoUser = useSelector(state => state.auth.cognitoUser)
  const unit = useSelector(state => state.unit.unit)
  const [loading, setloading] = useState(false);
  const [validated, setvalidated] = useState(false);
  const [mapPos, setmapPos] = useState({lon: -117.843687, lat: 33.676542})
  const [googleMapKey, setgoogleMapKey] = useState('')
  const [aMapKey, setaMapKey] = useState('')
  const [aMapWebKey, setaMapWebKey] = useState('')
  const [selectedMap, setselectedMap] = useState(cognitoUser.attributes.locale === 'zh-CN' ? 'aMap' : 'googleMap')
  const [form] = Form.useForm();

  // albedo几个预设值
  const albedoMarks = {
    0: t('project.create.albedo.shadow'),
    0.15: t('project.create.albedo.forest'),
    0.3: t('project.create.albedo.urban'),
    0.4: t('project.create.albedo.desert'),
    1: t('project.create.albedo.full')
  };

  // ACVolDropFac标识
  const ACVolDropFacMarks = {
    0.1: t('report.paramsForm.drop_0.1'),
    5:  {style: markStyle, label: t('report.paramsForm.drop_5')}
  }

  // DCVolDropFac标识
  const DCVolDropFacMarks = {
    0.1: t('report.paramsForm.drop_0.1'),
    2: {style: markStyle, label: t('report.paramsForm.drop_2')}
  }

  // 高德的地理编码解析
  const amapDecode = () => {
    const address = form.getFieldValue('projectAddress')
    amapGeocoder({address: address, key: aMapWebKey})
    .then(res => {
      const payload = res.data.geocodes
      if (payload.length === 0) {
        setvalidated(false)
        if (selectedMap === 'aMap') {
          notification.error({message: t('project.error.invalid-address.amap')})
        } else {
          notification.error({message: t('project.error.invalid-address.googlemap')})
        }
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
    const address = form.getFieldValue('projectAddress')
    googleGeocoder({address: address, key: googleMapKey})
    .then(res => {
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
    .then(() => {
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
    dispatch(createProject({
      ...values,
      projectCreator: genFullName(cognitoUser),
      longitude: Number(mapPos.lon),
      latitude: Number(mapPos.lat)
    }))
    .then(data => {
      setloading(false)
      setshowModal(false)
      history.push(`project/${data.projectID}/dashboard`);
    }).catch(err => {
      setloading(false)
    })
  }

  // 组件渲染后获取浏览器位置 及 获取地图服务api key
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setmapPos({lon: pos.coords.longitude, lat: pos.coords.latitude})
      });
    }
    dispatch(getApiKey())
    .then(data => {
      setgoogleMapKey(data.GOOGLE_MAP_API_KEY)
      setaMapKey(data.A_MAP_API_KEY)
      setaMapWebKey(data.A_MAP_WEB_API_KEY)
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
      width={'75vw'}
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
          <AMap
            mapPos={mapPos}
            setmapPos={setmapPos}
            validated={validated}
            setvalidated={setvalidated}
            apiKey={aMapKey}
            webApiKey={aMapWebKey}
            form={form}
          />
        </TabPane>
        <TabPane
          tab={t(`project.map.googleMap`)}
          key="googleMap"
          forceRender
        >
          <GoogleMap
            mapPos={mapPos}
            setmapPos={setmapPos}
            validated={validated}
            setvalidated={setvalidated}
            apiKey={googleMapKey}
            form={form}
          />
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
                {t('project.create.address')}
              </Tooltip>
            </div>
          }
          rules={[{required: true}]}
        >
          <Input.Search
            onSearch={() => validateAddress()}
            enterButton={
              <Button danger={!validated}>
                {
                  validated ?
                  t('project.create.validation.finished') :
                  t('project.create.validation.unfinished')
                }
              </Button>
            }
            placeholder={t('project.create.address.placeholder')}
          />
        </FormItem>
        <FormItem name='projectAltitude' label={t('project.create.projectAltitude')} rules={[{required: true}]}>
          <Input placeholder={t('project.create.projectAltitude.placeholder')} suffix={unit}/>
        </FormItem>
        <FormItem name='projectType' label={t('project.create.type')} rules={[{required: true}]}>
          <Select>
            <Option key='domestic' value='domestic'>{t(`project.type.domestic`)}</Option>
            <Option key='commercial' value='commercial'>{t(`project.type.commercial`)}</Option>
          </Select>
        </FormItem>
        <Collapse bordered={false}>
          <Panel
            className={styles.collapsePanel}
            header={t('project.create.proParams')}
            key="pro"
            forceRender
          >
            <FormItem
              name='albedo'
              label={t('project.create.albedo')}
              rules={[{required: true}]}
            >
              <Slider marks={albedoMarks} step={0.05} max={1}/>
            </FormItem>
            <FormItem
              name='DCVolDropFac'
              label={t('project.create.DCVolDropFac')}
              rules={[{required: true}]}
            >
              <Slider marks={DCVolDropFacMarks} step={0.05} min={0.1} max={2}/>
            </FormItem>
            <FormItem
              name='ACVolDropFac'
              label={t('project.create.ACVolDropFac')}
              rules={[{required: true}]}
            >
              <Slider marks={ACVolDropFacMarks} step={0.05} min={0.1} max={5}/>
            </FormItem>
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  )
}
