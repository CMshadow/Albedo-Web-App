import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Row, Col, Select, Form, Tooltip, Input, Divider } from 'antd'
import { transDefaultValue6Kor10K, transDefaultValue35K } from './defaultValues'

const FormItem = Form.Item;
const { Option } = Select

const rowGutter = { md: 8, lg: 15, xl: 32 };

// 给定Ut和当前关联设备容量，在国标中查找最接近的变压器容量
const nearestCapacity = (Ut, linkedCapacity) => {
  if (!linkedCapacity) {
    return null
  }

  let capacities
  if (Ut <= 10000) {
    capacities = Object.keys(transDefaultValue6Kor10K['oil-immersed']).map(key => Number(key))
  } else {
    capacities = Object.keys(transDefaultValue35K['oil-immersed']).map(key => Number(key))
  }
  let index = 0
  for (let i = 0; i < capacities.length; i += 1) {
    if (capacities[i] < linkedCapacity) {
      index += 1
    }
  }
  return capacities[index]
}

// 给定Ut，变压器容量，变压器类型，等差计算no_load_loss值和short_circuit_loss
const autoValue = (Ut, capacity, type) => {
  const cal = (defaultValues, type, prev_cap, next_cap, prop) => (
    defaultValues[type][prev_cap][prop] + 
    (capacity - prev_cap) * (
      defaultValues[type][next_cap][prop] - 
      defaultValues[type][prev_cap][prop]
    ) / (next_cap - prev_cap)
  )

  let capacities
  let defaultValues
  if (Ut <= 10000) {
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
      return {
        no_load_loss: Number(no_load_loss.toFixed(2)), 
        short_circuit_loss: Number(short_circuit_loss.toFixed(2))
      }
    }
  }
}


export const TransformerModel = ({form, transformerData, curCapacity, formChanged, setformChanged}) => {
  const { t } = useTranslation()
  const [disableDryType, setdisableDryType] = useState(false)

  // 如果提供有Ut, 变压器类型和变压器容量，自动更新 transformer_no_load_loss和transformer_short_circuit_loss
  // 否则清空
  const autoField = useCallback((t, c) => {
    const type = t || form.getFieldValue('transformer_type')
    const capacity = c || form.getFieldValue('transformer_capacity')
    if (type && capacity >= 0) {
      const autoValues = autoValue(form.getFieldValue('Ut'), capacity, type)
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
  }, [form])

  // Ut改变回调，同时会自动更新变压器容量值和变压器类型，并自动计算no_load_loss值和short_circuit_loss
  const onChangeUt = (val) => {
    setformChanged(true)
    form.setFieldsValue({'transformer_capacity': nearestCapacity(val, curCapacity)})
    if (val === 35000) {
      form.setFieldsValue({'transformer_type': 'oil-immersed'})
      autoField('oil-immersed', nearestCapacity(val, curCapacity))
      setdisableDryType(true)
    } else {
      autoField(null, nearestCapacity(val, curCapacity))
      setdisableDryType(false)
    }
  }

  // 当给入的当前关联设备容量变化时，如果存在Ut就会自动更新变压器容量值，transformer_no_load_loss和transformer_short_circuit_loss
  useEffect(() => {
    if (curCapacity !== transformerData.transformer_linked_capacity || formChanged) {
      if (form.getFieldValue('Ut')) {
        const nearestCap = nearestCapacity(form.getFieldValue('Ut'), curCapacity)
        form.setFieldsValue({'transformer_capacity': nearestCap})
        autoField(null, nearestCap)
      }
      form.setFieldsValue({'transformer_linked_capacity': Number(curCapacity.toFixed(2))})
    }

  }, [autoField, curCapacity, form, formChanged, transformerData.transformer_linked_capacity])

  return (
    <>
      <Row gutter={rowGutter}>
        <Col span={8}>
          <FormItem
            name='Ut'
            label={ t(`project.spec.transformer.Ut`) }
            rules={[{required: true}]}
          >
            <Select onChange={onChangeUt}>
              <Option value={6000}>6 kV</Option>
              <Option value={10000}>10 kV</Option>
              <Option value={35000}>35 kV</Option>
            </Select>
          </FormItem>
        </Col>

        <Col span={8}>
          <FormItem 
            name='transformer_type' 
            label={t('project.spec.transformer.type')}
            rules={[{required: true}]} 
          >
            <Select onChange={val => autoField(val)}>
              <Option value='oil-immersed'>
                {t('project.spec.transformer.type.oil-immersed')}
              </Option>
              <Option value='dry-type' disabled={disableDryType}>
                {t('project.spec.transformer.type.dry-type')}
              </Option>
            </Select>
          </FormItem>
        </Col>

        <Col span={8}>
          <FormItem 
            name='transformer_linked_capacity'
            label={t('project.spec.transformer.linked-capacity')}
          >
            <Input 
              type='number' 
              disabled
              addonAfter='kVA'
            />
          </FormItem>
        </Col>
      </Row>

      <Divider>{t('project.spec.transformer.power_loss')}</Divider>
      <Row gutter={rowGutter}>
        <Col span={8}>
          <FormItem
            name='transformer_capacity'
            label={
              <Tooltip title={t('project.spec.transformer.capacity')}>
                S<sub>e</sub> <QuestionCircleOutlined />  
              </Tooltip>
            }
            rules={[{required: true}]}
          >
            <Input 
              type='number' 
              onChange={val => autoField(null, Number(val.target.value))}
              addonAfter='kVA'
            />
          </FormItem>
        </Col>

        <Col span={8}>
          <FormItem
            name='transformer_no_load_loss'
            label={
              <Tooltip title={t('project.spec.transformer.power_loss.no_load_loss')}>
                ΔP<sub>0</sub> <QuestionCircleOutlined />  
              </Tooltip>
            }
            rules={[{required: true}]}
          >
            <Input type='number' addonAfter='W'/>
          </FormItem>
        </Col>

        <Col span={8}>
          <FormItem
            name='transformer_short_circuit_loss'
            label={
              <Tooltip title={t('project.spec.transformer.power_loss.short_circuit_loss')}>
                P<sub>k</sub> <QuestionCircleOutlined />  
              </Tooltip>
            }
            rules={[{required: true}]}
          >
            <Input type='number' addonAfter='W'/>
          </FormItem>
        </Col>
      </Row>
      
      <Divider>{t('project.spec.transformer.consumption_loss')}</Divider>
      <Row gutter={rowGutter}>
        <Col span={8}>
          <FormItem
            name='transformer_power' 
            label={
              <Tooltip title={t('project.spec.transformer.consumption_loss.power')}>
                S<sub>c</sub> <QuestionCircleOutlined />
              </Tooltip>
            }
            rules={[{required: true}]} 
          >
            <Input type='number' addonAfter='W' />
          </FormItem>
        </Col>
      </Row>

      <Divider>{t('project.spec.linked_combibox_inverter_serial_num')}</Divider>
    </>
  )
}
