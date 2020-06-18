import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'
import { Form, Input, Row, Col, Select, Button, Drawer, Divider, notification, Spin, Space, Descriptions, Tooltip } from 'antd';
import { TableOutlined } from '@ant-design/icons'
import { editPVSpec, setPVActiveData } from '../../store/action/index'
import { setInverterActiveData } from '../../store/action/index'
import { PVTableViewOnly } from '../PVTable/PVTableViewOnly'
import { InverterTableViewOnly } from '../InverterTable/InverterTableViewOnly'
import { manualInverter } from '../../pages/Project/service'
import { w2other } from '../../utils/unitConverter'
const FormItem = Form.Item;
const Item = Descriptions.Item

const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128};

export const EditForm = ({buildingID, specIndex, setediting}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [showPVDrawer, setshowPVDrawer] = useState(false)
  const [showInvDrawer, setshowInvDrawer] = useState(false)
  const [tilt, settilt] = useState({value: null})
  const [azimuth, setazimuth] = useState({value: null})
  const [capacity, setcapacity] = useState(null)
  const [autoInvLoading, setautoInvLoading] = useState(false)
  const [autoInvPlan, setautoInvPlan] = useState({})
  const pvData = useSelector(state => state.pv)
  const inverterData = useSelector(state => state.inverter)
  const projectID = useLocation().pathname.split('/')[2]

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const spec = buildings[buildingIndex].data[specIndex].pv_panel_parameters

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  const handleOk = () => {
    if (tilt.validateStatus === 'error' || azimuth.validateStatus === 'error') {
      return
    }
    // 验证表单，如果通过提交表单
    form.validateFields()
    .then(success => {
      form.submit()
    })
    .catch(err => {
      form.scrollToField(err.errorFields[0].name[0])
      return
    })
  }

  const submitForm = (values) => {
    dispatch(editPVSpec({
      buildingID, specIndex, ...values, invPlan: autoInvPlan,
      pv_userID: pvData.data.find(record => record.pvID === values.pvID).userID,
    }))
    setediting(false)
  }

  const tiltChange = (event) => {
    settilt({ ...validateTilt(event.target.value), value: event.target.value});
  }

  const validateTilt = (tilt) => {
    if (Number(tilt) < 0 || Number(tilt) > 60) {
      return {
        validateStatus: 'error',
        errorMsg: t('project.error.tilt'),
      }
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  const azimuthChange = (event) => {
    setazimuth({ ...validateAzimuth(event.target.value), value: event.target.value});
  }

  const validateAzimuth = (azimuth) => {
    if (Number(azimuth) < 0 || Number(azimuth) > 360) {
      return {
        validateStatus: 'error',
        errorMsg: t('project.error.azimuth'),
      }
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  const genInverterPlan = () => {
    setautoInvLoading(true)
    const inverterID = form.getFieldValue('inverterID')
    const capacity = Number(form.getFieldValue('capacity'))
    const pvID = form.getFieldValue('pvID')
    const pvUserID = pvData.data.find(pv => pv.pvID === pvID).userID
    const pvPmax = pvData.data.find(pv => pv.pvID === pvID).pmax
    const ttlPV = Math.floor(capacity * 1000 / pvPmax)
    const invUserID = inverterData.data.find(inv => inv.inverterID === inverterID).userID
    const invName = inverterData.data.find(inv => inv.inverterID === inverterID).name
    dispatch(manualInverter({
      projectID: projectID, invID: inverterID, invUserID: invUserID,
      pvID: pvID, pvUserID: pvUserID, ttlPV: ttlPV
    }))
    .then(res => {
      setautoInvLoading(false)
      const notiKey = 'notification'
      const actCapacity = w2other((ttlPV - res.wasted) * pvPmax)
      const description = (
        <Descriptions column={1}>
          <Item label={t('project.autoInverter.invModel')} span={1}>
            {invName}
          </Item>
          <Item label={t('project.autoInverter.requiredInv')} span={1}>
            {res.plan.length}
          </Item>
          <Item label={t('project.autoInverter.capacity')} span={1}>
            {`${actCapacity.value} ${actCapacity.unit}`}
          </Item>
          <Item label={t('project.autoInverter.pvConnected')} span={1}>
            {ttlPV - res.wasted}
          </Item>
          <Item label={t('project.autoInverter.detail')} span={1}>
            <Row>
              <Col span={24}>
                {res.plan.map((obj, i) => (
                  <Row>
                    {`
                      ${t('project.spec.string_per_inverter')}: ${obj.spi},
                      ${t('project.spec.panels_per_string')}: ${obj.pps}
                    `}
                  </Row>
                ))}
              </Col>
            </Row>
          </Item>
        </Descriptions>
      )
      const btn = (
        <Space>
          <Button type="primary" onClick={() => {
            setautoInvPlan({
              plan: res.plan, inverterID: inverterID, inverterUserID: invUserID
            })
            notification.close(notiKey)
          }}>
            {t('autoInverter.use')}
          </Button>
          <Button onClick={() => {
            form.setFieldsValue({inverterID: ''})
            setautoInvPlan({})
            notification.close(notiKey)
          }}>
            {t('autoInverter.notuse')}
          </Button>
        </Space>
      )
      notification.info({
        key: notiKey,
        btn: btn,
        message: t('project.autoInverter.title'),
        description: description,
        duration: null,
        onClose: () => {
          form.setFieldsValue({inverterID: ''})
          setautoInvPlan({})
        },
        style: {
          width: 550,
          marginLeft: 375 - 550
        }
      })
    })
  }


  return (
    <Spin spinning={autoInvLoading}>
      <Form
        colon={false}
        form={form}
        hideRequiredMark
        name="newSpec"
        scrollToFirstError
        validateMessages={validateMessages}
        onFinish={submitForm}
        initialValues={{ ...spec, pvID: spec.pv_model.pvID }}
      >
        <Row gutter={12}>
          <Col span={22}>
            <FormItem
              name='pvID'
              label={t('project.spec.pv')}
              rules={[{required: true}]}
            >
              <Select
                options={
                  pvData.activeData.map(record => ({
                    label: record.name,
                    value: record.pvID
                  }))
                }
              />
            </FormItem>
          </Col>
          <Col span={2}>
            <Button
              shape="circle"
              icon={<TableOutlined />}
              onClick={() => setshowPVDrawer(true)}
            />
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col span={12}>
            <FormItem
              name='tilt_angle'
              label={t('project.spec.tilt_angle')}
              rules={[{required: true}]}
              validateStatus={tilt.validateStatus}
              help={tilt.errorMsg || null}
            >
              <Input
                addonAfter='°'
                type='number'
                value={tilt.value}
                onChange={tiltChange}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name='azimuth'
              label={t('project.spec.azimuth')}
              rules={[{required: true}]}
              validateStatus={azimuth.validateStatus}
              help={azimuth.errorMsg || null}
            >
              <Input
                addonAfter='°'
                type='number'
                value={azimuth.value}
                onChange={azimuthChange}
              />
            </FormItem>
          </Col>
        </Row>
        <Divider>
          <Tooltip title={t('project.spec.optional.tooltip')}>
            <QuestionCircleOutlined />
            {t('project.spec.optional')}
          </Tooltip>
        </Divider>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem
              name='capacity'
              label={t('project.spec.capacity')}
            >
              <Input
                addonAfter='kW'
                type='number'
                value={capacity}
                onChange={e => {
                  setcapacity(e.target.value)
                  if (form.getFieldValue('inverterID')) genInverterPlan()
                }}
              />
            </FormItem>
          </Col>
          <Col span={12} offset={2}>
            <FormItem
              name='inverterID'
              label={t('project.spec.inverter')}
            >
              <Select
                disabled={!capacity}
                options={
                  inverterData.activeData.map(record => ({
                    label: record.name,
                    value: record.inverterID
                  }))
                }
                onSelect={genInverterPlan}
              />
            </FormItem>
          </Col>
          <Col span={2}>
            <Button
              shape="circle"
              icon={<TableOutlined />}
              onClick={() => setshowInvDrawer(true)}
            />
          </Col>
        </Row>
        <Divider style={{marginTop: 0}}/>
        <Row align='middle' justify='center'>
          <FormItem>
            <Space>
              <Button type='primary' onClick={handleOk}>
                {autoInvPlan.plan ? t('autoInverter.confirm') : t('form.confirm')}
              </Button>
              {
                autoInvPlan.plan ?
                <Button onClick={() => {
                  form.setFieldsValue({inverterID: ''})
                  setautoInvPlan({})
                }}>
                  {t('autoInverter.cancel')}
                </Button> :
                null
              }
            </Space>
          </FormItem>
        </Row>
      </Form>
      <Drawer
        bodyStyle={{padding: '0px'}}
        title={t('PVtable.table')}
        placement="right"
        closable={false}
        onClose={() => setshowPVDrawer(false)}
        visible={showPVDrawer}
        width='50vw'
      >
        <PVTableViewOnly
          data={pvData.data}
          activeData={pvData.activeData}
          setactiveData={(activeData) => dispatch(setPVActiveData(activeData))}
        />
      </Drawer>
      <Drawer
        bodyStyle={{padding: '0px'}}
        title={t('InverterTable.table')}
        placement="right"
        closable={false}
        onClose={() => setshowInvDrawer(false)}
        visible={showInvDrawer}
        width='50vw'
      >
        <InverterTableViewOnly
          data={inverterData.data}
          activeData={inverterData.activeData}
          setactiveData={(activeData) => dispatch(setInverterActiveData(activeData))}
        />
      </Drawer>
    </Spin>
  )
}
