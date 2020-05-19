import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Modal,
  Divider,
  notification,
  message
} from 'antd';
import * as styles from './Modal.module.scss';
import { addPV, getPV, updatePV } from './service';
const FormItem = Form.Item;
const { Option } = Select;

export const PVModal = ({showModal, setshowModal, setdata, setactiveData, editRecord, seteditRecord}) => {
  const { t } = useTranslation();
  const [loading, setloading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const rowGutter = { xs: 8, sm: 16, md: 32, lg: 48, xl: 64, xxl: 128};
  const labelCol = { xs: {span: 24}, sm: {span:14}, md: {span: 12}};
  const wrapperCol = { xs: {span: 24}, sm: {span:10}, md: {span: 12}};
  const formBasicKeys = [
    [['name', 's', ''], ['note', 's', '']],
    [['panelLength', 'n', 'mm'], ['panelWidth', 'n', 'mm']],
    [['panelHeight', 'n', 'mm'], ['panelWeight', 'n', 'kg']],
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

  const genFormItems = keys => keys.map((keysInRow, index) =>
    <Row gutter={rowGutter} key={index}>
      {keysInRow.map(([key, type, unit]) =>
        <Col span={12} key={key}>
          <FormItem
            name={key} label={t(`PV.${key}`)}
            rules={[{required: true}]}
          >
            {type === 's'?
              <Input placeholder={t(`PV.${key}.placeholder`)} /> :
              <InputNumber
                formatter={value => `${value}${unit}`}
                parser={value => value.replace(`${unit}`, '')}
                className={styles.input}
              />
            }
          </FormItem>
        </Col>
      )}
    </Row>
  )

  const validateMessages = {
    required: t('PV.required')
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
      notification.error({
        message: err.errorType,
        description: err.errorMessage
      })
    })
  }

  useEffect(() => {
    if (editRecord) {
      form.setFieldsValue(editRecord)
    } else{
      form.setFieldsValue({
        'siliconMaterial': 'mc-Si',
        'moduleMaterial': 'glass/cell/glass'
      })
    }
  }, [editRecord, form])

  return (
    <Modal
      title={t('PVtable.add-PV')}
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
        {genFormItems(formBasicKeys)}
        <Divider />
        <Row gutter={rowGutter}>
          <Col span={12}>
            <FormItem
              name='siliconMaterial'
              label={t('PV.siliconMaterial')}
              rules={[{required: true}]}
            >
              <Select>
                <Option value="mc-Si">{t('PV.mc-Si')}</Option>
                <Option value="c-Si">{t('PV.c-Si')}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              name='moduleMaterial'
              label={t('PV.moduleMaterial')}
              rules={[{required: true}]}
            >
              <Select>
                <Option value="glass/cell/glass">{t('PV.glass/cell/glass')}</Option>
                <Option value="glass/cell/polymer-sheet">{t('PV.glass/cell/polymer-sheet')}</Option>
                <Option value="polymer/thin-film/steel">{t('PV.polymer/thin-film/steel')}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        {genFormItems(formAdvancedKeys)}
      </Form>
    </Modal>
  )
}
