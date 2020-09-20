import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Row, Col, Select, Form, Tooltip, Typography, Input, Divider } from 'antd'
import { transDefaultValue6Kor10K, transDefaultValue35K } from './defaultValues'
import * as styles from './TransformerModel.module.scss'

const FormItem = Form.Item;
const { Option } = Select

const rowGutter = { md: 8, lg: 15, xl: 32 };


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
      return {no_load_loss: no_load_loss, short_circuit_loss: short_circuit_loss}
    }
  }
}


export const TransformerModel = ({form, initUt, curCapacity, setcurCapacity}) => {
  const { t } = useTranslation()
  const [Ut, setUt] = useState(initUt)
  const [disableDryType, setdisableDryType] = useState(false)

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

  const onChangeUt = (val) => {
    setUt(val)
    if (val === 35000) {
      form.setFieldsValue({'transformer_type': 'oil-immersed'})
      setdisableDryType(true)
    } else {
      setdisableDryType(false)
    }
  }

  useEffect(() => {
    form.setFieldsValue({'transformer_capacity': curCapacity})
    autoField(null, curCapacity)
  }, [autoField, curCapacity, form])

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
              onChange={val => {
                setcurCapacity(Number(val.target.value))
                autoField(null, Number(val.target.value))
              }} 
              addonAfter='kVA'
            />
          </FormItem>
        </Col>
      </Row>

      
        <FormItem
          className={styles.formItem}
          label={t('project.spec.transformer.power_loss')}
          rules={[{required: true}]}
          wrapperCol={{offset: 1}}
        >
          <Row gutter={rowGutter}>
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
        </FormItem>

        <FormItem
          className={styles.formItem}
          label={t('project.spec.transformer.consumption_loss')}
          rules={[{required: true}]}
          wrapperCol={{offset: 1}}
        >
          <Row gutter={rowGutter}>
            <Col span={8}>
              <FormItem
                name='transformer_power' 
                initialValue={150}
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
        </FormItem>
        <Divider className={styles.divider}/>
    </>
  )
}
