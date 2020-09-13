import React from 'react';
import { useTranslation } from 'react-i18next'
import { Descriptions } from 'antd'
import { useSelector } from 'react-redux'
import { w2other } from '../../utils/unitConverter'
const Item = Descriptions.Item

export const SpecView = ({buildingID, specIndex}) => {
  const { t } = useTranslation()
  const unit = useSelector(state => state.unit.unit)
  const projectType = useSelector(state => state.project.projectType)
  const buildings = useSelector(state => state.project.buildings)
  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )

  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const spec = buildings[buildingIndex].data[specIndex].pv_panel_parameters

  const pvIndex = pvData.map(record => record.pvID)
    .indexOf(spec.pv_model.pvID)
  const pvName = pvData[pvIndex].name

  const capacity = buildings[buildingIndex].data[specIndex].inverter_wiring
  .reduce((acc, obj) =>
    acc + obj.panels_per_string * obj.string_per_inverter * pvData[pvIndex].pmax, 0
  )
  const pvNum = buildings[buildingIndex].data[specIndex].inverter_wiring
  .reduce((acc, obj) =>
    acc + obj.panels_per_string * obj.string_per_inverter, 0
  )

  const genCelltempText = () => {
    const model = spec.celltemp_model.split(',')[0]
    const second = spec.celltemp_model.split(',')[1]
    const modelText = t(`project.spec.model.${model}`)
    let modeText
    let mountText
    if (second === 'custom') {
      modeText = t(`project.spec.mode.${second}`)
      mountText = null
    } else {
      if (model === 'pvsyst') {
        modeText = null
        mountText = t(`project.spec.mount.${second}`)
      } else {
        modeText = t(`PV.${second}`)
        mountText = t(`project.spec.mount.${spec.celltemp_model.split(',')[2]}`)
      }
    }

    return [modelText, modeText, mountText].filter(val => val).join(', ')
  }

  return (
    <Descriptions bordered column={2}>
      <Item label={t('project.spec.pv')} span={2}>{pvName}</Item>
      <Item label={t('project.spec.tilt_angle')}>{spec.tilt_angle}°</Item>
      <Item label={t('project.spec.azimuth')}>{spec.azimuth}°</Item>
      {
        projectType === 'domestic' ? null :
        <>
          <Item label={t('project.spec.ac_cable_avg_len')}>
            {spec.ac_cable_avg_len}{unit}
          </Item>
          <Item label={t('project.spec.dc_cable_avg_len')}>
            {spec.dc_cable_avg_len}{unit}
          </Item>
        </>
      }
      <Item label={t('project.spec.capacity')}>
        {`${w2other(capacity).value} ${w2other(capacity).unit}`}
      </Item>
      <Item label={t('project.spec.pvNum')}>{pvNum}</Item>
      <Item label={t('project.spec.celltemp-model')}>
        {genCelltempText()}
      </Item>
    </Descriptions>
  )
}
