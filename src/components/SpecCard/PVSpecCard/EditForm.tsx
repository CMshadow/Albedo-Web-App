import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  Button,
  Drawer,
  Divider,
  notification,
  Spin,
  Space,
  Descriptions,
  Tooltip,
  Table,
} from 'antd'
import { TableOutlined } from '@ant-design/icons'
import { EditInverterPlanModal } from './EditInverterPlanModal'
import { editSubAry } from '../../../store/action/index'
import { PVTableViewOnly } from '../../Table/PVTable/PVTableViewOnly'
import { InverterTableViewOnly } from '../../Table/InverterTable/InverterTableViewOnly'
import { CellTempModel } from '../../Model/CellTempModel/CellTempModel'
import { manualInverter } from '../../../services'
import { w2other } from '../../../utils/unitConverter'
import { Params, PVSpec, RootState, InvPlan, EditSubAryParams, N1 } from '../../../@types'
const FormItem = Form.Item
const { Item } = Descriptions

const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128 }

type EditForm = {
  buildingID: string
  specIndex: number
  setediting: React.Dispatch<React.SetStateAction<boolean>>
}

type FormItem = Omit<PVSpec, 'mode' | 'pv_model'> & {
  pvID: string
  celltemp_model: string
  a: number
  b: number
  dtc: number
  uc: number
  uv: number
  v: number
}

export const EditForm: React.FC<EditForm> = ({ buildingID, specIndex, setediting }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { projectID } = useParams<Params>()

  const [form] = Form.useForm()
  const [showPVDrawer, setshowPVDrawer] = useState(false)
  const [showInvDrawer, setshowInvDrawer] = useState(false)
  const [tilt, settilt] = useState<{
    value?: number
    errorMsg?: string
    validateStatus?: 'error' | 'success'
  }>({})
  const [azimuth, setazimuth] = useState<{
    value?: number
    errorMsg?: string
    validateStatus?: 'error' | 'success'
  }>({})
  const [capacity, setcapacity] = useState<number>()
  const [autoInvLoading, setautoInvLoading] = useState(false)
  const [autoInvPlan, setautoInvPlan] = useState<InvPlan | null>(null)

  const [showModal, setshowModal] = useState(false)
  const [N1, setN1] = useState<N1>()

  const unit = useSelector((state: RootState) => state.unit.unit)
  const projectType = useSelector((state: RootState) => state.project?.projectType)

  const pvData = useSelector((state: RootState) => state.pv.data).concat(
    useSelector((state: RootState) => state.pv.officialData)
  )
  const inverterData = useSelector((state: RootState) => state.inverter.data).concat(
    useSelector((state: RootState) => state.inverter.officialData)
  )

  const buildings = useSelector((state: RootState) => state.project?.buildings)
  const buildingIndex = (buildings || []).map(building => building.buildingID).indexOf(buildingID)
  const spec = (buildings || [])[buildingIndex].data[specIndex].pv_panel_parameters

  const [pvID, setpvID] = useState<string | null>(spec ? spec.pv_model.pvID : null)

  if (!buildings) return null

  // 所有使用的逆变器的vac
  const allVac = Array.from(
    new Set(
      buildings
        .flatMap(building =>
          building.data.flatMap(spec =>
            spec.inverter_wiring.map(
              inverterSpec =>
                inverterData.find(obj => obj.inverterID === inverterSpec.inverter_model.inverterID)
                  ?.vac
            )
          )
        )
        .filter((val): val is number => val !== undefined)
    )
  )

  const handleOk = () => {
    if (tilt.validateStatus === 'error' || azimuth.validateStatus === 'error') {
      return
    }
    // 验证表单，如果通过提交表单
    form
      .validateFields()
      .then(() => {
        form.submit()
      })
      .catch(err => {
        form.scrollToField(err.errorFields[0].name[0])
        return
      })
  }

  const submitForm = (values: FormItem) => {
    const formatValues: Omit<
      EditSubAryParams,
      'buildingID' | 'specIndex' | 'invPlan' | 'pv_userID'
    > = {
      pvID: values.pvID,
      tilt_angle: Number(values.tilt_angle),
      azimuth: Number(values.azimuth),
      celltemp_model: values.celltemp_model,
      ac_cable_avg_len: Number(values.ac_cable_avg_len),
      dc_cable_avg_len: Number(values.dc_cable_avg_len),
      celltemp_vars: [0, 0, 0],
    }
    const model = formatValues.celltemp_model.split(',')[0]
    if (model === 'sandia') {
      formatValues.celltemp_vars = [values.a, values.b, values.dtc]
    } else {
      formatValues.celltemp_vars = [values.uc, values.uv, values.v]
    }
    const matchPVUserID = pvData.find(record => record.pvID === formatValues.pvID)?.userID
    matchPVUserID &&
      dispatch(
        editSubAry({
          buildingID,
          specIndex,
          ...formatValues,
          invPlan: autoInvPlan || undefined,
          pv_userID: matchPVUserID,
        })
      )
    setediting(false)
  }

  const tiltChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    settilt({ ...validateTilt(Number(event.target.value)), value: Number(event.target.value) })
  }

  const validateTilt = (tilt: number) => {
    if (Number(tilt) < 0 || Number(tilt) > 60) {
      return {
        validateStatus: 'error' as const,
        errorMsg: t('project.error.tilt'),
      }
    }
    return {
      validateStatus: 'success' as const,
      errorMsg: undefined,
    }
  }

  const azimuthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setazimuth({
      ...validateAzimuth(Number(event.target.value)),
      value: Number(event.target.value),
    })
  }

  const validateAzimuth = (azimuth: number) => {
    if (Number(azimuth) < 0 || Number(azimuth) > 360) {
      return {
        validateStatus: 'error' as const,
        errorMsg: t('project.error.azimuth'),
      }
    }
    return {
      validateStatus: 'success' as const,
      errorMsg: undefined,
    }
  }

  const genInverterPlan = () => {
    setautoInvLoading(true)
    const inverterID = form.getFieldValue('inverterID')
    const capacity = Number(form.getFieldValue('capacity'))
    const pvID = form.getFieldValue('pvID')
    if (!pvID) {
      notification.error({
        message: t('project.autoInverter.error.miss-pvID'),
      })
      setautoInvLoading(false)
      return
    }
    const pvUserID = pvData.find(pv => pv.pvID === pvID)?.userID
    const pvPmax = pvData.find(pv => pv.pvID === pvID)?.pmax
    const invUserID = inverterData.find(inv => inv.inverterID === inverterID)?.userID
    const invName = inverterData.find(inv => inv.inverterID === inverterID)?.name
    if (!pvUserID || !pvPmax || !invUserID || !invName) return

    const ttlPV = Math.floor((capacity * 1000) / pvPmax)
    manualInverter({
      projectID: projectID,
      invID: inverterID,
      invUserID: invUserID,
      pvID: pvID,
      pvUserID: pvUserID,
      ttlPV: ttlPV,
    })
      .then(res => {
        setautoInvLoading(false)
        if (res === 'PV and Inverter does not fit') {
          notification.error({
            message: t('project.autoInverter.no-fit'),
          })
          return
        }
        if (typeof res !== 'string' && res.autoPlan.plan.length === 0) {
          notification.warning({
            message: t('project.autoInverter.too-small'),
            description: t('project.autoInverter.too-small.detail'),
            duration: 15,
          })
          return
        }
        if (typeof res !== 'object') return
        const notiKey = 'notification'
        const actCapacity = w2other((ttlPV - res.autoPlan.wasted) * pvPmax)
        const description = (
          <Descriptions column={1}>
            <Item label={t('project.autoInverter.invModel')} span={1}>
              {invName}
            </Item>
            <Item label={t('project.autoInverter.requiredInv')} span={1}>
              {res.autoPlan.plan.length}
            </Item>
            <Item label={t('project.autoInverter.capacity')} span={1}>
              {`${actCapacity.value} ${actCapacity.unit}`}
            </Item>
            <Item label={t('project.autoInverter.pvConnected')} span={1}>
              {ttlPV - res.autoPlan.wasted}
            </Item>
            <Item label={t('project.autoInverter.detail')} span={1}>
              <Table
                scroll={{ y: '40vh' }}
                dataSource={res.autoPlan.plan.map((obj, index) => ({ ...obj, key: index }))}
                pagination={false}
                columns={[
                  {
                    key: 'spi',
                    title: t('project.spec.string_per_inverter'),
                    dataIndex: 'spi',
                    align: 'center',
                  },
                  {
                    key: 'pps',
                    title: t('project.spec.panels_per_string'),
                    dataIndex: 'pps',
                    align: 'center',
                  },
                ]}
              />
            </Item>
          </Descriptions>
        )
        const btn = (
          <Space>
            <Button
              type='primary'
              onClick={() => {
                setautoInvPlan({
                  plan: res.autoPlan.plan,
                  inverterID: inverterID,
                  inverterUserID: invUserID,
                })
                notification.close(notiKey)
              }}
            >
              {t('project.autoInverter.use')}
            </Button>
            <Button
              onClick={() => {
                setautoInvPlan({
                  plan: res.autoPlan.plan,
                  inverterID: inverterID,
                  inverterUserID: invUserID,
                })
                setN1({
                  N1vdcMax: Number(res.N1vdcMax),
                  N1vmpptMax: Number(res.N1vmpptMax),
                  N1Min: Number(res.N1Min),
                })
                setshowModal(true)
                notification.close(notiKey)
              }}
            >
              {t('project.autoInverter.edit')}
            </Button>
            <Button
              onClick={() => {
                form.setFieldsValue({ inverterID: '' })
                setautoInvPlan(null)
                notification.close(notiKey)
              }}
            >
              {t('project.autoInverter.notuse')}
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
            form.setFieldsValue({ inverterID: '' })
            setautoInvPlan(null)
          },
          style: {
            width: 550,
            marginLeft: 375 - 550,
          },
        })
      })
      .catch(err => {
        console.log(err)
        setautoInvLoading(false)
      })
  }

  const genInitValues = (spec: PVSpec) => {
    const init: PVSpec & {
      pvID: string | null
      a?: number
      b?: number
      dtc?: number
      uc?: number
      uv?: number
      v?: number
    } = { ...spec, pvID: spec.pv_model.pvID }
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
      return inverterData.find(obj => obj.inverterID === form.getFieldValue('inverterID'))?.vac
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
        name='newSpec'
        scrollToFirstError
        onFinish={submitForm}
        initialValues={genInitValues(spec)}
      >
        <Row gutter={12}>
          <Col span={22}>
            <FormItem name='pvID' label={t('project.spec.pv')} rules={[{ required: true }]}>
              <Select
                showSearch
                options={pvData.map(record => ({
                  label: record.name,
                  value: record.pvID,
                }))}
                filterOption={(value, option) =>
                  option?.label?.toString().toLowerCase().includes(value.toLowerCase()) || false
                }
                onChange={val => setpvID(val.toString())}
              />
            </FormItem>
          </Col>
          <Col span={2}>
            <Button shape='circle' icon={<TableOutlined />} onClick={() => setshowPVDrawer(true)} />
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col span={12}>
            <FormItem
              name='tilt_angle'
              label={
                <Tooltip title={t(`project.spec.tilt_angle.hint`)}>
                  <Space>
                    <QuestionCircleOutlined />
                    {t('project.spec.tilt_angle')}
                  </Space>
                </Tooltip>
              }
              rules={[{ required: true }]}
              validateStatus={tilt.validateStatus}
              help={tilt.errorMsg || null}
            >
              <Input addonAfter='°' type='number' value={tilt.value} onChange={tiltChange} />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name='azimuth'
              label={
                <Tooltip title={t(`project.spec.azimuth.hint`)}>
                  <Space>
                    <QuestionCircleOutlined />
                    {t('project.spec.azimuth')}
                  </Space>
                </Tooltip>
              }
              rules={[{ required: true }]}
              validateStatus={azimuth.validateStatus}
              help={azimuth.errorMsg || null}
            >
              <Input addonAfter='°' type='number' value={azimuth.value} onChange={azimuthChange} />
            </FormItem>
          </Col>
        </Row>
        {projectType === 'domestic' ? null : (
          <>
            <Divider>{t('project.spec.avg-length')}</Divider>
            <Row gutter={rowGutter}>
              <Col span={12}>
                <FormItem
                  name='ac_cable_avg_len'
                  label={
                    <Tooltip title={t('project.spec.ac_cable_avg_len.hint')}>
                      <Space>
                        <QuestionCircleOutlined />
                        {t('project.spec.ac_cable_avg_len')}
                      </Space>
                    </Tooltip>
                  }
                  rules={[{ required: true }]}
                >
                  <Input addonAfter={unit} type='number' />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  name='dc_cable_avg_len'
                  label={
                    <Tooltip title={t(`project.spec.dc_cable_avg_len.hint`)}>
                      <Space>
                        <QuestionCircleOutlined />
                        {t('project.spec.dc_cable_avg_len')}
                      </Space>
                    </Tooltip>
                  }
                  rules={[{ required: true }]}
                >
                  <Input addonAfter={unit} type='number' />
                </FormItem>
              </Col>
            </Row>
          </>
        )}

        <Divider>{t('project.spec.celltemp-model')}</Divider>
        <CellTempModel form={form} pvID={pvID} initModel={genInitValues(spec).celltemp_model} />

        <Divider>
          <Tooltip title={t('project.spec.optional.tooltip')}>
            <Space>
              <QuestionCircleOutlined />
              {t('project.spec.optional')}
            </Space>
          </Tooltip>
        </Divider>
        <Row gutter={8}>
          <Col span={8}>
            <FormItem name='capacity' label={t('project.spec.capacity')}>
              <Input
                addonAfter='kW'
                type='number'
                value={capacity}
                onChange={e => {
                  setcapacity(Number(e.target.value))
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
                projectType === 'commercial'
                  ? null
                  : allVac.length > 1 || (getInvVac() && new Set([...allVac, getInvVac()]).size > 1)
                  ? t('project.spec.inverter.vac-inconsistent')
                  : null
              }
              validateStatus={
                projectType === 'commercial'
                  ? ''
                  : allVac.length > 1 || (getInvVac() && new Set([...allVac, getInvVac()]).size > 1)
                  ? 'warning'
                  : ''
              }
            >
              <Select
                showSearch
                disabled={!capacity}
                options={inverterData.map(record => ({
                  label: record.name,
                  value: record.inverterID,
                }))}
                onSelect={genInverterPlan}
                filterOption={(value, option) =>
                  option?.label?.toString().toLowerCase().includes(value.toLowerCase()) || false
                }
              />
            </FormItem>
          </Col>
          <Col span={2}>
            <Button
              shape='circle'
              icon={<TableOutlined />}
              onClick={() => setshowInvDrawer(true)}
            />
          </Col>
        </Row>
        <Divider style={{ marginTop: 0 }} />
        <Row align='middle' justify='center'>
          <FormItem>
            <Space>
              <Button type='primary' onClick={handleOk}>
                {autoInvPlan && autoInvPlan.plan
                  ? t('project.autoInverter.confirm')
                  : t('form.confirm')}
              </Button>
              {autoInvPlan && autoInvPlan.plan ? (
                <Button
                  onClick={() => {
                    form.setFieldsValue({ inverterID: '' })
                    setautoInvPlan(null)
                  }}
                >
                  {t('project.autoInverter.cancel')}
                </Button>
              ) : null}
            </Space>
          </FormItem>
        </Row>
      </Form>
      <Drawer
        bodyStyle={{ padding: '0px' }}
        title={t('PVtable.table')}
        placement='right'
        closable={false}
        onClose={() => setshowPVDrawer(false)}
        visible={showPVDrawer}
        width='50vw'
      >
        <PVTableViewOnly data={pvData} />
      </Drawer>
      <Drawer
        bodyStyle={{ padding: '0px' }}
        title={t('InverterTable.table')}
        placement='right'
        closable={false}
        onClose={() => setshowInvDrawer(false)}
        visible={showInvDrawer}
        width='50vw'
      >
        <InverterTableViewOnly data={inverterData} />
      </Drawer>
      {pvID && capacity && N1 && autoInvPlan ? (
        <EditInverterPlanModal
          pvID={pvID}
          capacity={capacity}
          showModal={showModal}
          setshowModal={setshowModal}
          setautoInvPlan={setautoInvPlan}
          N1={N1}
          autoPlan={autoInvPlan}
        />
      ) : null}
    </Spin>
  )
}
