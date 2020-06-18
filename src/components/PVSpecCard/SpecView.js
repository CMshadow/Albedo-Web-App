import React from 'react';
import { useTranslation } from 'react-i18next'
import { Descriptions } from 'antd'
import { useSelector } from 'react-redux'
import { w2other } from '../../utils/unitConverter'
const Item = Descriptions.Item

export const SpecView = ({buildingID, specIndex}) => {
  const { t } = useTranslation()

  const buildings = useSelector(state => state.project.buildings)
  const pvData = useSelector(state => state.pv.data)

  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const spec = buildings[buildingIndex].data[specIndex].pv_panel_parameters

  const pvIndex = pvData.map(record => record.pvID)
    .indexOf(spec.pv_model.pvID)
  const pvName = pvData[pvIndex].name

  const capacity = buildings[buildingIndex].data[specIndex].inverter_wiring
  .reduce((acc, obj) =>
    obj.panels_per_string * obj.string_per_inverter * pvData[pvIndex].pmax, 0
  )
  const pvNum = buildings[buildingIndex].data[specIndex].inverter_wiring
  .reduce((acc, obj) =>
    obj.panels_per_string * obj.string_per_inverter, 0
  )

  return (
    <Descriptions bordered column={2}>
      <Item label={t('project.spec.pv')} span={2}>{pvName}</Item>
      <Item label={t('project.spec.tilt_angle')}>{spec.tilt_angle}°</Item>
      <Item label={t('project.spec.azimuth')}>{spec.azimuth}°</Item>
      <Item label={t('project.spec.capacity')}>
        {`${w2other(capacity).value} ${w2other(capacity).unit}`}
      </Item>
      <Item label={t('project.spec.pvNum')}>{pvNum}</Item>
    </Descriptions>
  )
}
