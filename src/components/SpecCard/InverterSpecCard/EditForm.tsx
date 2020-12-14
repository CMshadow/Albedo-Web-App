import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Select,
  Button,
  Drawer,
  Tooltip,
  Space,
  Spin,
} from 'antd'
import { TableOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { editInverterSpec } from '../../../store/action/index'
import { InverterTableViewOnly } from '../../Table/InverterTable/InverterTableViewOnly'
import { other2m } from '../../../utils/unitConverter'
import { inverterLimit } from '../../../services'
import styles from './EditForm.module.scss'
import { Params, RootState, InvLimits, EditInverterSpecParams } from '../../../@types'
import { ValidateStatus } from 'antd/lib/form/FormItem'
const FormItem = Form.Item

const rowGutter = { md: 8, lg: 15, xl: 32 }

// 根据给定的逆变器接线可选方案，生成SPI区间
export const genSPILimits = (invLimits: InvLimits, pps?: number): [number, number] => {
  if (pps && pps.toString() in invLimits) {
    const minSPI = invLimits[pps].reduce((minSPI, val) => (val < minSPI ? val : minSPI), Infinity)
    const maxSPI = invLimits[pps].reduce((maxSPI, val) => (val > maxSPI ? val : maxSPI), -Infinity)
    return [Number(minSPI), Number(maxSPI)]
  } else {
    return [-Infinity, Infinity]
  }
}

// 根据给定的逆变器接线可选方案，和可给定的SPI,生成PPS区间
export const genPPSLimits = (invLimits: InvLimits): [number, number] => {
  const minPPS = Object.keys(invLimits).reduce(
    (minPPS, val) => (Number(val) < minPPS ? Number(val) : minPPS),
    Infinity
  )
  const maxPPS = Object.keys(invLimits).reduce(
    (maxPPS, val) => (Number(val) > maxPPS ? Number(val) : maxPPS),
    -Infinity
  )
  return [Number(minPPS), Number(maxPPS)]
}

type EditFomrProps = {
  buildingID: string
  specIndex: number
  invIndex: number
  setediting: React.Dispatch<React.SetStateAction<boolean>>
  disabled: boolean
  initInvLimits: InvLimits
  onClickEndEdit: () => void
}

export const EditForm: React.FC<EditFomrProps> = ({
  buildingID,
  specIndex,
  invIndex,
  setediting,
  disabled,
  initInvLimits,
  onClickEndEdit,
}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { projectID } = useParams<Params>()
  const [form] = Form.useForm()
  const [loading, setloading] = useState(false)
  const [showDrawer, setshowDrawer] = useState(false)
  const unit = useSelector((state: RootState) => state.unit.unit)
  const pvData = useSelector((state: RootState) => state.pv.data).concat(
    useSelector((state: RootState) => state.pv.officialData)
  )
  const inverterData = useSelector((state: RootState) => state.inverter.data).concat(
    useSelector((state: RootState) => state.inverter.officialData)
  )

  const projectType = useSelector((state: RootState) => state.project?.projectType)
  const buildings = useSelector((state: RootState) => state.project?.buildings) || []
  const buildingIndex = buildings.map(building => building.buildingID).indexOf(buildingID)
  const specData = buildings[buildingIndex].data[specIndex]
  const selPV = pvData.find(pv => pv.pvID === specData.pv_panel_parameters.pv_model.pvID)
  const invSpec = specData.inverter_wiring[invIndex]
  const [dc_cable_len, setdc_cable_len] = useState<{
    value: string | undefined
    errorMsg?: string
    validateStatus?: ValidateStatus
  }>({
    value: invSpec.dc_cable_len ? invSpec.dc_cable_len.join(',') : undefined,
  })

  // 所有使用的逆变器的vac
  const allVac = Array.from(
    new Set(
      buildings.flatMap(building =>
        building.data.flatMap(spec =>
          spec.inverter_wiring
            .map(inverterSpec =>
              inverterSpec.inverter_model.inverterID
                ? inverterData.find(
                    obj => obj.inverterID === inverterSpec.inverter_model.inverterID
                  )?.vac
                : null
            )
            .filter((elem): elem is number => elem !== null)
        )
      )
    )
  )

  // 当前选中的逆变器完整参数
  const [inv, setinv] = useState(
    inverterData.find(obj => obj.inverterID === invSpec.inverter_model.inverterID) || null
  )
  // form中最新的逆变器可选方案限制
  const [invLimits, setinvLimits] = useState({})
  // 根据当前逆变器可选方案限制产生的SPI范围
  const [invSPILimit, setinvSPILimit] = useState<[number, number]>([-Infinity, Infinity])
  // 根据当前逆变器可选方案限制产生的PPS范围
  const [invPPSLimit, setinvPPSLimit] = useState<[number, number]>([-Infinity, Infinity])
  // 表中spi值
  const [spi, setspi] = useState<{ value: number | undefined; validateStatus: ValidateStatus }>({
    value: invSpec.string_per_inverter || undefined,
    validateStatus: '',
  })
  // 表中pps值
  const [pps, setpps] = useState<{ value: number | undefined; validateStatus: ValidateStatus }>({
    value: invSpec.panels_per_string || undefined,
    validateStatus: '',
  })
  // spi对应文本
  const [spimsg, setspimsg] = useState('')
  // pps对应文本
  const [ppsmsg, setppsmsg] = useState('')

  // 自定义校验组串线缆长度输入是否符合规范
  const validateDCCableLen = (value: string) => {
    // 含非数字
    if (value.split(',').some(v => isNaN(Number(v)))) {
      return {
        validateStatus: 'error' as const,
        errorMsg: t('project.spec.dc_cable_len.error.only-number'),
      }
    }
    // 数量与该逆变器组串数不同
    const spi = form.getFieldValue('string_per_inverter')
    if (value.split(',').length !== spi) {
      return {
        validateStatus: 'error' as const,
        errorMsg: t('project.spec.dc_cable_len.error.spi-not-match'),
      }
    }
    // 校验通过
    return {
      validateStatus: 'success' as const,
      errorMsg: '',
    }
  }

  // 自定义校验并联组串数是否符合逆变器规范并更新SPI对应文本
  const validateSpi = (
    value: number,
    minSPI: number,
    maxSPI: number,
    pps: number,
    minPPS: number,
    maxPPS: number
  ) => {
    if (pps >= minPPS && pps <= maxPPS) {
      if (value > maxSPI) {
        setspimsg(
          `${t('project.spec.error.over-max')} ${t(
            'project.spec.string_per_inverter.help'
          )}: ${minSPI}-${maxSPI}`
        )
        return { validateStatus: 'warning' as const }
      } else if (value < minSPI) {
        setspimsg(
          `${t('project.spec.error.under-min')} ${t(
            'project.spec.string_per_inverter.help'
          )}: ${minSPI}-${maxSPI}`
        )
        return { validateStatus: 'warning' as const }
      } else {
        setspimsg(`${t('project.spec.string_per_inverter.help')}: ${minSPI}-${maxSPI}`)
        return { validateStatus: 'success' as const }
      }
    } else {
      setspimsg(t('project.spec.string_per_inverter.out-of-range'))
      return { validateStatus: 'warning' as const }
    }
  }

  // 自定义校验每串板数是否符合逆变器规范并更新PPS对应文本
  const validatePps = (value: number, minPPS: number, maxPPS: number) => {
    if (value > maxPPS) {
      setppsmsg(
        `${t('project.spec.error.over-max')} ${t(
          'project.spec.panels_per_string.help'
        )}: ${minPPS}-${maxPPS}`
      )
      return { validateStatus: 'warning' as const }
    } else if (value < minPPS) {
      setppsmsg(
        `${t('project.spec.error.under-min')} ${t(
          'project.spec.panels_per_string.help'
        )}: ${minPPS}-${maxPPS}`
      )
      return { validateStatus: 'warning' as const }
    } else {
      setppsmsg(`${t('project.spec.panels_per_string.help')}: ${minPPS}-${maxPPS}`)
      return { validateStatus: 'success' as const }
    }
  }

  //组串线缆长度输入框改变回调
  const onDCCableLenChange = (value: React.ChangeEvent<HTMLInputElement>) => {
    setdc_cable_len({
      ...validateDCCableLen(value.target.value),
      value: value.target.value,
    })
  }

  //并联组串数输入框改变回调，校验SPI，如果存在pps则同时校验PPS，否则只更新pps文本
  const onSPIChange = (
    spiValue: number,
    minSPI: number,
    maxSPI: number,
    ppsValue: number = pps.value || 0,
    minPPS = invPPSLimit[0],
    maxPPS = invPPSLimit[1]
  ) => {
    setspi({
      ...validateSpi(spiValue, minSPI, maxSPI, ppsValue, minPPS, maxPPS),
      value: spiValue,
    })
  }

  //每串组件数输入框改变回调，校验PPS
  const onPPSChange = (value: number, minPPS: number, maxPPS: number, limit = invLimits) => {
    setpps({
      ...validatePps(value, minPPS, maxPPS),
      value: value,
    })
    const newSPILimit = genSPILimits(limit, value)
    setinvSPILimit(newSPILimit)
    if (spi.value) {
      onSPIChange(spi.value, newSPILimit[0], newSPILimit[1], value, minPPS, maxPPS)
    } else {
      setspimsg(
        `${t('project.spec.string_per_inverter.help')}: ${newSPILimit[0]}-${newSPILimit[1]}`
      )
    }
  }

  //选择逆变器改变回调，生成新invLimits并更新spi和pps文本，如果存在pps和spi则重新校验PPS和SPI并更新文本
  const onInverterIDChange = (invID: string) => {
    const selInv = inverterData.find(inv => inv.inverterID === invID)
    if (!selInv || !selPV) return

    setinv(selInv)
    setloading(true)
    inverterLimit({
      projectID,
      invID: selInv.inverterID,
      invUserID: selInv.userID,
      pvID: selPV.pvID,
      pvUserID: selPV.userID,
    }).then(res => {
      setloading(false)
      const newinvLimits: InvLimits = {}
      res.inverterPlans.forEach(limit =>
        limit.pps in newinvLimits
          ? newinvLimits[limit.pps].push(limit.spi)
          : (newinvLimits[limit.pps] = [limit.spi])
      )
      Object.keys(newinvLimits).forEach(key => newinvLimits[key].sort())
      setinvLimits(newinvLimits)

      const spi = form.getFieldValue('string_per_inverter')
      const pps = form.getFieldValue('panels_per_string')

      const [minSPI, maxSPI] = genSPILimits(newinvLimits, pps)
      setinvSPILimit([minSPI, maxSPI])
      setspimsg(`${t('project.spec.string_per_inverter.help')}: ${minSPI}-${maxSPI}`)

      const [minPPS, maxPPS] = genPPSLimits(newinvLimits)
      setinvPPSLimit([minPPS, maxPPS])
      setppsmsg(`${t('project.spec.panels_per_string.help')}: ${minPPS}-${maxPPS}`)

      if (spi) onSPIChange(spi, minSPI, maxSPI)
      if (pps) onPPSChange(pps, minPPS, maxPPS, newinvLimits)
    })
  }

  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form
      .validateFields()
      .then(() => {
        // 验证组串线缆长度输入是否规范
        const dcLenVali = validateDCCableLen(form.getFieldValue('dc_cable_len'))
        if (dcLenVali.validateStatus === 'error') {
          setdc_cable_len({
            ...dcLenVali,
            value: dc_cable_len.value,
          })
          return
        }
        form.submit()
      })
      .catch(err => {
        form.scrollToField(err.errorFields[0].name[0])
        return
      })
  }

  const submitForm = (values: {
    inverterID: string
    dc_cable_len: string
    ac_cable_len: string
    panels_per_string: string
    string_per_inverter: string
  }) => {
    const matchInv = inverterData.find(record => record.inverterID === values.inverterID)
    if (!matchInv) return

    const formatedValues: Omit<
      EditInverterSpecParams,
      'buildingID' | 'specIndex' | 'invIndex' | 'inverter_userID'
    > = {
      inverterID: values.inverterID,
      panels_per_string: Number(values.panels_per_string),
      string_per_inverter: Number(values.string_per_inverter),
      // ac线缆长度m/ft到m的转换
      ac_cable_len: other2m(unit, Number(values.ac_cable_len)),
      // 组串线缆长度string转换数字array并进行m/ft到m的转换
      dc_cable_len: values.dc_cable_len.split(',').map(v => other2m(unit, Number(v))),
    }
    dispatch(
      editInverterSpec({
        buildingID,
        specIndex,
        invIndex,
        ...formatedValues,
        inverter_userID: matchInv.userID,
      })
    )
    onClickEndEdit()
    setediting(false)
  }

  const getInvVac = () => {
    if (form.getFieldValue('inverterID')) {
      return inverterData.find(obj => obj.inverterID === form.getFieldValue('inverterID'))?.vac
    } else {
      return null
    }
  }
  // initInvLimits准备好后初始化SPI，PPS值及文本
  useEffect(() => {
    const evalSPI = (
      value: number,
      minSPI: number,
      maxSPI: number,
      pps: number,
      minPPS: number,
      maxPPS: number
    ) => {
      if (pps >= minPPS && pps <= maxPPS) {
        if (value > maxSPI) {
          setspimsg(
            `${t('project.spec.error.over-max')} ${t(
              'project.spec.string_per_inverter.help'
            )}: ${minSPI}-${maxSPI}`
          )
          return { validateStatus: 'warning' as const }
        } else if (value < minSPI) {
          setspimsg(
            `${t('project.spec.error.under-min')} ${t(
              'project.spec.string_per_inverter.help'
            )}: ${minSPI}-${maxSPI}`
          )
          return { validateStatus: 'warning' as const }
        } else {
          setspimsg(`${t('project.spec.string_per_inverter.help')}: ${minSPI}-${maxSPI}`)
          return { validateStatus: 'success' as const }
        }
      } else {
        setspimsg(t('project.spec.string_per_inverter.out-of-range'))
        return { validateStatus: 'warning' as const }
      }
    }

    const evalPPS = (value: number, minPPS: number, maxPPS: number) => {
      // 数量与该逆变器规格不符
      if (value > maxPPS) {
        setppsmsg(
          `${t('project.spec.error.over-max')} ${t(
            'project.spec.panels_per_string.help'
          )}: ${minPPS}-${maxPPS}`
        )
        return { validateStatus: 'warning' as const }
      } else if (value < minPPS) {
        setppsmsg(
          `${t('project.spec.error.under-min')} ${t(
            'project.spec.panels_per_string.help'
          )}: ${minPPS}-${maxPPS}`
        )
        return { validateStatus: 'warning' as const }
      } else {
        setppsmsg(`${t('project.spec.panels_per_string.help')}: ${minPPS}-${maxPPS}`)
        return { validateStatus: 'success' as const }
      }
    }

    setinvLimits(initInvLimits)
    let initPPSLimit: [number, number] = [-Infinity, Infinity]
    if (invSpec.panels_per_string) {
      initPPSLimit = genPPSLimits(initInvLimits)
      setinvPPSLimit(initPPSLimit)
      setpps({
        ...evalPPS(invSpec.panels_per_string, initPPSLimit[0], initPPSLimit[1]),
        value: invSpec.panels_per_string,
      })
    }
    if (invSpec.string_per_inverter) {
      const initSPILimit = genSPILimits(initInvLimits, invSpec.panels_per_string || undefined)
      setinvSPILimit(initSPILimit)
      setspi({
        ...evalSPI(
          invSpec.string_per_inverter,
          initSPILimit[0],
          initSPILimit[1],
          invSpec.panels_per_string || 0,
          initPPSLimit[0],
          initPPSLimit[1]
        ),
        value: invSpec.string_per_inverter,
      })
    }
  }, [initInvLimits, invSpec.panels_per_string, invSpec.string_per_inverter, t])

  return (
    <Spin spinning={loading}>
      <Form
        colon={false}
        form={form}
        hideRequiredMark
        name='newSpec'
        scrollToFirstError
        onFinish={submitForm}
        initialValues={{
          ...invSpec,
          inverterID: invSpec.inverter_model.inverterID,
          ac_cable_len:
            invSpec.ac_cable_len !== null && invSpec.ac_cable_len >= 0
              ? invSpec.ac_cable_len
              : specData.pv_panel_parameters.ac_cable_avg_len,
          dc_cable_len: invSpec.dc_cable_len ? invSpec.dc_cable_len.join(',') : null,
        }}
      >
        <Row gutter={12}>
          <Col span={22}>
            <FormItem
              name='inverterID'
              label={t('project.spec.inverter')}
              rules={[{ required: true }]}
              help={
                projectType === 'domestic' &&
                (allVac.length > 1 || (getInvVac() && new Set([...allVac, getInvVac()]).size > 1))
                  ? t('project.spec.inverter.vac-inconsistent')
                  : null
              }
              validateStatus={
                projectType === 'domestic' &&
                (allVac.length > 1 || (getInvVac() && new Set([...allVac, getInvVac()]).size > 1))
                  ? 'warning'
                  : undefined
              }
            >
              <Select
                showSearch
                options={inverterData.map(record => ({
                  label: record.name,
                  value: record.inverterID,
                }))}
                disabled={disabled}
                onChange={onInverterIDChange}
                filterOption={(value, option) =>
                  option?.label?.toString().toLowerCase().includes(value.toLowerCase()) || false
                }
              />
            </FormItem>
          </Col>
          <Col span={2}>
            <Button shape='circle' icon={<TableOutlined />} onClick={() => setshowDrawer(true)} />
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col span={12}>
            <FormItem
              name='panels_per_string'
              label={t('project.spec.panels_per_string')}
              rules={[{ required: true }]}
              validateStatus={pps.validateStatus}
              help={ppsmsg}
            >
              <InputNumber
                precision={0}
                min={1}
                className={styles.inputNumber}
                value={pps.value}
                onChange={val => onPPSChange(Number(val), invPPSLimit[0], invPPSLimit[1])}
                disabled={disabled}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name='string_per_inverter'
              label={t('project.spec.string_per_inverter')}
              rules={[{ required: true }]}
              validateStatus={spi.validateStatus}
              help={spimsg}
            >
              <InputNumber
                precision={0}
                min={1}
                className={styles.inputNumber}
                value={spi.value}
                onChange={val => {
                  onSPIChange(Number(val), invSPILimit[0], invSPILimit[1])
                  if (specData.pv_panel_parameters.dc_cable_avg_len) {
                    form.setFieldsValue({
                      dc_cable_len: new Array(val)
                        .fill(specData.pv_panel_parameters.dc_cable_avg_len)
                        .join(','),
                    })
                  }
                }}
                disabled={disabled}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col span={12}>
            <FormItem
              name='ac_cable_len'
              label={
                <Tooltip title={t(`project.spec.ac_cable_len.hint`)}>
                  <Space>
                    <QuestionCircleOutlined />
                    {t('project.spec.ac_cable_len')}
                  </Space>
                </Tooltip>
              }
              normalize={val => (val ? Number(val) : val)}
              rules={[{ required: true, type: 'number', min: 0 }]}
            >
              <Input
                type='number'
                addonAfter={unit}
                className={styles.inputNumber}
                disabled={disabled}
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name='dc_cable_len'
              label={
                <Tooltip title={t(`project.spec.dc_cable_len.hint`)}>
                  <Space>
                    <QuestionCircleOutlined />
                    {t('project.spec.dc_cable_len')}
                  </Space>
                </Tooltip>
              }
              validateStatus={dc_cable_len.validateStatus}
              help={dc_cable_len.errorMsg}
              rules={[{ required: true }]}
            >
              <Input
                className={styles.inputNumber}
                addonAfter={unit}
                value={dc_cable_len.value}
                onChange={onDCCableLenChange}
                disabled={disabled}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col span={24}>
            <FormItem
              label={`${t('project.spec.dcoveracratio-actual')} / ${t(
                'project.spec.dcoveracratio-max'
              )}`}
            >
              {inv && selPV && pps.value !== undefined && spi.value !== undefined
                ? `${((selPV.pmax * pps.value * spi.value) / inv.paco_sandia).toFixed(2)} 
                / 
                ${(inv.pdcMax_sandia / inv.paco_sandia).toFixed(2)}`
                : null}
            </FormItem>
          </Col>
        </Row>
        <Row align='middle' justify='center'>
          <FormItem className={styles.submitBut}>
            <Button disabled={disabled} type='primary' onClick={handleOk}>
              {t('form.confirm')}
            </Button>
          </FormItem>
        </Row>
      </Form>
      <Drawer
        bodyStyle={{ padding: '0px' }}
        title={t('InverterTable.table')}
        placement='right'
        closable={false}
        onClose={() => setshowDrawer(false)}
        visible={showDrawer}
        width='50vw'
      >
        <InverterTableViewOnly data={inverterData} />
      </Drawer>
    </Spin>
  )
}
