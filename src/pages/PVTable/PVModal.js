import React, { useState } from 'react';
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
  Button,
  Divider,
  notification,
  message
} from 'antd';
import * as styles from './PVModal.module.scss';
import { addPV } from './service';
const FormItem = Form.Item;
const { Option } = Select;

const PVModal = (props) => {
  const { t } = useTranslation();
  const [showModal, setshowModal] = useState(false);
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
    dispatch(addPV({values})).then(() => {
      setloading(false)
      setshowModal(false)
      message.success(t('PV.success.create'))
    }).catch(err => {
      console.log(err)
      setloading(false)
      notification.error({
        message: err.errorType,
        description: err.errorMessage
      })
    })
  }

  return (
    <div>
      <Button type="primary" onClick={() => setshowModal(true)}>
        {t('PVtable.add-PV')}
      </Button>
      <Modal
        title={t('PVtable.add-PV')}
        visible={showModal}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
        maskClosable={false}
        width={'80vw'}
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
          initialValues={{
            'siliconMaterial': 'mc-Si',
            'moduleMaterial': 'glass/cell/glass'
          }}
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
    </div>
  )
}

export default PVModal;
