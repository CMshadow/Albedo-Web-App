import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  amapGeocoder,
  googleGeocoder,
  getApiKey,
  createProject,
  getWeatherPortfolio,
  googleElevation,
} from '../../services'
import {
  Tabs,
  Form,
  Input,
  Select,
  Modal,
  Divider,
  Button,
  notification,
  Tooltip,
  Collapse,
  Slider,
} from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { genFullName } from '../../utils/genFullName'
import { GoogleMap } from '../../components/GoogleMap'
import { AMap } from '../../components/AMap'
import styles from './Modal.module.scss'
import { ProjectPreUpload, RootState, WeatherPortfolio } from '../../@types'
import { m2other } from '../../utils/unitConverter'

const FormItem = Form.Item
const { Option } = Select
const { Panel } = Collapse
const { TabPane } = Tabs

const labelCol = { xs: { span: 24 }, sm: { span: 24 }, md: { span: 5 } }
const wrapperCol = { xs: { span: 24 }, sm: { span: 24 }, md: { span: 15, offset: 1 } }
const markStyle = { overflow: 'hidden', whiteSpace: 'nowrap' }

const initValues = {
  projectType: 'domestic',
  albedo: 0.3,
  DCVolDropFac: 1,
  ACVolDropFac: 2,
}

type CreateProjectModalProps = {
  showModal: boolean
  setshowModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = props => {
  const { showModal, setshowModal } = props
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const cognitoUser = useSelector((state: RootState) => state.auth.cognitoUser)
  const unit = useSelector((state: RootState) => state.unit.unit)
  const [loading, setloading] = useState(false)
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
  const [weatherPortfolio, setweatherPortfolio] = useState<WeatherPortfolio[]>([])
  const [form] = Form.useForm()

  // albedo几个预设值
  const albedoMarks = {
    0: t('project.create.albedo.shadow'),
    0.15: t('project.create.albedo.forest'),
    0.3: t('project.create.albedo.urban'),
    0.4: t('project.create.albedo.desert'),
    1: t('project.create.albedo.full'),
  }

  // ACVolDropFac标识
  const ACVolDropFacMarks = {
    0.1: t('report.paramsForm.drop_0.1'),
    5: { style: markStyle, label: t('report.paramsForm.drop_5') },
  }

  // DCVolDropFac标识
  const DCVolDropFacMarks = {
    0.1: t('report.paramsForm.drop_0.1'),
    2: { style: markStyle, label: t('report.paramsForm.drop_2') },
  }

  // 高德的地理编码解析
  const amapDecode = () => {
    if (!aMapWebKey) return
    const address = form.getFieldValue('projectAddress')
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
    const address = form.getFieldValue('projectAddress')
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

  // modal取消键onclick
  const handleCancel = () => {
    setshowModal(false)
  }

  // modal确认键onclick
  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form
      .validateFields()
      .then(() => form.submit())
      .catch(err => {
        form.scrollToField(err.errorFields[0].name[0])
        return
      })
  }

  // 表单提交
  const submitForm = (
    values: Omit<ProjectPreUpload, 'projectCreator' | 'longitude' | 'latitude'> & {
      weatherSrc: string
    }
  ) => {
    if (!cognitoUser) return
    setloading(true)
    createProject({
      values: {
        ...values,
        projectCreator: genFullName(cognitoUser) || '',
        longitude: Number(mapPos.lon),
        latitude: Number(mapPos.lat),
      },
    })
      .then(data => {
        setloading(false)
        setshowModal(false)
        history.push(`project/${data.projectID}/dashboard`)
      })
      .catch(() => {
        setloading(false)
      })
  }

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
  }, [dispatch])

  // 组建渲染后获取该用户的所有天气档案并生成下拉菜单选项
  useEffect(() => {
    getWeatherPortfolio({}).then(res => setweatherPortfolio(res))
  }, [])

  return (
    <Modal
      title={t('project.create-project')}
      forceRender
      visible={showModal}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={handleCancel}
      okButtonProps={{ disabled: !validated }}
      okText={t('action.confirm')}
      cancelText={t('action.cancel')}
      maskClosable={false}
      width={'75vw'}
      style={{ top: 20 }}
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
                  form.setFieldsValue({ projectAddress: res.regeocode.formatted_address })
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
                  form.setFieldsValue({ projectAddress: res.results[0].formatted_address })
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
        initialValues={initValues}
        name='create-Project'
        scrollToFirstError
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        hideRequiredMark
        onFinish={submitForm}
      >
        <FormItem
          name='projectTitle'
          label={t('project.create.title')}
          rules={[{ required: true }]}
        >
          <Input placeholder={t('project.create.title.placeholder')} />
        </FormItem>
        <FormItem
          name='projectAddress'
          label={
            <div>
              <Tooltip title={t(`project.create.address.hint`)}>
                <QuestionCircleOutlined className={styles.icon} />
                {t('project.create.address')}
              </Tooltip>
            </div>
          }
          rules={[{ required: true }]}
        >
          <Input.Search
            onSearch={() => validateAddress()}
            enterButton={
              <Button danger={!validated}>
                {validated
                  ? t('project.create.validation.finished')
                  : t('project.create.validation.unfinished')}
              </Button>
            }
            placeholder={t('project.create.address.placeholder')}
          />
        </FormItem>
        <FormItem
          name='projectAltitude'
          label={t('project.create.projectAltitude')}
          rules={[{ required: true }]}
        >
          <Input.Search
            type='number'
            onSearch={() =>
              googleMapKey &&
              googleElevation({
                lon: mapPos.lon,
                lat: mapPos.lat,
                key: googleMapKey,
              })
                .then(res => {
                  const val = m2other(unit, res.elevation)
                  form.setFieldsValue({ projectAltitude: Number(val.toFixed(2)) })
                })
                .catch(() => notification.error({ message: 'Failed finding elevation' }))
            }
            enterButton={
              <Button disabled={!validated}>{t('project.create.projectAltitude.auto')}</Button>
            }
            placeholder={t('project.create.projectAltitude.placeholder')}
            suffix={unit}
          />
        </FormItem>
        <FormItem name='projectType' label={t('project.create.type')} rules={[{ required: true }]}>
          <Select>
            <Option key='domestic' value='domestic'>
              {t(`project.type.domestic`)}
            </Option>
            <Option key='commercial' value='commercial'>
              {t(`project.type.commercial`)}
            </Option>
          </Select>
        </FormItem>
        <FormItem
          name='weatherSrc'
          label={t('project.create.weatherSrc')}
          rules={[{ required: true }]}
        >
          <Select
            showSearch
            placeholder={t('project.create.weatherSrc.placeholder')}
            dropdownRender={nodes => (
              <div>
                {nodes}
                <Button
                  block
                  type='primary'
                  onClick={() => history.push('/weather', { defaultShowModal: true })}
                >
                  {t('weatherManager.add')}
                </Button>
              </div>
            )}
            filterOption={(val, option) =>
              option?.label?.toString().toLowerCase().includes(val.toLowerCase()) ?? false
            }
          >
            {weatherPortfolio
              .sort((a, b) => -(a.createdAt - b.createdAt))
              .map(portfolio => (
                <Select.OptGroup key={portfolio.portfolioID} label={portfolio.name}>
                  {portfolio.meteonorm_src && (
                    <Select.Option value={`${portfolio.portfolioID}|meteonorm`}>
                      {`${portfolio.name} - ${t('weatherManager.portfolio.meteonorm')}`}
                    </Select.Option>
                  )}
                  {portfolio.nasa_src && (
                    <Select.Option value={`${portfolio.portfolioID}|nasa`}>
                      {`${portfolio.name} - ${t('weatherManager.portfolio.nasa')}`}
                    </Select.Option>
                  )}
                  {portfolio.custom_src && (
                    <Select.Option value={`${portfolio.portfolioID}|custom`}>
                      {`${portfolio.name} - ${t('weatherManager.portfolio.custom')}`}
                    </Select.Option>
                  )}
                </Select.OptGroup>
              ))}
          </Select>
        </FormItem>
        <Collapse bordered={false}>
          <Panel
            className={styles.collapsePanel}
            header={t('project.create.proParams')}
            key='pro'
            forceRender
          >
            <FormItem name='albedo' label={t('project.create.albedo')} rules={[{ required: true }]}>
              <Slider marks={albedoMarks} step={0.05} max={1} />
            </FormItem>
            <FormItem
              name='DCVolDropFac'
              label={t('project.create.DCVolDropFac')}
              rules={[{ required: true }]}
            >
              <Slider marks={DCVolDropFacMarks} step={0.05} min={0.1} max={2} />
            </FormItem>
            <FormItem
              name='ACVolDropFac'
              label={t('project.create.ACVolDropFac')}
              rules={[{ required: true }]}
            >
              <Slider marks={ACVolDropFacMarks} step={0.05} min={0.1} max={5} />
            </FormItem>
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  )
}
