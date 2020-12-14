import React from 'react'
import { useTranslation } from 'react-i18next'
import { Descriptions, Typography } from 'antd'
import { useSelector } from 'react-redux'
import styles from './PowerCabinetSpecCard.module.scss'
import { RootState } from '../../../@types'
const Item = Descriptions.Item
const { Text, Paragraph } = Typography

type SpecViewProps = { powercabinetIndex: number }

export const SpecView: React.FC<SpecViewProps> = ({ powercabinetIndex }) => {
  const { t } = useTranslation()
  const powercabinets = useSelector((state: RootState) => state.project?.powercabinets || [])
  const powercabinetData = powercabinets[powercabinetIndex]

  return (
    <>
      <Descriptions column={4} bordered layout='vertical'>
        <Item label={t('project.spec.powercabinet.powercabinet_serial_num')} span={1}>
          <Text className={styles.powercabinetSerial}>
            P{powercabinetData.powercabinet_serial_num}
          </Text>
        </Item>
        <Item label={t('project.spec.powercabinet.powercabinet_name')} span={1}>
          {powercabinetData.powercabinet_name}
        </Item>
        <Item label={t('project.spec.powercabinet.Ub')} span={1}>
          {powercabinetData.Ub} V
        </Item>
        <Item label={t('project.spec.powercabinet.linked-capacity')} span={1}>
          {powercabinetData.powercabinet_linked_capacity} kVA
        </Item>
        {powercabinetData.linked_transformer_serial_num &&
        powercabinetData.linked_transformer_serial_num.length > 0 ? (
          <Item label={t('project.spec.linked_transformer_serial_num')} span={4}>
            <Paragraph className={styles.linkedTransformerParagraph}>
              {powercabinetData.linked_transformer_serial_num
                .map(serial => `T${serial}`)
                .join(' , ')}
            </Paragraph>
          </Item>
        ) : null}
        {powercabinetData.linked_combibox_serial_num.length > 0 ? (
          <Item label={t('project.spec.linked_combibox_serial_num')} span={4}>
            <Paragraph className={styles.linkedCombiboxParagraph}>
              {powercabinetData.linked_combibox_serial_num
                .map(serial => `${serial.split('-')[0]}-C${serial.split('-').slice(1).join('-')}`)
                .join(' , ')}
            </Paragraph>
          </Item>
        ) : null}
        {powercabinetData.linked_inverter_serial_num.length > 0 ? (
          <Item label={t('project.spec.linked_inverter_serial_num')} span={4}>
            <Paragraph className={styles.linkedInverterParagraph}>
              {powercabinetData.linked_inverter_serial_num
                .map(serial => `${serial.split('-')[0]}-S${serial.split('-').slice(1).join('-')}`)
                .join(' , ')}
            </Paragraph>
          </Item>
        ) : null}
      </Descriptions>
    </>
  )
}
