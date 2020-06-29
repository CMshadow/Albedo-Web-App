import React from 'react';
import { useTranslation } from 'react-i18next'
import { Descriptions, Typography, Space } from 'antd'
import { useSelector } from 'react-redux'
const Item = Descriptions.Item
const Text = Typography.Text

export const SpecView = ({buildingID, specIndex, invIndex}) => {
  const { t } = useTranslation()

  const buildings = useSelector(state => state.project.buildings)
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )
  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )

  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const spec = buildings[buildingIndex].data[specIndex].inverter_wiring[invIndex]
  const selPV = pvData.find(pv =>
    pv.pvID === buildings[buildingIndex].data[specIndex].pv_panel_parameters.pv_model.pvID
  )
  const selInv = inverterData.find(inv =>
    inv.inverterID === spec.inverter_model.inverterID
  )

  const checkSpiWarning = () => {
    if (spec.string_per_inverter > selInv.strNum) {
      return <Text type='warning'>{t('project.spec.spi.error.over-max')}</Text>
    }
    return null
  }
  const checkPpsWarning = () => {
    if (spec.panels_per_string > Math.floor(selInv.vdcMax / selPV.voco)) {
      return <Text type='warning'>{t('project.spec.spi.error.over-max')}</Text>
    }
    return null
  }

  return (
    <Descriptions column={3}>
      <Item label={t('project.spec.serial')} span={1}>{spec.inverter_serial_number}</Item>
      <Item label={t('project.spec.inverter')} span={2}>{selInv.name}</Item>
      <Item label={t('project.spec.string_per_inverter')}>
        <Space>{spec.string_per_inverter}{checkSpiWarning()}</Space>
      </Item>
      <Item label={t('project.spec.panels_per_string')}>
        <Space>{spec.panels_per_string} {checkPpsWarning()}</Space>
      </Item>
      <Item label={t('project.spec.total_panels')}>{spec.string_per_inverter * spec.panels_per_string}</Item>
      <Item label={t('project.spec.ac_cable_len')}>{spec.ac_cable_len}m</Item>
      <Item label={t('project.spec.dc_cable_len')} span={2}>{spec.dc_cable_len.map(v => `${v}m`).join(', ')}</Item>
    </Descriptions>
  )
}
