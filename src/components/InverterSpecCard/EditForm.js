import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom'
import { Form, Input, InputNumber, Row, Col, Select, Button, Drawer, Tooltip } from 'antd';
import { TableOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { editInverterSpec, setInverterActiveData } from '../../store/action/index'
import { InverterTableViewOnly } from '../InverterTable/InverterTableViewOnly'
import { manualInverter } from '../../pages/Project/service'
import * as styles from './EditForm.module.scss'
const FormItem = Form.Item;

const rowGutter = { md: 8, lg: 15, xl: 32 };

export const EditForm = ({buildingID, specIndex, invIndex, setediting}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [showDrawer, setshowDrawer] = useState(false)
  const inverterData = useSelector(state => state.inverter)
  const projectID = useLocation().pathname.split('/')[2]

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const specData = buildings[buildingIndex].data[specIndex]
  const invSpec = specData.inverter_wiring[invIndex]
  const [dc_cable_len, setdc_cable_len] = useState({
    value: invSpec.dc_cable_len ? invSpec.dc_cable_len.join(',') : null
  })

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  // 自定义校验组串线缆长度输入是否符合规范
  const validateDCCableLen = value => {
    // 含非数字
    if (value.split(',').some(v => isNaN(v))) {
      return {
        validateStatus: 'error',
        errorMsg: t('project.spec.dc_cable_len.error.only-number'),
      }
    }
    // 数量与该逆变器组串数不同
    const spi = form.getFieldValue('string_per_inverter')
    if (value.split(',').length !== spi) {
      return {
        validateStatus: 'error',
        errorMsg: t('project.spec.dc_cable_len.error.spi-not-match'),
      }
    }
    // 校验通过
    return {
      validateStatus: 'success',
      errorMsg: null,
    }
  }

  //组串线缆长度输入框改变回调
  const onDCCableLenChange = value => {
    setdc_cable_len({
      ...validateDCCableLen(value.target.value),
      value: value.target.value
    });
  }

  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form.validateFields()
    .then(success => {
      // 验证组串线缆长度输入是否规范
      const vali = validateDCCableLen(form.getFieldValue('dc_cable_len'))
      if (vali.validateStatus === 'error') {
        setdc_cable_len({
          ...vali,
          value: dc_cable_len.value
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

  const submitForm = (values) => {
    // 组串线缆长度string转换数字array
    values.dc_cable_len = values.dc_cable_len.split(',').map(v => Number(v))
    dispatch(editInverterSpec({
      buildingID, specIndex, invIndex, ...values,
      inverter_userID: inverterData.data.find(
        record => record.inverterID === values.inverterID
      ).userID
    }))
    setediting(false)
  }

  const invModelOnChange = inverterID => {
    const invUserID = inverterData.data.find(inv => inv.inverterID === inverterID).userID
    dispatch(manualInverter({
      projectID: projectID, invID: inverterID, invUserID: invUserID,
      pvID: specData.pv_panel_parameters.pv_model.pvID,
      pvUserID: specData.pv_panel_parameters.pv_model.userID,
      ttlPV: specData.pv_panel_parameters.pvNum
    }))
    .then(res => {
      console.log(res)
    })
  }

  return (
    <div>
      <Form
        colon={false}
        form={form}
        hideRequiredMark
        name="newSpec"
        scrollToFirstError
        validateMessages={validateMessages}
        onFinish={submitForm}
        initialValues={{
          ...invSpec,
          inverterID: invSpec.inverter_model.inverterID,
          dc_cable_len: invSpec.dc_cable_len ? invSpec.dc_cable_len.join(',') : null
        }}
      >
        <Row gutter={12}>
          <Col span={22}>
            <FormItem
              name='inverterID'
              label={t('project.spec.inverter')}
              rules={[{required: true}]}
            >
              <Select
                options={
                  inverterData.activeData.map(record => ({
                    label: record.name,
                    value: record.inverterID
                  }))
                }
                onSelect={invModelOnChange}
              />
            </FormItem>
          </Col>
          <Col span={2}>
            <Button
              shape="circle"
              icon={<TableOutlined />}
              onClick={() => setshowDrawer(true)}
            />
          </Col>
        </Row>
        <Row gutter={rowGutter}>
          <Col span={7}>
            <FormItem
              name='string_per_inverter'
              label={t('project.spec.string_per_inverter')}
              rules={[{required: true}]}
            >
              <InputNumber precision={0} min={1} className={styles.inputNumber}/>
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem
              name='panels_per_string'
              label={t('project.spec.panels_per_string')}
              rules={[{required: true}]}
            >
              <InputNumber precision={0} min={1} className={styles.inputNumber}/>
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem
              name='ac_cable_len'
              label={t('project.spec.ac_cable_len')}
              rules={[{required: true}]}
            >
              <InputNumber
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
                precision={2}
                min={0}
                className={styles.inputNumber}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem
              name='dc_cable_len'
              label={
                <Tooltip title={t(`project.spec.dc_cable_len.hint`)}>
                  <QuestionCircleOutlined className={styles.icon}/>
                  {t('project.spec.dc_cable_len')}
                </Tooltip>
              }
              validateStatus={dc_cable_len.validateStatus}
              help={dc_cable_len.errorMsg}
              rules={[{required: true}]}
            >
              <Input
                className={styles.inputNumber}
                addonAfter='m'
                value={dc_cable_len.value}
                onChange={onDCCableLenChange}
              />
            </FormItem>
          </Col>
        </Row>
        <Row align='middle' justify='center'>
          <FormItem className={styles.submitBut}>
            <Button type='primary' onClick={handleOk}>{t('form.confirm')}</Button>
          </FormItem>
        </Row>
      </Form>
      <Drawer
        bodyStyle={{padding: '0px'}}
        title={t('InverterTable.table')}
        placement="right"
        closable={false}
        onClose={() => setshowDrawer(false)}
        visible={showDrawer}
        width='50vw'
      >
        <InverterTableViewOnly
          data={inverterData.data}
          activeData={inverterData.activeData}
          setactiveData={(activeData) => dispatch(setInverterActiveData(activeData))}
        />
      </Drawer>
    </div>
  )
}
