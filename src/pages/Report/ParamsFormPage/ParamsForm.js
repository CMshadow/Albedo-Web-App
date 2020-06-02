import React, { useState } from 'react'
import { Form, Row, Col, Slider, Divider, Typography, Button, Card, Space, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateProjectAttributes } from '../../../store/action/index'
import { useHistory } from 'react-router-dom'
import { saveProject } from '../../Project/service'
import * as styles from './ParamsForm.module.scss'
const FormItem = Form.Item;
const { Text } = Typography;

const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128};
const labelCol = { xs: {span: 24}, sm: {span: 24}, md: {span: 24}, lg: {span: 8} };
const wrapperCol = { xs: {span: 24}, sm: {span: 24}, md: {span: 24}, lg: {span: 12, offset: 1} };


const ParamsForm = () => {
  const { t } = useTranslation();
  const history = useHistory()
  const dispatch = useDispatch();
  const projectData = useSelector(state => state.project)
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const projectID = history.location.pathname.split('/')[2]

  // 确定表单的初始值 从redux读项目的当前值或使用默认值
  let initValues
  if (projectData.p_loss_soiling) {
    initValues = projectData
  } else {
    initValues = {
      p_loss_soiling: 2,
      p_loss_connection: 0.5,
      p_loss_mismatch: 2,
      transformer_efficiency: 100,
      system_availability: 100
    }
  }


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

  const irrandianceKeys = [
    [['p_loss_soiling', 0.1, 5, pLossSoilingMarks], ['p_loss_tilt_azimuth', 'disabled', 'disabled']],
    [['p_loss_eff_irradiance', 'disabled', 'disabled']]
  ]

  const dcKeys = [
    [['p_loss_connection', 0.01, 1, pLossConnectionMarks], ['p_loss_mismatch', 0.1, 5, pLossMismatchMarks]],
    [['p_loss_temperature', 'disabled', 'disabled'], ['year1Decay', 'pv', 'pv']],
    [['p_loss_dc_wiring', 'disabled', 'disabled'], ['year2To25Decay', 'pv', 'pv']]
  ]

  const acKeys = [
    [['p_loss_conversion', 'disabled', 'disabled']]
  ]

  const gridKeys = [
    [['transformer_efficiency', 1, 100, transformerEfficiencyMarks], ['p_loss_ac_wiring', 'disabled', 'disabled']]
  ]

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  // 动态生成表单字段组件
  const genFormItems = (keys, itemsPerRow) => keys.map((keysInRow, index) =>
    <Row gutter={rowGutter} key={index}>
      {keysInRow.map(([key, step, max, marks]) =>
        <Col span={ 24 / itemsPerRow } key={key}>
          <FormItem
            name={key}
            label={ t(`report.paramsForm.${key}`) }
            rules={
              step !== 'disabled' && step !== 'pv' ? [{required: true}] : null
            }
          >
            {
              step === 'disabled' ?
              <Text className={styles.fixedText} code>
                {t(`report.paramsForm.${step}`)}
              </Text> : step === 'pv' ?
              <Space>
                <Text className={styles.fixedText} code>
                  {t(`report.paramsForm.${step}`)}
                </Text>
                <Text>{t('report.paramsForm.or')}</Text>
                <InputNumber min={0} max={50} placeholder={t('report.paramsForm.overwrite')} />%
              </Space> :
              <Slider marks={marks} step={step} max={max}/>
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
      delete values[key] :
      values[key]=Number(values[key])
    );
    // 更新redux中项目数据后更新后端的项目数据
    dispatch(updateProjectAttributes(values))
    setTimeout(() => {
      dispatch(saveProject(projectID))
      .then(res => {
        setloading(false)
        history.replace(`/project/${projectID}/report`)
      })
    }, 500)
  }

  return (
    <Card className={styles.card} hoverable title={t('report.paramsForm.title')}>
      <Form
        colon={false}
        form={form}
        name="report-params"
        scrollToFirstError
        validateMessages={validateMessages}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        initialValues={initValues}
        hideRequiredMark
        onFinish={submitForm}
      >
        <Divider>{t('report.paramsForm.irradiance')}</Divider>
        {genFormItems(irrandianceKeys, 2)}
        <Divider>{t('report.paramsForm.dc')}</Divider>
        {genFormItems(dcKeys, 2)}
        <Divider>{t('report.paramsForm.ac')}</Divider>
        {genFormItems(acKeys, 2)}
        <Divider>{t('report.paramsForm.grid')}</Divider>
        {genFormItems(gridKeys, 2)}
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
