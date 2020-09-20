import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Slider, Divider, Typography, Button, Card, Space, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateProjectAttributes } from '../../store/action/index'
import { useHistory } from 'react-router-dom'
import { saveProject } from '../Project/service'
import { HorizonChart } from '../../components/Charts/HorizonChart'
import { MonthlyAlbedoModel } from '../../components/MonthlyAlbedoModel/MonthlyAlbedoModel'
import * as styles from './ParamsForm.module.scss'
const FormItem = Form.Item;
const { Text } = Typography;

const rowGutter = { xs: [8, 12], sm: [16, 12]};
const labelCol = { span: 16, offset: 4 };
const wrapperCol = { span: 16, offset: 4 };

const genInitValues = (projectData) => {
  const initValues ={
    p_loss_soiling: 2,
    p_loss_connection: 0.5,
    p_loss_mismatch_withinstring: 2,
    p_loss_mismatch_betweenstrings: 0.1,
    system_availability: 100,
    Ub: 380,
    ACVolDropFac: 2,
    DCVolDropFac: 1,
    p_loss_availability: 0.5
  }
  new Array(12).fill(0).map((_, index) => index + 1).forEach(month =>
    initValues[`monthly_albedo-${month}`] = projectData.albedo
  )
  return initValues
}

const ParamsForm = () => {
  const { t } = useTranslation();
  const history = useHistory()
  const dispatch = useDispatch();
  const projectData = useSelector(state => state.project)
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const projectID = history.location.pathname.split('/')[2]

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
    [['p_loss_eff_irradiance', 'disabled', 'disabled'], ['monthly_albedo', 'albedo', 'albedo']]
  ]

  const dcKeys = [
    [['p_loss_connection', 0.01, 0, 1, pLossConnectionMarks]],
    [
      ['p_loss_mismatch_withinstring', 0.1, 0, 5, pLossMismatchWithinStringMarks],
      ['p_loss_mismatch_betweenstrings', 0.1, 0, 1, pLossMismatchBetweenStringsMarks]
    ],
    [['p_loss_temperature', 'disabled', 'disabled'], ['year1Decay', 'pv', 'pv']],
    [['p_loss_dc_wiring', 'disabled', 'disabled'], ['year2To25Decay', 'pv', 'pv']]
  ]

  const acKeys = [
    [['p_loss_conversion', 'disabled', 'disabled']]
  ]

  const gridKeys = [
    [['p_loss_availability', 0.1, 0, 5, pLossAvailabilityMarks]],
    [['p_loss_ac_wiring', 'disabled', 'disabled'], ['p_loss_transformer', 'disabled', 'disabled']]
  ]

  const wiringKeys = [
    [['ACVolDropFac', 0.05, 0.1, 5, ACVolDropFacMarks], ['DCVolDropFac', 0.05, 0.1, 2, DCVolDropFacMarks]]
  ]

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  const genFormInputArea = (key, step, min, max, marks) => {
    switch(step) {
      case 'disabled':
        return (
          <Text className={styles.fixedText} code>
            {t(`report.paramsForm.${step}`)}
          </Text>
        )
      case 'albedo':
        return <MonthlyAlbedoModel/>
      case 'pv':
        return (
          <Space>
            <Text className={styles.fixedText} code>
              {t(`report.paramsForm.${step}`)}
            </Text>
            <Text>{t('report.paramsForm.or')}</Text>
            <InputNumber min={0} max={5} placeholder={t('report.paramsForm.overwrite')} />%
          </Space>
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
              step !== 'disabled' && step !== 'pv' && step !== 'albedo' ? [{required: true}] : null
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
    // 去除values中所有undefined properties
    Object.keys(values).forEach(key => {
      if (values[key] === undefined) delete values[key]
    })
    // 特殊处理首年和次年后光致衰减
    if ('year1Decay' in values) {
      values['year1Decay'].length > 0 ?
      values['year1Decay'] = Number(values['year1Decay']) :
      delete values['year1Decay']
    }
    if ('year2To25Decay' in values) {
      values['year2To25Decay'].length > 0 ?
      values['year2To25Decay'] = Number(values['year2To25Decay']) :
      delete values['year2To25Decay']
    }
    // 补上地平线数据
    values.horizonData = horizonData
    // 处理每月albedo值
    values.monthly_albedo = []
    new Array(12).fill(0).map((_, index) => index + 1).forEach(month => {
      values.monthly_albedo.push(values[`monthly_albedo-${month}`])
      delete values[`monthly_albedo-${month}`]
    })
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
      new Array(12).fill(0).map((_, index) => index + 1).forEach(month =>
        initValues[`monthly_albedo-${month}`] = initValues.monthly_albedo[month - 1]
      )
      form.setFieldsValue(initValues)
    } else {
      form.setFieldsValue(genInitValues(projectData))
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
