import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Descriptions, Typography, Space } from 'antd'
import { useSelector } from 'react-redux'
import { m2other } from '../../../utils/unitConverter'
import { genSPILimits, genPPSLimits } from './EditForm'
const Item = Descriptions.Item
const Text = Typography.Text

export const SpecView = ({ buildingID, specIndex, invIndex, initInvLimits }) => {
  const { t } = useTranslation()
  const [invSPILimit, setinvSPILimit] = useState([-Infinity, Infinity])
  const [invPPSLimit, setinvPPSLimit] = useState([-Infinity, Infinity])
  const unit = useSelector(state => state.unit.unit)
  const projectType = useSelector(state => state.project.projectType)
  const buildings = useSelector(state => state.project.buildings)
  const pvData = useSelector(state => state.pv.data).concat(
    useSelector(state => state.pv.officialData)
  )
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )

  const buildingIndex = buildings.map(building => building.buildingID).indexOf(buildingID)
  const spec = buildings[buildingIndex].data[specIndex].inverter_wiring[invIndex]
  const selPV = pvData.find(
    pv => pv.pvID === buildings[buildingIndex].data[specIndex].pv_panel_parameters.pv_model.pvID
  )
  const selInv = inverterData.find(inv => inv.inverterID === spec.inverter_model.inverterID) || {}

  // 所有使用的逆变器的vac
  const allVac = new Set(
    buildings.flatMap(building =>
      building.data.flatMap(spec =>
        spec.inverter_wiring
          .map(inverterSpec =>
            inverterSpec.inverter_model.inverterID
              ? inverterData.find(obj => obj.inverterID === inverterSpec.inverter_model.inverterID)
                  .vac
              : null
          )
          .filter(elem => elem !== null)
      )
    )
  )

  // 比较pps与PPS区间，生成警告文本
  const checkPpsWarning = () => {
    if (spec.panels_per_string > invPPSLimit[1]) {
      return <Text type='warning'>{t('project.spec.error.over-max')}</Text>
    } else if (spec.panels_per_string < invPPSLimit[0]) {
      return <Text type='warning'>{t('project.spec.error.under-min')}</Text>
    }
    return null
  }
  // 比较spi与SPI区间，生成警告文本
  const checkSpiWarning = () => {
    if (spec.string_per_inverter > invSPILimit[1]) {
      return <Text type='warning'>{t('project.spec.error.over-max')}</Text>
    } else if (spec.string_per_inverter < invSPILimit[0]) {
      return <Text type='warning'>{t('project.spec.error.under-min')}</Text>
    }
    return checkPpsWarning()
  }
  // 如果所有逆变器vac不统一，生成警告文本
  const checkVacWarning = () =>
    projectType === 'domestic' && allVac.size > 1 ? (
      <Text type='warning'>{t('project.spec.inverter.vac-warning')}</Text>
    ) : null

  // initInvLimits准备好后计算SPI区间和PPS区间
  useEffect(() => {
    setinvSPILimit(genSPILimits(initInvLimits, spec.panels_per_string))
    setinvPPSLimit(genPPSLimits(initInvLimits))
  }, [initInvLimits, spec.panels_per_string])

  return (
    <Descriptions column={2}>
      <Item label={t('project.spec.serial')} span={1}>
        <Text style={{ color: '#faad14' }}>{`S${specIndex + 1}-${
          spec.inverter_serial_number
        }`}</Text>
      </Item>
      <Item label={t('project.spec.inverter')} span={1}>
        <Space>
          {selInv.name} {checkVacWarning()}
        </Space>
      </Item>
      <Item label={t('project.spec.panels_per_string')} span={1}>
        <Space>
          {spec.panels_per_string} {checkPpsWarning()}
        </Space>
      </Item>
      <Item label={t('project.spec.string_per_inverter')} span={1}>
        <Space>
          {spec.string_per_inverter} {checkSpiWarning()}
        </Space>
      </Item>
      <Item label={t('project.spec.ac_cable_len')} span={1}>
        {spec.ac_cable_len ? m2other(unit, spec.ac_cable_len).toFixed(2) : null} {unit}
      </Item>
      <Item label={t('project.spec.total_panels')} span={1}>
        {spec.string_per_inverter * spec.panels_per_string}
      </Item>
      <Item
        label={`${t('project.spec.dcoveracratio-actual')} / ${t('project.spec.dcoveracratio-max')}`}
        span={2}
      >
        {(
          (selPV.pmax * spec.panels_per_string * spec.string_per_inverter) /
          selInv.paco_sandia
        ).toFixed(2)}{' '}
        /{(selInv.pdcMax_sandia / selInv.paco_sandia).toFixed(2)}
      </Item>
      <Item label={t('project.spec.dc_cable_len')} span={2}>
        {spec.dc_cable_len
          ? spec.dc_cable_len.map(v => `${m2other(unit, Number(v)).toFixed(2)} ${unit}`).join(', ')
          : null}
      </Item>
    </Descriptions>
  )
}
