import React from 'react'
import { useTranslation } from 'react-i18next'
import { Descriptions, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { m2other, w2other } from '../../../utils/unitConverter'
import styles from './CombinerBoxSpecCard.module.scss'
import { RootState } from '../../../@types'
const Item = Descriptions.Item
const { Text, Paragraph } = Typography

type SpecViewProps = {
  buildingID: string
  combiboxIndex: number
}

export const SpecView: React.FC<SpecViewProps> = ({ buildingID, combiboxIndex }) => {
  const { t } = useTranslation()
  const unit = useSelector((state: RootState) => state.unit.unit)
  const buildings = useSelector((state: RootState) => state.project?.buildings)
  const pvData = useSelector((state: RootState) => state.pv.data).concat(
    useSelector((state: RootState) => state.pv.officialData)
  )
  if (!buildings) return null

  const buildingIndex = buildings.map(building => building.buildingID).indexOf(buildingID)
  const combiboxData = buildings[buildingIndex].combibox[combiboxIndex]

  const capacity = buildings[buildingIndex].combibox[
    combiboxIndex
  ].linked_inverter_serial_num.reduce((acc, serial) => {
    const specIndex = Number(serial.split('-')[0]) - 1
    const invIndex = Number(serial.split('-')[1]) - 1
    const findInv = buildings[buildingIndex].data[specIndex].inverter_wiring[invIndex]
    const pvIndex = pvData
      .map(record => record.pvID)
      .indexOf(buildings[buildingIndex].data[specIndex].pv_panel_parameters.pv_model.pvID ?? '')
    return (
      acc +
      (findInv.panels_per_string ?? 0) * (findInv.string_per_inverter ?? 0) * pvData[pvIndex].pmax
    )
  }, 0)

  return (
    <>
      <Descriptions column={6} bordered layout='vertical' style={{ borderBottom: 0 }}>
        <Item label={t('project.spec.combibox_serial')} span={3}>
          <Text className={styles.serial}>C{combiboxData.combibox_serial_num.split('-')[1]}</Text>
        </Item>
        <Item label={t('project.spec.combibox_name')} span={3}>
          {combiboxData.combibox_name}
        </Item>
        <Item label={t('project.spec.combibox_vac')} span={2}>
          {combiboxData.combibox_vac} V
        </Item>
        <Item label={t('project.spec.capacity')} span={2}>
          {`${w2other(capacity).value} ${w2other(capacity).unit}`}
        </Item>
        <Item label={t('project.spec.combibox_cable_len')} span={2}>
          {m2other(unit, combiboxData.combibox_cable_len || 0).toFixed(2)} {unit}
        </Item>
        <Item label={t('project.spec.linked_inverter_serial_num')} span={6}>
          <Paragraph className={styles.linkedInverterParagraph}>
            {combiboxData.linked_inverter_serial_num.map(serial => `S${serial}`).join(' , ')}
          </Paragraph>
        </Item>
      </Descriptions>
    </>
  )
}
