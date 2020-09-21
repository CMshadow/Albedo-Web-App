import React from 'react';
import { useTranslation } from 'react-i18next'
import { Descriptions, Typography, Space } from 'antd'
import { useSelector } from 'react-redux'
import { m2other } from '../../../utils/unitConverter'
const Item = Descriptions.Item
const { Text } = Typography

export const SpecView = ({transformerIndex}) => {
  const { t } = useTranslation()
  const unit = useSelector(state => state.unit.unit)
  const transformers = useSelector(state => state.project.transformers)
  const transformerData = transformers[transformerIndex]

  return (
    <>
      <Descriptions column={{ lg:2, xl: 3}} bordered>
        <Item label={t('project.spec.transformer_serial_num')} span={1}>
          <Text style={{color: '#73d13d'}}>
            T{transformerData.transformer_serial_num}
          </Text>
        </Item>
        <Item label={t('project.spec.transformer_name')} span={1}>
          {transformerData.transformer_name}
        </Item>
        <Item label={t('project.spec.transformer_vac')} span={1}>
          {transformerData.transformer_vac} V
        </Item>
        <Item label={t('project.spec.transformer.Ut')} span={1}>
          {transformerData.Ut} V
        </Item>
        <Item label={t('project.spec.transformer_cable_len')} span={1}>
          {m2other(unit, transformerData.transformer_cable_len).toFixed(2)} {unit}
        </Item>
        <Item label={t('project.spec.transformer.type')} span={1}>
          {t(`project.spec.transformer.type.${transformerData.transformer_type}`)}
        </Item>
        <Item label={t('project.spec.transformer_capacity')} span={1}>
          {transformerData.transformer_capacity} kVA
        </Item>
        <Item label={t('project.spec.transformer.power_loss.short_circuit_loss')} span={1}>
          {transformerData.transformer_short_circuit_loss} W
        </Item>
        <Item label={t('project.spec.transformer.power_loss.no_load_loss')} span={1}>
          {transformerData.transformer_no_load_loss} W
        </Item>
        <Item label={t('project.spec.transformer.consumption_loss.power')} span={3}>
          {transformerData.transformer_power} W
        </Item>
        {
          transformerData.linked_combibox_serial_num.length > 0 ?
          <Item label={t('project.spec.linked_combibox_serial_num')} span={3}>
            <Space size='middle'>
            {
              transformerData.linked_combibox_serial_num.map(serial =>
                <Text key={serial} style={{color: '#1890ff'}}>
                  {`${serial.split('-')[0]}-C${serial.split('-').slice(1,).join('-')}`}
                </Text>
              )
            }
            </Space>
          </Item> :
          null
        }
        {
          transformerData.linked_inverter_serial_num.length > 0 ?
          <Item label={t('project.spec.linked_inverter_serial_num')} span={3}>
            <Space size='middle'>
            {
              transformerData.linked_inverter_serial_num.map(serial =>
                <Text key={serial} style={{color: '#faad14'}}>
                  {`${serial.split('-')[0]}-S${serial.split('-').slice(1,).join('-')}`}
                </Text>
              )
            }
            </Space>
          </Item> :
          null
        }
      </Descriptions>
  </>
  )
}
