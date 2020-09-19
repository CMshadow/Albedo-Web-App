import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import { Form, Input, Row, Col, Select, Button, Drawer, Divider, notification, Spin, Space, Descriptions, Tooltip, Table } from 'antd';
import { TableOutlined } from '@ant-design/icons'
import { editPVSpec } from '../../../store/action/index'
import { PVTableViewOnly } from '../../Table/PVTable/PVTableViewOnly'
import { InverterTableViewOnly } from '../../Table/InverterTable/InverterTableViewOnly'
import { CellTempModel } from '../../CellTempModel/CellTempModel'
import { manualInverter } from '../../../pages/Project/service'
import { w2other } from '../../../utils/unitConverter'
const FormItem = Form.Item;
const { Item } = Descriptions

const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128};

export const EditForm = ({buildingID, specIndex, setediting}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { projectID } = useParams()

  const unit = useSelector(state => state.unit.unit)
  const projectType = useSelector(state => state.project.projectType)

  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )
  const [pvActiveData, setpvActiveData] = useState(pvData)
  const [invActiveData, setinvActiveData] = useState(inverterData)

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const spec = buildings[buildingIndex].data[specIndex].pv_panel_parameters

  const [form] = Form.useForm()
  const [showPVDrawer, setshowPVDrawer] = useState(false)
  const [showInvDrawer, setshowInvDrawer] = useState(false)
  const [pvID, setpvID] = useState(spec ? spec.pv_model.pvID : null)
  const [tilt, settilt] = useState({value: null})
  const [azimuth, setazimuth] = useState({value: null})
  const [capacity, setcapacity] = useState(null)
  const [autoInvLoading, setautoInvLoading] = useState(false)
  const [autoInvPlan, setautoInvPlan] = useState({})

  // 所有使用的逆变器的vac
  const allVac = new Set(buildings.flatMap(building => 
    building.data.flatMap(spec => 
      spec.inverter_wiring.map(inverterSpec => 
        inverterData.find(obj => 
          obj.inverterID === inverterSpec.inverter_model.inverterID
        ).vac
      )
    )
  ))

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
    const formatValues = {...values}
    const model = formatValues.celltemp_model.split(',')[0]
    if (model === 'sandia') {
      formatValues.celltemp_vars = [values.a, values.b, values.dtc]
      delete formatValues.a
      delete formatValues.b
      delete formatValues.dtc
    } else {
      formatValues.celltemp_vars = [values.uc, values.uv, values.v]
      delete formatValues.uc
      delete formatValues.uv
      delete formatValues.v
    }
    dispatch(editPVSpec({
      buildingID, specIndex, ...formatValues, invPlan: autoInvPlan,
      pv_userID: pvData.find(record => record.pvID === formatValues.pvID).userID,
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
    if (!pvID) {
      notification.error({
        message: t('project.autoinverter.error.miss-pvID'),
      })
      setautoInvLoading(false)
      return
    }
    const pvUserID = pvData.find(pv => pv.pvID === pvID).userID
    const pvPmax = pvData.find(pv => pv.pvID === pvID).pmax
    const ttlPV = Math.floor(capacity * 1000 / pvPmax)
    const invUserID = inverterData.find(inv => inv.inverterID === inverterID).userID
    const invName = inverterData.find(inv => inv.inverterID === inverterID).name
    dispatch(manualInverter({
      projectID: projectID, invID: inverterID, invUserID: invUserID,
      pvID: pvID, pvUserID: pvUserID, ttlPV: ttlPV
    }))
    .then(res => {
      setautoInvLoading(false)
      if (res === 'PV and Inverter does not fit') {
        notification.error({
          message: t('project.autoInverter.no-fit'),
        })
        return
      }
      if (res.plan.length === 0) {
        notification.warning({
          message: t('project.autoInverter.too-small'),
          description: t('project.autoInverter.too-small.detail'),
          duration: 15,
        })
        return
      }
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
            <Table
              scroll={{y: '40vh'}}
              dataSource={res.plan.map((obj, index) => ({...obj, key: index}))}
              pagination={false}
              columns={[
                {
                  key: 'spi',
                  title: t('project.spec.string_per_inverter'),
                  dataIndex: 'spi',
                  align: 'center'
                },
                {
                  key: 'pps',
                  title: t('project.spec.panels_per_string'),
                  dataIndex: 'pps',
                  align: 'center'
                }
              ]}
            />
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
    .catch(err => {
      console.log(err)
      setautoInvLoading(false)
    })
  }

  const genInitValues = (spec) => {
    const init = {...spec, pvID:spec.pv_model.pvID}
    if (spec.celltemp_model) {
      if (spec.celltemp_model.split(',')[0] === 'sandia') {
        init.a = spec.celltemp_vars[0]
        init.b = spec.celltemp_vars[1]
        init.dtc = spec.celltemp_vars[2]
      } else {
        init.uc = spec.celltemp_vars[0]
        init.uv = spec.celltemp_vars[1]
        init.v = spec.celltemp_vars[2]
      }
    }
    return init
  }

  const getInvVac = () => {
    if (form.getFieldValue('inverterID')) {
      return inverterData.find(obj => obj.inverterID === form.getFieldValue('inverterID')).vac
    } else {
      return null
    }
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
        initialValues={genInitValues(spec)}
      >
        <Row gutter={12}>
          <Col span={22}>
            <FormItem
              name='pvID'
              label={t('project.spec.pv')}
              rules={[{required: true}]}
            >
              <Select
                showSearch
                options={
                  pvActiveData.map(record => ({
                    label: record.name,
                    value: record.pvID
                  }))
                }
                filterOption={(value, option) =>
                  option.label.toLowerCase().includes(value.toLowerCase())
                }
                onChange={setpvID}
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
              label={
                <Tooltip title={t(`project.spec.tilt_angle.hint`)}>
                  <Space>
                    <QuestionCircleOutlined/>{t('project.spec.tilt_angle')}
                  </Space>
                </Tooltip>
              }
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
              label={
                <Tooltip title={t(`project.spec.azimuth.hint`)}>
                  <Space>
                    <QuestionCircleOutlined/>{t('project.spec.azimuth')}
                  </Space>
                </Tooltip>
              }
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
          {t('project.spec.avg-length')}
        </Divider>
        {
          projectType === 'domestic' ? null :
          <Row gutter={rowGutter}>
            <Col span={12}>
              <FormItem
                name='ac_cable_avg_len'
                label={
                  <Tooltip title={t('project.spec.ac_cable_avg_len.hint')}>
                    <Space>
                      <QuestionCircleOutlined/>{t('project.spec.ac_cable_avg_len')}
                    </Space>
                  </Tooltip>
                }
                rules={[{required: true}]}
              >
                <Input addonAfter={unit} type='number'/>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                name='dc_cable_avg_len'
                label={
                  <Tooltip title={t(`project.spec.dc_cable_avg_len.hint`)}>
                    <Space>
                      <QuestionCircleOutlined/>{t('project.spec.dc_cable_avg_len')}
                    </Space>
                  </Tooltip>
                }
                rules={[{required: true}]}
              >
                <Input addonAfter={unit} type='number'/>
              </FormItem>
            </Col>
          </Row>
        }

        <Divider>
          {t('project.spec.celltemp-model')}
        </Divider>
        <CellTempModel form={form} pvID={pvID} initModel={genInitValues(spec).celltemp_model}/>

        <Divider>
          <Tooltip title={t('project.spec.optional.tooltip')}>
            <Space>
              <QuestionCircleOutlined />{t('project.spec.optional')}
            </Space>
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
              help={
                allVac.size > 1 || (getInvVac() && new Set([...allVac, getInvVac()]).size > 1) ?
                t('project.spec.inverter.vac-inconsistent') : null
              }
              validateStatus={
                allVac.size > 1 || (getInvVac() && new Set([...allVac, getInvVac()]).size > 1) ?
                'warning' : null
              }
            >
              <Select
                showSearch
                disabled={!capacity}
                options={
                  invActiveData.map(record => ({
                    label: record.name,
                    value: record.inverterID
                  }))
                }
                onSelect={genInverterPlan}
                filterOption={(value, option) =>
                  option.label.toLowerCase().includes(value.toLowerCase())
                }
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
          data={pvData}
          activeData={pvActiveData}
          setactiveData={setpvActiveData}
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
          data={inverterData}
          activeData={invActiveData}
          setactiveData={setinvActiveData}
        />
      </Drawer>
    </Spin>
  )
}
