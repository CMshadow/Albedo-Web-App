import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Form,
  Input,
  Select,
  Checkbox,
  Row,
  Col,
  Modal,
  Divider,
  notification,
  message,
  Collapse,
  Tooltip
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import * as styles from './Modal.module.scss';
import { addInverter, getInverter, updateInverter } from './service';
const FormItem = Form.Item;
const { Option } = Select;
const { Panel } = Collapse;

const initValues = {
  'c0': 0,
  'c1': 0,
  'c2': 0,
  'c3': 0,
  'radiator': 'forcedConvection'
}

export const InverterModal = ({showModal, setshowModal, setdata, setactiveData, editRecord, seteditRecord}) => {
  const { t } = useTranslation();
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128};
  const labelCol = { xs: {span: 24}, sm: {span:24}, md: {span: 24}, lg: {span: 16}, xl: {span: 12}};
  const wrapperCol = { xs: {span: 24}, sm: {span:24}, md: {span: 24}, lg: {span: 8}, xl: {span: 12}};
  const formBasicKeys = [
    [['name', 's', ''], ['note', 's', '']],
    [['inverterLength', 'n', 'mm'], ['inverterWidth', 'n', 'mm']],
    [['inverterHeight', 'n', 'mm'], ['inverterWeight', 'n', 'kg']],
  ]
  const formAdvancedKeys = [
    [['vdcMin', 'n', 'V'], ['vdcMax', 'n', 'V']],
    [['vdco', 'n', 'V'], ['vac', 'n', 'V']],
    [['vmpptMin', 'n', 'V'], ['vmpptMax', 'n', 'V']],
    [['paco', 'n', 'kWp'], ['pdco', 'n', 'kWp']],
    [['vso', 'n', 'V'], ['pso', 'n', 'kWp']],
    [['pdcMax', 'n', 'kWp'], ['idcMax', 'n', 'A']],
    [['iacMax', 'n', 'A'], ['pnt', 'n', 'W']],
    [['mpptNum', 'n', ''], ['mpptIdcmax', 'n', 'A']],
    [['strNum', 'n', ''], ['strIdcmax', 'n', 'A']],
    [['inverterEffcy', 'n', '%'], ['nationEffcy', 'n', '%']],
    [['acFreqMin', 'n', 'Hz'], ['acFreqMax', 'n', 'Hz']],
    [['nominalPwrFac', 'n', 'cosφ'], ['THDi', 'n', '%']],
    [['workingTempMin', 'n', '℃'], ['workingTempMax', 'n', '℃']],
    [['protectLvl', 's', ''], ['commProtocal', 's', '']],
    [['workingAltMax', 'n', 'm'], ['radiator', 'c', ['forcedConvection', 'naturalConvection']]]
  ]
  const formBoolKeys = [
    [
      ['grdTrblDetect', 'b', ''], ['overloadProtect', 'b', ''],
      ['revPolarityProtect', 'b', '']
    ],[
      ['overvoltageProtect', 'b', ''], ['shortCircuitProtect', 'b', ''],
      ['antiIslandProtect', 'b', '']
    ],[
      ['overheatProtect', 'b', '']
    ],
  ]
  const formProKeys = [
    [['c0', 'n', '1/W', 'description'], ['c1', 'n', '1/V', 'description']],
    [['c2', 'n', '1/V', 'description'], ['c3', 'n', '1/V', 'description']],
  ]

  const genFormItemInput = (type, unit) => {
    switch (type) {
      case 'b': return (
        <Checkbox />
      )
      case 'c': return (
        <Select>
        {
          unit.map(choice =>
            <Option key={choice} value={choice}>{t(`Inverter.${choice}`)}</Option>
          )
        }
        </Select>
      )
      case 'n': return (
        <Input addonAfter={`${unit}`} type='number' className={styles.input} />
      )
      case 's':
      default: return (
        <Input />
      )
    }
  }

  const genFormItemLabel = (key, note) => {
    if (!note) {
      return t(`Inverter.${key}`)
    } else {
      return (
        <div>
          {t(`Inverter.${key}`)}
          <Tooltip title={t(`Inverter.${key}.${note}`)}>
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      )
    }
  }

  const genFormItems = (keys, itemsPerRow) => keys.map((keysInRow, index) =>
    <Row gutter={rowGutter} key={index}>
      {keysInRow.map(([key, type, unit, note]) =>
        <Col span={ 24 / itemsPerRow } key={key}>
          <FormItem
            valuePropName={ type === 'b' ? 'checked' : 'value'}
            name={key}
            label={ genFormItemLabel(key, note) }
            rules={ type !== 'b' ? [{required: true}] : null }
          >
            { genFormItemInput(type, unit) }
          </FormItem>
        </Col>
      )}
    </Row>
  )

  const validateMessages = {
    required: t('form.required')
  };

  const onClose = () => {
    form.resetFields();
    seteditRecord(null);
  }

  const handleCancel = () => {
    setshowModal(false);
  };

  const handleOk = () => {
    form.validateFields()
    .then(success => {
      setloading(true);
      form.submit()
    })
    .catch(err => {
      form.scrollToField(err.errorFields[0].name[0])
      return
    })
  }

  const submitForm = (values) => {
    console.log(values)
    // 转换格式
    // [].concat(...formBasicKeys).concat([].concat(...formAdvancedKeys))
    // .forEach(([key, type,]) => {
    //   if (type === 'n') values[key] = Number(values[key])
    // })

    // let action;
    // if (editRecord) {
    //   action = dispatch(updateInverter({inverterID: editRecord.inverterID, values: values}))
    // } else {
    //   action = dispatch(addInverter({values}))
    // }
    // action.then(() => {
    //   setloading(false)
    //   setshowModal(false)
    //   editRecord ?
    //   message.success(t('Inverter.success.updateInverter')) :
    //   message.success(t('Inverter.success.createInverter'))
    //   const response = dispatch(getInverter())
    //   response.then(data => {
    //     setdata(data)
    //     setactiveData(data)
    //   })
    // }).catch(err => {
    //   console.log(err)
    //   setloading(false)
    //   notification.error({
    //     message: err.errorType,
    //     description: err.errorMessage
    //   })
    // })
  }

  useEffect(() => {
    if (editRecord) {
      form.setFieldsValue(editRecord)
    } else{
      form.setFieldsValue(initValues)
    }
  }, [editRecord, form])

  return (
    <Modal
      title={
        editRecord ?
        t('InverterTable.edit-Inverter') :
        t('InverterTable.add-Inverter')
      }
      visible={showModal}
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={handleCancel}
      okText={t('action.confirm')}
      cancelText={t('action.cancel')}
      maskClosable={false}
      width={'80vw'}
      afterClose={onClose}
    >
      <Form
        colon={false}
        form={form}
        className={styles.form}
        name="Inverter"
        scrollToFirstError
        validateMessages={validateMessages}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        onFinish={submitForm}
      >
        {genFormItems(formBasicKeys, 2)}
        <Divider />
        {genFormItems(formAdvancedKeys, 2)}
        <Divider />
        {genFormItems(formBoolKeys, 3)}
        <Divider />
        <Collapse bordered={false}>
          <Panel
            className={styles.collapsePanel}
            header={t('InverterTable.proParams')}
            key="pro"
          >
            {genFormItems(formProKeys, 2)}
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  )
}
