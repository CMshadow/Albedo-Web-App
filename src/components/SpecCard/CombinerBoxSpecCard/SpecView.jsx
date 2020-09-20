import React from 'react';
import { useTranslation } from 'react-i18next'
import { Descriptions, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { m2other, w2other } from '../../../utils/unitConverter'
const Item = Descriptions.Item
const { Text } = Typography

export const SpecView = ({buildingID, combiboxIndex}) => {
  const { t } = useTranslation()
  const unit = useSelector(state => state.unit.unit)
  const buildings = useSelector(state => state.project.buildings)
  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )
  const buildingIndex = buildings.map(building => building.buildingID).indexOf(buildingID)
  const combiboxData = buildings[buildingIndex].combibox[combiboxIndex]

  const capacity = buildings[buildingIndex].combibox[combiboxIndex].linked_inverter_serial_num
    .reduce((acc, serial) => {
      const specIndex = serial.split('-')[0] - 1
      const invIndex = serial.split('-')[1] - 1
      const findInv = buildings[buildingIndex].data[specIndex].inverter_wiring[invIndex]
      const pvIndex = pvData.map(record => record.pvID)
        .indexOf(buildings[buildingIndex].data[specIndex].pv_panel_parameters.pv_model.pvID)
      return acc + findInv.panels_per_string * findInv.string_per_inverter * pvData[pvIndex].pmax
    }, 0)

  return (
    <Descriptions column={{ lg:2, xl: 3}}>
      <Item label={t('project.spec.combibox_serial')} span={1}>
        <Text style={{color: '#1890ff'}}>
          C{combiboxData.combibox_serial_num.split('-')[1]}
        </Text>
      </Item>
      <Item label={t('project.spec.combibox_name')} span={1}>
        {combiboxData.combibox_name}
      </Item>
      <Item label={t('project.spec.combibox_vac')} span={1}>
        {combiboxData.combibox_vac} V
      </Item>
      <Item label={t('project.spec.capacity')} span={1}>
        {`${w2other(capacity).value} ${w2other(capacity).unit}`}
      </Item>
      <Item label={t('project.spec.combibox_cable_len')} span={2}>
        {m2other(unit, combiboxData.combibox_cable_len).toFixed(2)} {unit}
      </Item>
      <Item label={t('project.spec.linked_inverter_serial_num')} span={3}>
        {combiboxData.linked_inverter_serial_num.join(', ')}
      </Item>
    </Descriptions>
  )
}
