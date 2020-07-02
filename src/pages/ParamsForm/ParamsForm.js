import React, { useState, useEffect } from 'react'
import { Form, Row, Col, Slider, Divider, Typography, Button, Card, Space, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateProjectAttributes } from '../../store/action/index'
import { useHistory } from 'react-router-dom'
import { saveProject } from '../Project/service'
import * as styles from './ParamsForm.module.scss'
const FormItem = Form.Item;
const { Text } = Typography;

const rowGutter = { xs: 8, sm: 16};
const labelCol = { span: 16, offset: 4 };
const wrapperCol = { span: 16, offset: 4 };


const ParamsForm = () => {
  const { t } = useTranslation();
  const history = useHistory()
  const dispatch = useDispatch();
  const projectData = useSelector(state => state.project)
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const projectID = history.location.pathname.split('/')[2]

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

  // p_loss_mismatch标识
  const pLossMismatchMarks = {
    0: t('report.paramsForm.loss_0'),
    5: {style: markStyle, label: t('report.paramsForm.loss_5')},
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
    [['p_loss_connection', 0.01, 0, 1, pLossConnectionMarks], ['p_loss_mismatch', 0.1, 0, 5, pLossMismatchMarks]],
    [['p_loss_temperature', 'disabled', 'disabled'], ['year1Decay', 'pv', 'pv']],
    [['p_loss_dc_wiring', 'disabled', 'disabled'], ['year2To25Decay', 'pv', 'pv']]
  ]

  const acKeys = [
    [['p_loss_conversion', 'disabled', 'disabled']]
  ]

  const gridKeys = [
    [['transformer_efficiency', 'disabled', 100, transformerEfficiencyMarks], ['p_loss_ac_wiring', 'disabled', 'disabled']]
  ]

  const wiringKeys = [
    [['Ub', 'n', 'V'], ['ACVolDropFac', 0.05, 0.1, 5, ACVolDropFacMarks]],
    [['DCVolDropFac', 0.05, 0.1, 2, DCVolDropFacMarks]]
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
    console.log(values)
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
      form.setFieldsValue(projectData)
    } else {
      form.setFieldsValue({
        p_loss_soiling: 2,
        p_loss_connection: 0.5,
        p_loss_mismatch: 2,
        transformer_efficiency: 100,
        system_availability: 100,
        Ub: 380,
        ACVolDropFac: 2,
        DCVolDropFac: 1
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
