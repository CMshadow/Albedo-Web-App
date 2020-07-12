import React from 'react';
import { useTranslation } from 'react-i18next'
import { Descriptions, Typography, Space } from 'antd'
import { useSelector } from 'react-redux'
import { m2other } from '../../utils/unitConverter'
const Item = Descriptions.Item
const Text = Typography.Text

export const SpecView = ({buildingID, specIndex, invIndex}) => {
  const { t } = useTranslation()
  const unit = useSelector(state => state.unit.unit)
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
      return <Text type='warning'>{t('project.spec.error.over-max')}</Text>
    }
    return null
  }
  const checkPpsWarning = () => {
    if (spec.panels_per_string > Math.floor(selInv.vdcMax / selPV.voco)) {
      return <Text type='warning'>{t('project.spec.error.over-max')}</Text>
    }
    return null
  }

  return (
    <Descriptions column={{ xl: 8, xxl: 12}}>
      <Item label={t('project.spec.serial')} span={4}>{spec.inverter_serial_number}</Item>
      <Item label={t('project.spec.inverter')} span={4}>{selInv.name}</Item>
      <Item label={t('project.spec.string_per_inverter')} span={4}>
        <Space>{spec.string_per_inverter} {checkSpiWarning()}</Space>
      </Item>
      <Item label={t('project.spec.panels_per_string')} span={4}>
        <Space>{spec.panels_per_string} {checkPpsWarning()}</Space>
      </Item>
      <Item label={t('project.spec.ac_cable_len')} span={4}>{m2other(unit, spec.ac_cable_len)} {unit}</Item>
      <Item label={t('project.spec.dc_cable_len')} span={4}>{spec.dc_cable_len.map(v => `${m2other(unit, v)} ${unit}`).join(', ')}</Item>
      <Item label={t('project.spec.total_panels')} span={4}>{spec.string_per_inverter * spec.panels_per_string}</Item>
    </Descriptions>
  )
}
