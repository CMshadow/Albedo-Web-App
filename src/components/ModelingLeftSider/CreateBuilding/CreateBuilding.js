import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Divider, Row, Col, Typography, Input, Select, Card } from 'antd';
import * as actions from '../../../store/action/index'
import * as objTypes from '../../../store/action/drawing/objTypes'
import * as styles from './CreateBuilding.module.scss'
const FormItem = Form.Item
const Title = Typography.Title
const { Option } = Select;

const formItemLayout = {
  labelCol: {span: 10},
  wrapperCol: {span: 14}
}

export const CreateBuilding = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm();

  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  const submitForm = () => {
    dispatch(actions.setUIDrawing())
  }

  return (
    <Form
      colon={false}
      form={form}
      name="create-Building"
      scrollToFirstError
      hideRequiredMark
      validateMessages={validateMessages}
      labelAlign='left'
      onFinish={submitForm}
    >
      <Card bordered={false} title={t('modeling.createBuilding.buildingInfo')} style={{backgroundColor: '#f9f9f9'}}>
        <FormItem
          name='buildingName' label={t('modeling.createBuilding.buildingName')}
          rules={[{required: true}]} labelCol={{span: 24}} wrapperCol={{span: 24}}
        >
          <Input placeholder={t('modeling.createBuilding.buildingName')} size='middle'/>
        </FormItem>
        <FormItem
          name='buildingType' label={t('modeling.createBuilding.buildingType')}
          {...formItemLayout}
        >
          <Select defaultValue='flat' >
            <Option value="flat">{t('modeling.createBuilding.buildingType.flat')}</Option>
            <Option value="pitched">{t('modeling.createBuilding.buildingType.pitched')}</Option>
          </Select>
        </FormItem>
      </Card>
      <Card bordered={false} title={t('modeling.createBuilding.buildingParams')} style={{backgroundColor: '#f9f9f9'}}>
        <FormItem
          name='buildingHeight' label={t('modeling.createBuilding.buildingHeight')}
          rules={[{required: true}]} {...formItemLayout}
        >
          <Input type='number' addonAfter='m' placeholder={t('modeling.createBuilding.buildingHeight')}/>
        </FormItem>
        <FormItem
          name='parapetHeight' label={t('modeling.createBuilding.parapetHeight')}
          rules={[{required: true}]} {...formItemLayout}
        >
          <Input type='number' addonAfter='m' placeholder={t('modeling.createBuilding.parapetHeight')}/>
        </FormItem>
        <Divider />
        <FormItem
          name='eaveSetback' label={t('modeling.createBuilding.eaveSetback')}
          rules={[{required: true}]} {...formItemLayout}
        >
          <Input type='number' addonAfter='m' placeholder={t('modeling.createBuilding.eaveSetback')}/>
        </FormItem>
      </Card>
      <Row justify='center'>
        <FormItem >
          <Button type="primary" htmlType="submit" size='large'>
            Submit
          </Button>
        </FormItem>
      </Row>
    </Form>
  )
}
