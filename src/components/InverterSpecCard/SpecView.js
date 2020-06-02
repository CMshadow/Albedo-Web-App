import React from 'react';
import { useTranslation } from 'react-i18next'
import { Descriptions } from 'antd'
import { useSelector } from 'react-redux'
const Item = Descriptions.Item

export const SpecView = ({buildingID, specIndex, invIndex}) => {
  const { t } = useTranslation()

  const buildings = useSelector(state => state.project.buildings)
  const inverterData = useSelector(state => state.inverter.data)

  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const spec = buildings[buildingIndex].data[specIndex].inverter_wiring[invIndex]

  const inverterIndex = inverterData.map(record => record.inverterID)
    .indexOf(spec.inverter_model.inverterID)
  const inverterName = inverterData[inverterIndex].name

  return (
    <Descriptions column={3}>
      <Item label={t('project.spec.serial')} span={1}>{spec.inverter_serial_number}</Item>
      <Item label={t('project.spec.inverter')} span={2}>{inverterName}</Item>
      <Item label={t('project.spec.panels_per_string')}>{spec.panels_per_string}</Item>
      <Item label={t('project.spec.string_per_inverter')}>{spec.string_per_inverter}</Item>
      <Item label={t('project.spec.total_panels')}>{spec.string_per_inverter * spec.panels_per_string}</Item>
    </Descriptions>
  )
}
