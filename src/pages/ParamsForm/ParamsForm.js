import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Slider, Divider, Typography, Button, Card, Space, InputNumber, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateProjectAttributes } from '../../store/action/index'
import { useHistory } from 'react-router-dom'
import { saveProject } from '../Project/service'
import { HorizonChart } from '../../components/ReportCharts/HorizonChart'
import * as styles from './ParamsForm.module.scss'
const FormItem = Form.Item;
const { Text } = Typography;
const { Option, OptGroup } = Select

const rowGutter = { xs: [8, 12], sm: [16, 12]};
const labelCol = { span: 16, offset: 4 };
const wrapperCol = { span: 16, offset: 4 };

const modelDefaultParams = {
  'sandia,glass/cell/glass,open-rack': {a: -3.47, b: -0.0594, dtc: 3},
  'sandia,glass/cell/glass,insulated-back': {a: -2.98, b: -0.0471, dtc: 1},
  'sandia,glass/cell/polymer-sheet,open-rack': {a: -3.56, b: -0.0750, dtc: 3},
  'sandia,glass/cell/polymer-sheet,insulated-back': {a: -2.81, b: -0.0455, dtc: 0},
  'sandia,polymer/thin-film/steel,open-rack': {a: -3.58, b: -0.113, dtc: 3},
  'pvsyst,open-rack': {uc: 29, uv: 0, v: 1},
  'pvsyst,insulated-back': {uc: 15, uv: 0, v: 1}
}


const ParamsForm = () => {
  const { t } = useTranslation();
  const history = useHistory()
  const dispatch = useDispatch();
  const projectData = useSelector(state => state.project)
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const projectID = history.location.pathname.split('/')[2]

  const [celltempParams, setcelltempParams] = useState({})
  const [celltempModel, setcelltempModel] = useState('')
  const [customParams, setcustomParams] = useState(false)

  let horizonData = projectData.horizonData ? 
    JSON.parse(JSON.stringify(projectData.horizonData)) : 
    new Array(24).fill([]).map((val, index) => [(index + 1) * 15, 0])

  // 滑动输入条标识style
  const markStyle = {overflow: 'hidden', whiteSpace: 'nowrap'}

  // p_loss_soiling标识
  const pLossSoilingMarks = {
    0: t('report.paramsForm.loss_0'),
    5: {style: markStyle, label: t('report.paramsForm.loss_5')},
  };

  // p_loss_connection标识
  const pLossConnectionMarks = {
    0: t('report.paramsForm.loss_0'),
    1: {style: markStyle, label: t('report.paramsForm.loss_1')},
  };

  // p_loss_mismatch_withinstring标识
  const pLossMismatchWithinStringMarks = {
    0: t('report.paramsForm.loss_0'),
    5: {style: markStyle, label: t('report.paramsForm.loss_5')},
  };
  // p_loss_unavailable标识
  const pLossAvailabilityMarks = pLossMismatchWithinStringMarks

  // p_loss_mismatch_betweenstrings标识
  const pLossMismatchBetweenStringsMarks = {
    0: t('report.paramsForm.loss_0'),
    1: {style: markStyle, label: t('report.paramsForm.loss_1')},
  };

  // system_availability 和 transformer_efficiency标识
  const systemAvailabilityMarks = {
    0: t('report.paramsForm.availability_0'),
    100: {style: markStyle, label: t('report.paramsForm.availability_100')},
  };
  const transformerEfficiencyMarks = systemAvailabilityMarks

  // ACVolDropFac标识
  const ACVolDropFacMarks = {
    0.1: t('report.paramsForm.drop_0.1'),
    5: {style: markStyle, label: t('report.paramsForm.drop_5')}
  }

  // DCVolDropFac标识
  const DCVolDropFacMarks = {
    0.1: t('report.paramsForm.drop_0.1'),
    2: {style: markStyle, label: t('report.paramsForm.drop_2')}
  }

  const irrandianceKeys = [
    [['p_loss_soiling', 0.1, 0, 5, pLossSoilingMarks], ['p_loss_tilt_azimuth', 'disabled', 'disabled']],
    [['p_loss_eff_irradiance', 'disabled', 'disabled']]
  ]

  const dcKeys = [
    [['p_loss_connection', 0.01, 0, 1, pLossConnectionMarks]],
    [
      ['p_loss_mismatch_withinstring', 0.1, 0, 5, pLossMismatchWithinStringMarks],
      ['p_loss_mismatch_betweenstrings', 0.1, 0, 1, pLossMismatchBetweenStringsMarks]
    ],
    [['p_loss_temperature', 'temp', 'temp'], ['year1Decay', 'pv', 'pv']],
    [['p_loss_dc_wiring', 'disabled', 'disabled'], ['year2To25Decay', 'pv', 'pv']]
  ]

  const acKeys = [
    [['p_loss_conversion', 'disabled', 'disabled']]
  ]

  const gridKeys = [
    [
      ['transformer_efficiency', 'disabled', 100, transformerEfficiencyMarks], 
      ['p_loss_ac_wiring', 'disabled', 'disabled']
    ],
    [['p_loss_availability', 0.1, 0, 5, pLossAvailabilityMarks],]
  ]

  const wiringKeys = [
    [['Ub', 'n', 'V'], ['ACVolDropFac', 0.05, 0.1, 5, ACVolDropFacMarks]],
    [['DCVolDropFac', 0.05, 0.1, 2, DCVolDropFacMarks]]
  ]

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  const sandiaCelltempParamField = (
    <Row gutter={rowGutter}>
      <Col span={8}>
        <Space size='middle'>
          a: <InputNumber disabled={!customParams} value={celltempParams.a}/>
        </Space>
      </Col>
      <Col span={8}>
        <Space size='middle'>
          b: <InputNumber disabled={!customParams} value={celltempParams.b}/>
        </Space>
      </Col>
      <Col span={8}>
        <Space size='middle'>
          dtc: <InputNumber disabled={!customParams} value={celltempParams.dtc}/>
        </Space>
      </Col>
    </Row>
  )

  const pvsystCelltempParamField = (
    <Row gutter={rowGutter}>
      <Col span={8}>
        <Space size='middle'>
          Uc: <InputNumber disabled={!customParams} value={celltempParams.uc}/>
        </Space>
      </Col>
      <Col span={8}>
        <Space size='middle'>
          Uv: <InputNumber disabled={!customParams} value={celltempParams.uv}/>
        </Space>
      </Col>
      <Col span={8}>
        <Space size='middle'>
          v: <InputNumber disabled={!customParams} value={celltempParams.v}/>
        </Space>
      </Col>
    </Row>
  )

  const genFormInputArea = (key, step, min, max, marks) => {
    switch(step) {
      case 'disabled':
        return (
          <Text className={styles.fixedText} code>
            {t(`report.paramsForm.${step}`)}
          </Text>
        )
      case 'pv':
        return (
          <Space>
            <Text className={styles.fixedText} code>
              {t(`report.paramsForm.${step}`)}
            </Text>
            <Text>{t('report.paramsForm.or')}</Text>
            <InputNumber min={0} max={50} placeholder={t('report.paramsForm.overwrite')} />%
          </Space>
        )
      case 'n':
        return (
          <InputNumber
            style={{width: '100%'}} min={0} formatter={value => `${value}${min}`}
            parser={value => value.replace(`${min}`, '')}
          />
        )
        case 'temp':
          return (
            <>
              <Row gutter={rowGutter}>
                <Select 
                  onSelect={value => {
                    const model = value.split(',')[0]
                    const mode = value.split(',')[1]
                    if (mode === 'custom') {
                      setcelltempModel(model)
                      setcustomParams(true)
                      model === 'sandia' ? 
                      setcelltempParams({a: 0, b: 0, dtc: 0}) :
                      setcelltempParams({uc: 0, uv: 0, v: 0})
                    } else {
                      setcelltempModel(model)
                      setcustomParams(false)
                      setcelltempParams(modelDefaultParams[value])
                    }
                  }}
                >
                  <OptGroup label={t('report.paramsForm.celltemp_sandia')}>
                    <Option 
                      value='sandia,glass/cell/glass,open-rack' 
                      title={`${t('PV.glass/cell/glass')}, ${t('report.paramsForm.mount.open-rack')}`}
                    >
                      {t('PV.glass/cell/glass')}, {t('report.paramsForm.mount.open-rack')}
                    </Option>
                    <Option 
                      value='sandia,glass/cell/glass,insulated-back' 
                      title={`${t('PV.glass/cell/glass')}, ${t('report.paramsForm.mount.insulated-back')}`}
                    >
                      {t('PV.glass/cell/glass')}, {t('report.paramsForm.mount.insulated-back')}
                    </Option>
                    <Option 
                      value='sandia,glass/cell/polymer-sheet,open-rack' 
                      title={`${t('PV.glass/cell/polymer-sheet')}, ${t('report.paramsForm.mount.open-rack')}`}
                    >
                      {t('PV.glass/cell/polymer-sheet')}, {t('report.paramsForm.mount.open-rack')}
                    </Option>
                    <Option 
                      value='sandia,glass/cell/polymer-sheet,insulated-back' 
                      title={`${t('PV.glass/cell/polymer-sheet')}, ${t('report.paramsForm.mount.insulated-back')}`}
                    >
                      {t('PV.glass/cell/polymer-sheet')}, {t('report.paramsForm.mount.insulated-back')}
                    </Option>
                    <Option 
                      value='sandia,polymer/thin-film/steel,open-rack' 
                      title={`${t('PV.polymer/thin-film/steel')}, ${t('report.paramsForm.mount.open-rack')}`}
                    >
                      {t('PV.polymer/thin-film/steel')}, {t('report.paramsForm.mount.open-rack')}
                    </Option>
                    <Option 
                      value='sandia,custom' 
                      title={t('report.paramsForm.custom')}
                    >
                      {t('report.paramsForm.custom')}
                    </Option>
                  </OptGroup>
                  <OptGroup label={t('report.paramsForm.celltemp_pvsyst')}>
                    <Option 
                      value={'pvsyst,open-rack'}
                      title={t('report.paramsForm.mount.open-rack')}
                    >
                      {t('report.paramsForm.mount.open-rack')}
                    </Option>
                    <Option 
                      value={'pvsyst,insulated-back'}
                      title={t('report.paramsForm.mount.insulated-back')}
                    >
                      {t('report.paramsForm.mount.insulated-back')}
                    </Option>
                    <Option 
                      value='pvsyst,custom' 
                      title={t('report.paramsForm.custom')}
                    >
                      {t('report.paramsForm.custom')}
                    </Option>
                  </OptGroup>
                </Select>
              </Row>
              {
                celltempModel ?
                celltempModel === 'pvsyst' ? 
                pvsystCelltempParamField : 
                sandiaCelltempParamField :
                null
              }
            </>
          )  
      default:
        return <Slider marks={marks} step={step} min={min} max={max}/>
    }
  }

  // 动态生成表单字段组件
  const genFormItems = (keys, itemsPerRow) => keys.map((keysInRow, index) =>
    <Row gutter={rowGutter} key={index}>
      {keysInRow.map(([key, step, min, max, marks]) =>
        <Col span={ 24 / itemsPerRow } key={key}>
          <FormItem
            name={key}
            label={ t(`report.paramsForm.${key}`) }
            rules={
              step !== 'disabled' && step !== 'pv' ? [{required: true}] : null
            }
          >
            {
              genFormInputArea(key, step, min, max, marks)
            }
          </FormItem>
        </Col>
      )}
    </Row>
  )

  // 表单提交
  const submitForm = async (values) => {
    setloading(true)
    // 去除values中所有undefined properties 并转换所有值为数字
    Object.keys(values).forEach(key =>
      values[key] === undefined ?
      {} :
      values[key]=Number(values[key])
    );
    // 补上地平线数据
    values.horizonData = horizonData
    // 更新redux中项目数据后更新后端的项目数据
    await dispatch(updateProjectAttributes(values))

    dispatch(saveProject(projectID))
    .then(res => {
      setloading(false)
      if (history.location.state && history.location.state.buildingID) {
        history.replace(`/project/${projectID}/report/${history.location.state.buildingID}`)
      } else {
        history.replace(`/project/${projectID}/dashboard`)
      }
    })

  }

  // 组间渲染后设置表单默认值
  useEffect(() => {
    if (projectData.p_loss_soiling >= 0) {
      const initValues = {...projectData}
      form.setFieldsValue(initValues)
    } else {
      form.setFieldsValue({
        p_loss_soiling: 2,
        p_loss_connection: 0.5,
        p_loss_mismatch_withinstring: 2,
        p_loss_mismatch_betweenstrings: 0.5,
        transformer_efficiency: 100,
        system_availability: 100,
        Ub: 380,
        ACVolDropFac: 2,
        DCVolDropFac: 1,
        p_loss_availability: 1,
        p_loss_temperature: 'glass/cell/glass,open-rack'
      })
    }
  }, [form, projectData])

  return (
    <Card className={styles.card} hoverable title={t('report.paramsForm.title')}>
      <Form
        form={form}
        name="report-params"
        scrollToFirstError
        validateMessages={validateMessages}
        labelAlign='left'
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        hideRequiredMark
        onFinish={submitForm}
        size='large'
      >
        <Divider>{t('report.paramsForm.irradiance')}</Divider>
        {genFormItems(irrandianceKeys, 2)}
        <Divider>{t('report.paramsForm.dc')}</Divider>
        {genFormItems(dcKeys, 2)}
        <Divider>{t('report.paramsForm.ac')}</Divider>
        {genFormItems(acKeys, 2)}
        <Divider>{t('report.paramsForm.grid')}</Divider>
        {genFormItems(gridKeys, 2)}
        <Divider>{t('report.paramsForm.wiring')}</Divider>
        {genFormItems(wiringKeys, 2)}
        <HorizonChart data={horizonData}/>
        <br/>
        <Row justify='center'>
          <Button
            loading={loading}
            type='primary'
            htmlType="submit"
          >
            {t('form.confirm')}
          </Button>
        </Row>
      </Form>
    </Card>
  )
}

export default ParamsForm
