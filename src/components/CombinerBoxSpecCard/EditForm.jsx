import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Form, Input, Row, Col, Button, Collapse, Checkbox } from 'antd';
import { editCombibox } from '../../store/action/index'
import { other2m } from '../../utils/unitConverter'
import * as styles from './EditForm.module.scss'
const FormItem = Form.Item;
const { Panel } = Collapse;

const rowGutter = { md: 8, lg: 15, xl: 32 };

export const EditForm = ({buildingID, combiboxIndex, setediting, disabled}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const unit = useSelector(state => state.unit.unit)

  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID).indexOf(buildingID)
  const combiboxData = buildings[buildingIndex].combibox[combiboxIndex]


  // 通用required项提示文本
  const validateMessages = {
    required: t('form.required')
  };

  const handleOk = () => {
    // 验证表单，如果通过提交表单
    form.validateFields()
    .then(success => {
      form.submit()
    })
    .catch(err => {
      form.scrollToField(err.errorFields[0].name[0])
      return
    })
  }

  const submitForm = (values) => {
    // values.linked_inverter_serial_num = []
    // buildings[buildingIndex].data.forEach((subAry, subAryIndex) => {
    //   values.linked_inverter_serial_num = [
    //     ...values.linked_inverter_serial_num,
    //     ...values[`linked_inverter_serial_num_${subAryIndex + 1}`]
    //   ]
    //   delete values[`linked_inverter_serial_num_${subAryIndex + 1}`]
    // })
    values.combibox_cable_len = other2m(unit, Number(values.combibox_cable_len))
    dispatch(editCombibox({buildingID, combiboxIndex, ...values}))
    setediting(false)
  }

  const genInitValues = () => {
    const initValues = {...combiboxData}
    if (combiboxData.linked_inverter_serial_num) {
      combiboxData.linked_inverter_serial_num.forEach(serial => {
        const subAryIndex = serial.split('-')[0]
        const key = `linked_inverter_serial_num_${subAryIndex}`
        if (key in initValues) {
          initValues[key].push(serial)
        } else {
          initValues[key] = [serial]
        }
      })
    }
    initValues[`linked_inverter_serial_num_1`] = ['1-1']
    initValues[`linked_inverter_serial_num_0`] = ['1-1']
    initValues['combibox_name'] = 'fk'
    console.log(initValues)
    return initValues
  }
  console.log({...combiboxData, linked_inverter_serial_num: ['1-1']})
  return (
    <Form
      colon={false}
      form={form}
      hideRequiredMark
      name="combiboxSpec"
      scrollToFirstError
      validateMessages={validateMessages}
      onFinish={submitForm}
      initialValues={genInitValues()}
    >
      <Row gutter={rowGutter}>
        <Col span={12}>
          <FormItem
            name='combibox_name'
            label={t('project.spec.combibox_name')}
            rules={[{required: true}]}
          >
            <Input/>
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            name='combibox_cable_len'
            label={t('project.spec.combibox_cable_len')}
            rules={[{required: true}]}
          >
            <Input type='number' addonAfter={unit}/>
          </FormItem>
        </Col>
      </Row>
      {/* <FormItem label={t('project.spec.linked_inverter_serial_num')}>
      <FormItem
        name='linked_inverter_serial_num_0'
        noStyle
      >
        <Checkbox.Group
          options={[{'value': '1-1', 'label': '666-1-1'}]}
        />
      </FormItem>
      </FormItem> */}
      <Row gutter={rowGutter}>
        <Col span={24}>
          <FormItem label={t('project.spec.linked_inverter_serial_num')}>
            <Collapse ghost>
            {
              buildings[buildingIndex].data.map((subAry, subAryIndex) => 
                <Panel header={`${t('project.spec.subAry')}${subAryIndex + 1}`} key={subAryIndex}>
                  <FormItem
                    name={`linked_inverter_serial_num_${subAryIndex}`}
                    noStyle
                  >
                    <Checkbox.Group
                      options={
                        subAry.inverter_wiring.map(inv => ({
                          value: `${subAryIndex + 1}-${inv.inverter_serial_number}`,
                          label: `${subAryIndex + 1}-${inv.inverter_serial_number}`
                        }))
                      }
                    />
                  </FormItem>
                </Panel>
              )
            }
            </Collapse>
          </FormItem>
        </Col>
      </Row>
      <Row align='middle' justify='center'>
        <FormItem className={styles.submitBut}>
          <Button disabled={disabled} type='primary' onClick={handleOk}>
            {t('form.confirm')}
          </Button>
        </FormItem>
      </Row>
    </Form>
  )
}
