import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Divider,
  message
} from 'antd';
import * as styles from './Modal.module.scss';
import { addPV, getPV, updatePV } from './service';
const FormItem = Form.Item;
const { Option } = Select;

const initValues = {
  'siliconMaterial': 'mc-Si',
  'moduleMaterial': 'glass/cell/glass'
}

export const PVModal = ({showModal, setshowModal, setdata, setactiveData, editRecord, seteditRecord}) => {
  const { t } = useTranslation();
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128};
  const labelCol = { xs: {span: 24}, sm: {span:24}, md: {span: 24}, lg: {span: 16}, xl: {span: 12}};
  const wrapperCol = { xs: {span: 24}, sm: {span:24}, md: {span: 24}, lg: {span: 8}, xl: {span: 12}};
  const formBasicKeys = [
    [['name', 's', ''], ['note', 's', '']],
    [['panelLength', 'n', 'mm'], ['panelWidth', 'n', 'mm']],
    [['panelHeight', 'n', 'mm'], ['panelWeight', 'n', 'kg']],
  ]
  const formSelectKeys = [
    [
      ['siliconMaterial', 'c', ['mc-Si', 'c-Si']],
      ['moduleMaterial', 'c', ['glass/cell/glass', 'PV.glass/cell/polymer-sheet', 'polymer/thin-film/steel']]
    ]
  ]
  const formAdvancedKeys = [
    [['seriesCell', 'n', ''], ['parallelCell', 'n', '']],
    [['pmax', 'n', 'Wp'], ['gammaPmax', 'n', '%/℃']],
    [['impo', 'n', 'A'], ['vmpo', 'n', 'V']],
    [['voco', 'n', 'V'], ['betaVoco', 'n', '%/℃']],
    [['isco', 'n', 'A'], ['alphaIsc', 'n', '%/℃']],
    [['alphaImp', 'n', '%/℃'], ['betaVmpo', 'n', '%/℃']],
    [['ixo', 'n', 'A'], ['ixxo', 'n', 'A']],
    [['t', 'n', '℃'], ['tPrime', 'n', '℃']],
    [['tenYDecay', 'n', '%'], ['twentyfiveYDecay', 'n', '%']],
  ]

  const genFormItemInput = (type, unit) => {
    switch (type) {
      case 'c': return (
        <Select>
          {
            unit.map(choice =>
              <Option key={choice} value={choice}>{t(`PV.${choice}`)}</Option>
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

  const genFormItems = (keys, itemsPerRow) => keys.map((keysInRow, index) =>
    <Row gutter={rowGutter} key={index}>
      {keysInRow.map(([key, type, unit, note]) =>
        <Col span={ 24 / itemsPerRow } key={key}>
          <FormItem
            valuePropName={ type === 'b' ? 'checked' : 'value'}
            name={key}
            label={ t(`PV.${key}`) }
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
    // 转换格式
    [].concat(...formBasicKeys).concat([].concat(...formAdvancedKeys))
    .forEach(([key, type,]) => {
      if (type === 'n') values[key] = Number(values[key])
    })

    let action;
    if (editRecord) {
      action = dispatch(updatePV({pvID: editRecord.pvID, values: values}))
    } else {
      action = dispatch(addPV({values}))
    }
    action.then(() => {
      setloading(false)
      setshowModal(false)
      editRecord ? message.success(t('PV.success.updatePV')) : message.success(t('PV.success.createPV'))
      const response = dispatch(getPV())
      response.then(data => {
        setdata(data)
        setactiveData(data)
      })
    }).catch(err => {
      console.log(err)
      setloading(false)
    })
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
      title={editRecord ? t('PVtable.edit-PV') : t('PVtable.add-PV')}
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
        name="add-PV"
        scrollToFirstError
        validateMessages={validateMessages}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        onFinish={submitForm}
      >
        {genFormItems(formBasicKeys, 2)}
        <Divider />
        {genFormItems(formSelectKeys, 2)}
        <Divider />
        {genFormItems(formAdvancedKeys, 2)}
      </Form>
    </Modal>
  )
}
