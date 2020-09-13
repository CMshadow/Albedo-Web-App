import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Row, Col, Select, InputNumber, Form, Tooltip, Typography } from 'antd'
import { transDefaultValue6Kor10K, transDefaultValue35K } from './defaultValues'

const FormItem = Form.Item;
const { Option } = Select
const {Text} = Typography

const rowGutter = { xs: [8, 12], sm: [16, 12]}


const max6Kor10K = 2500
const max35K = 31500

const autoValue = (Ub, capacity, type) => {
  const cal = (defaultValues, type, prev_cap, next_cap, prop) => (
    defaultValues[type][prev_cap][prop] + 
    (capacity - prev_cap) * (
      defaultValues[type][next_cap][prop] - 
      defaultValues[type][prev_cap][prop]
    ) / (next_cap - prev_cap)
  )

  let capacities
  let defaultValues
  if (Ub <= 10000) {
    capacities = Object.keys(transDefaultValue6Kor10K[type]).map(key => Number(key))
    defaultValues = transDefaultValue6Kor10K
  } else {
    if (!(type in transDefaultValue35K)) return
    capacities = Object.keys(transDefaultValue35K[type]).map(key => Number(key))
    defaultValues = transDefaultValue35K
  }

  if (capacity < capacities[0] || capacity > capacities.slice(-1)[0]) return

  if (capacities.includes(capacity)) {
    return {
      no_load_loss: defaultValues[type][capacity].no_load_loss, 
      short_circuit_loss: defaultValues[type][capacity].short_circuit_loss
    }
  }

  for (let i = 0; i < capacities.length; i += 1) {
    if (capacities[i] >= capacity) {
      const prev_cap = capacities[i - 1]
      const next_cap = capacities[i]
      const short_circuit_loss = cal(defaultValues, type, prev_cap, next_cap, 'short_circuit_loss')
      const no_load_loss = cal(defaultValues, type, prev_cap, next_cap, 'no_load_loss')
      return {no_load_loss: no_load_loss, short_circuit_loss: short_circuit_loss}
    }
  }
}


export const TransformerModel = ({form, initUb}) => {
  const { t } = useTranslation()
  const [showAdvance, setshowAdvance] = useState(initUb >= 6000)
  const [Ub, setUb] = useState(initUb)
  const [disableDryType, setdisableDryType] = useState(false)

  const autoField = (t, c) => {
    const type = t || form.getFieldValue('transformer_type')
    const capacity = c || form.getFieldValue('transformer_capacity')
    if (type && capacity >= 0) {
      const autoValues = autoValue(form.getFieldValue('Ub'), capacity, type)
      if (autoValues) {
        form.setFieldsValue({
          'transformer_no_load_loss': autoValues.no_load_loss,
          'transformer_short_circuit_loss': autoValues.short_circuit_loss
        })
      } else {
        form.setFieldsValue({
          'transformer_no_load_loss': null,
          'transformer_short_circuit_loss': null
        })
      }
    }
  }

  const onChangeUb = (val) => {
    setUb(val)
    val >= 6000 ? setshowAdvance(true) : setshowAdvance(false)
    if (val === 35000) {
      form.setFieldsValue({'transformer_type': 'oil-immersed'})
      setdisableDryType(true)
    } else {
      setdisableDryType(false)
    }
  }

  return (
    <Row gutter={rowGutter}>
      <Col span={12}>
        <FormItem
          name='Ub'
          label={ t(`report.paramsForm.Ub`) }
          rules={[{required: true}]}
          labelCol={{span:16, offset:4}}
          wrapperCol={{span:16, offset:4}}
        >
          <Select onChange={onChangeUb}>
            <Option value={120}>120 V</Option>
            <Option value={220}>220 V</Option>
            <Option value={380}>380 V</Option>
            <Option value={6000}>6 kV</Option>
            <Option value={10000}>10 kV</Option>
            <Option value={35000}>35 kV</Option>
          </Select>
        </FormItem>
      </Col>

      <Col span={12}>
      {
        showAdvance ?
        <>
          <FormItem
            style={{margin: 0}}
            label={t('report.paramsForm.transformer.power_loss')}
            rules={[{required: true}]}
            labelCol={{span: 22, offset: 2}}
            wrapperCol={{span: 22, offset: 2}}
          >
            <Row align='middle'>
              <Col span={12}>
                <FormItem 
                  style={{margin: 10}} 
                  name='transformer_type' 
                  label={t('report.paramsForm.transformer.power_loss.type')}
                  rules={[{required: true}]} 
                >
                  <Select onChange={val => autoField(val)}>
                    <Option value='oil-immersed'>
                      {t('report.paramsForm.transformer.power_loss.type.oil-immersed')}
                    </Option>
                    <Option value='dry-type' disabled={disableDryType}>
                      {t('report.paramsForm.transformer.power_loss.type.dry-type')}
                    </Option>
                  </Select>
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  style={{margin: 10}}
                  label={
                    <Tooltip title={t('report.paramsForm.transformer.power_loss.capacity')}>
                      S<sub>e</sub> <QuestionCircleOutlined />  
                    </Tooltip>
                  }
                >
                  <FormItem name='transformer_capacity' rules={[{required: true}]} noStyle>
                    <InputNumber 
                      onChange={val => autoField(null, val)} 
                      min={0} 
                      max={Ub <= 10000 ? max6Kor10K : max35K}
                    />
                  </FormItem>
                  <Text> kVA</Text>
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem
                  style={{margin: 10}}
                  label={
                    <Tooltip title={t('report.paramsForm.transformer.power_loss.no_load_loss')}>
                      ΔP<sub>0</sub> <QuestionCircleOutlined />  
                    </Tooltip>
                  }
                >
                  <FormItem name='transformer_no_load_loss' rules={[{required: true}]} noStyle>
                    <InputNumber />
                  </FormItem>
                  <Text> W</Text>
                </FormItem>
              </Col>

              <Col span={12}>
                <FormItem
                  style={{margin: 10}}
                  label={
                    <Tooltip title={t('report.paramsForm.transformer.power_loss.short_circuit_loss')}>
                      P<sub>k</sub> <QuestionCircleOutlined />  
                    </Tooltip>
                  }
                >
                  <FormItem name='transformer_short_circuit_loss' rules={[{required: true}]} noStyle>
                    <InputNumber />
                  </FormItem>
                  <Text> W</Text>
                </FormItem>
              </Col>
            </Row>
          </FormItem>

          <FormItem
            label={t('report.paramsForm.transformer.consumption_loss')}
            rules={[{required: true}]}
            labelCol={{span: 22, offset: 2}}
            wrapperCol={{span: 22, offset: 2}}
          >
            <Row>
              <Col span={24}>
                <FormItem
                  style={{margin: 10}}
                  label={
                    <Tooltip title={t('report.paramsForm.transformer.consumption_loss.power')}>
                      S<sub>c</sub> <QuestionCircleOutlined />
                    </Tooltip>
                  }
                >
                  <FormItem 
                    name='transformer_power' 
                    initialValue={150}
                    rules={[{required: true}]} 
                    noStyle
                  >
                    <InputNumber />
                  </FormItem>
                  <Text> W</Text>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </> :
        null
      }
      </Col>
    </Row>
  )
}
