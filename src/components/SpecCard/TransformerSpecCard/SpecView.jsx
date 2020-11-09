import React from 'react'
import { useTranslation } from 'react-i18next'
import { Descriptions, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { m2other } from '../../../utils/unitConverter'
import * as styles from './TransformerSpecCard.module.scss'
const Item = Descriptions.Item
const { Text, Paragraph } = Typography

export const SpecView = ({ transformerIndex }) => {
  const { t } = useTranslation()
  const unit = useSelector(state => state.unit.unit)
  const transformers = useSelector(state => state.project.transformers)
  const transformerData = transformers[transformerIndex]

  return (
    <>
      <Descriptions column={4} bordered layout="vertical">
        <Item label={t('project.spec.transformer_serial_num')} span={2}>
          <Text className={styles.transformerSerial}>T{transformerData.transformer_serial_num}</Text>
        </Item>
        <Item label={t('project.spec.transformer_name')} span={2}>
          {transformerData.transformer_name}
        </Item>
        <Item label={t('project.spec.transformer_vac')} span={1}>
          {transformerData.transformer_vac} V
        </Item>
        <Item label={t('project.spec.transformer.Ut')} span={1}>
          {transformerData.Ut} V
        </Item>
        <Item label={t('project.spec.transformer_cable_len')} span={1}>
          {transformerData.transformer_cable_len
            ? m2other(unit, transformerData.transformer_cable_len).toFixed(2)
            : null}{' '}
          {unit}
        </Item>
        <Item label={t('project.spec.transformer.transformer_wir_choice')} span={1}>
          {transformerData.transformer_wir_choice}
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
        <Item label={t('project.spec.transformer.consumption_loss.power')} span={1}>
          {transformerData.transformer_power} W
        </Item>
        {transformerData.linked_combibox_serial_num.length > 0 ? (
          <Item label={t('project.spec.linked_combibox_serial_num')} span={4}>
            <Paragraph className={styles.linkedCombiboxParagraph}>
              {transformerData.linked_combibox_serial_num
                .map(serial => `${serial.split('-')[0]}-C${serial.split('-').slice(1).join('-')}`)
                .join(' , ')}
            </Paragraph>
          </Item>
        ) : null}
        {transformerData.linked_inverter_serial_num.length > 0 ? (
          <Item label={t('project.spec.linked_inverter_serial_num')} span={4}>
            <Paragraph className={styles.linkedInverterParagraph}>
              {transformerData.linked_inverter_serial_num
                .map(serial => `${serial.split('-')[0]}-S${serial.split('-').slice(1).join('-')}`)
                .join(' , ')}
            </Paragraph>
          </Item>
        ) : null}
      </Descriptions>
    </>
  )
}
