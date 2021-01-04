import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Form, Input, Tabs, notification, Button, Divider, Select } from 'antd'
import { other2m } from '../../utils/unitConverter'
import { AMap } from '../../components/AMap'
import { GoogleMap } from '../../components/GoogleMap'
import { amapGeocoder, googleGeocoder, getApiKey, createWeatherPortfolio } from '../../services'
import styles from './Modal.module.scss'

import { RootState } from '../../@types'

const { TabPane } = Tabs

const labelCol = { xs: { span: 24 }, sm: { span: 24 }, md: { span: 5 } }
const wrapperCol = { xs: { span: 24 }, sm: { span: 24 }, md: { span: 15, offset: 1 } }

type CreateModalProps = {
  showModal: boolean
  setshowModal: React.Dispatch<React.SetStateAction<boolean>>
  afterClose?: () => void
}

export const CreateModal: React.FC<CreateModalProps> = props => {
  const [form] = Form.useForm()
  const { showModal, setshowModal, afterClose } = props
  const { t } = useTranslation()
  const unit = useSelector((state: RootState) => state.unit.unit)
  const cognitoUser = useSelector((state: RootState) => state.auth.cognitoUser)
  const [validated, setvalidated] = useState(false)
  const [mapPos, setmapPos] = useState(
    cognitoUser && cognitoUser.attributes.locale === 'en-US'
      ? { lon: -117.843687, lat: 33.676542 }
      : { lon: 116.397606, lat: 39.907969 }
  )
  const [googleMapKey, setgoogleMapKey] = useState<string>()
  const [aMapKey, setaMapKey] = useState<string>()
  const [aMapWebKey, setaMapWebKey] = useState<string>()
  const [selectedMap, setselectedMap] = useState<string>(
    cognitoUser && cognitoUser.attributes.locale === 'zh-CN' ? 'aMap' : 'googleMap'
  )
  const [loading, setloading] = useState(false)

  // 组件渲染后获取浏览器位置 及 获取地图服务api key
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setmapPos({ lon: pos.coords.longitude, lat: pos.coords.latitude })
      })
    }
    getApiKey({}).then(data => {
      setgoogleMapKey(data.GOOGLE_MAP_API_KEY)
      setaMapKey(data.A_MAP_API_KEY)
      setaMapWebKey(data.A_MAP_WEB_API_KEY)
    })
  }, [])

  // modal取消键onclick
  const handleCancel = () => {
    setshowModal(false)
  }

  // modal确认键onclick
  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form
      .validateFields()
      .then(() => {
        setloading(true)
        form.submit()
      })
      .catch(err => {
        form.scrollToField(err.errorFields[0].name[0])
        return
      })
  }

  // 表单提交
  const submitForm = (values: {
    name: string
    address: string
    altitude: string
    mode: 'tmy' | 'processed'
  }) => {
    const altitude = other2m(unit, Number(values.altitude))
    createWeatherPortfolio({
      name: values.name,
      address: values.address,
      longitude: Number(mapPos.lon),
      latitude: Number(mapPos.lat),
      altitude: altitude,
      mode: values.mode,
    })
      .then(() => {
        setTimeout(() => {
          setloading(false)
          setshowModal(false)
        }, 10000)
      })
      .catch(() => {
        setloading(false)
      })
  }

  // 高德的地理编码解析
  const amapDecode = () => {
    if (!aMapWebKey) return
    const address = form.getFieldValue('address')
    amapGeocoder({ address: address, key: aMapWebKey })
      .then(res => {
        const payload = res.geocodes
        if (payload.length === 0) {
          setvalidated(false)
          if (selectedMap === 'aMap') {
            notification.error({ message: t('project.error.invalid-address.amap') })
          } else {
            notification.error({ message: t('project.error.invalid-address.googlemap') })
          }
        } else {
          form.setFieldsValue({ address: payload[0].formatted_address })
          setvalidated(true)
          setmapPos({
            lon: Number(payload[0].location.split(',')[0]),
            lat: Number(payload[0].location.split(',')[1]),
          })
        }
      })
      .catch(() => {
        setvalidated(false)
        notification.error({ message: t(`error.http`) })
      })
  }

  // 谷歌的地理编码解析
  const googleDecode = () => {
    if (!googleMapKey) return
    const address = form.getFieldValue('address')
    googleGeocoder({ address: address, key: googleMapKey })
      .then(res => {
        const payload = res.results
        if (payload.length === 0) {
          setvalidated(false)
          notification.error({ message: t('project.error.invalid-address') })
        } else {
          form.setFieldsValue({ address: payload[0].formatted_address })
          setvalidated(true)
          setmapPos({
            lon: payload[0].geometry.location.lng,
            lat: payload[0].geometry.location.lat,
          })
        }
      })
      .catch(err => {
        console.log(err)
        setvalidated(false)
        notification.error({ message: t(`error.http`) })
      })
  }

  //调用服务验证用户输入地址
  const validateAddress = () => {
    if (selectedMap === 'aMap') amapDecode()
    else googleDecode()
  }

  return (
    <Modal
      visible={showModal}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={handleCancel}
      okButtonProps={{ disabled: !validated }}
      okText={t('action.confirm')}
      cancelText={t('action.cancel')}
      maskClosable={false}
      width={'50vw'}
      afterClose={afterClose}
    >
      <Tabs
        defaultActiveKey={selectedMap}
        animated={false}
        type='card'
        onChange={activeKey => setselectedMap(activeKey)}
      >
        <TabPane tab={t(`project.map.aMap`)} key='aMap' forceRender>
          {aMapWebKey && aMapKey ? (
            <AMap
              mapPos={mapPos}
              validated={validated}
              apiKey={aMapKey}
              webApiKey={aMapWebKey}
              onClick={(e, res) => {
                if (res.regeocode.formatted_address.length > 0) {
                  setmapPos({ lon: e.lnglat.lng, lat: e.lnglat.lat })
                  form.setFieldsValue({ address: res.regeocode.formatted_address })
                  setvalidated(true)
                } else {
                  notification.error({ message: t('project.error.invalid-address.amap') })
                }
              }}
            />
          ) : null}
        </TabPane>
        <TabPane tab={t(`project.map.googleMap`)} key='googleMap' forceRender>
          {googleMapKey ? (
            <GoogleMap
              mapPos={mapPos}
              validated={validated}
              apiKey={googleMapKey}
              onClick={(event, res) => {
                if (res.results.length > 0) {
                  setmapPos({ lon: event.lng, lat: event.lat })
                  form.setFieldsValue({ address: res.results[0].formatted_address })
                  setvalidated(true)
                } else {
                  notification.error({ message: t('project.error.invalid-address.googlemap') })
                }
              }}
            />
          ) : null}
        </TabPane>
      </Tabs>
      <Divider />
      <Form
        colon={false}
        preserve={false}
        form={form}
        className={styles.form}
        name='create-weatherPortfolio'
        scrollToFirstError
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        hideRequiredMark
        onFinish={submitForm}
      >
        <Form.Item
          name='name'
          label={t('weatherManager.portfolio.name')}
          rules={[{ required: true }]}
        >
          <Input placeholder={t('weatherManager.portfolio.name.placeholder')} />
        </Form.Item>
        <Form.Item
          name='address'
          label={t('weatherManager.portfolio.address')}
          rules={[{ required: true }]}
        >
          <Input.Search
            onSearch={() => validateAddress()}
            enterButton={
              <Button danger={!validated}>
                {validated
                  ? t('weatherManager.portfolio.address.verified')
                  : t('weatherManager.portfolio.address.unverified')}
              </Button>
            }
            placeholder={t('weatherManager.portfolio.address.placeholder')}
          />
        </Form.Item>
        <Form.Item
          name='altitude'
          label={t('weatherManager.portfolio.altitude')}
          rules={[{ required: true }]}
        >
          <Input
            type='number'
            placeholder={t('weatherManager.portfolio.altitude.placeholder')}
            suffix={unit}
          />
        </Form.Item>
        <Form.Item
          name='mode'
          label={t('weatherManager.portfolio.mode')}
          rules={[{ required: true }]}
        >
          <Select
            placeholder={t('weatherManager.portfolio.mode.placeholder')}
            options={[
              { value: 'processed', label: t('weatherManager.portfolio.mode.processed') },
              { value: 'tmy', label: t('weatherManager.portfolio.mode.tmy') },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
