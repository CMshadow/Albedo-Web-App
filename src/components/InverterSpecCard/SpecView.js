import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { Descriptions, Typography, Space } from 'antd'
import { useSelector } from 'react-redux'
import { m2other } from '../../utils/unitConverter'
const Item = Descriptions.Item
const Text = Typography.Text

export const SpecView = ({buildingID, specIndex, invIndex, initInvLimits}) => {
  const { t } = useTranslation()
  const [invSPILimit, setinvSPILimit] = useState([-Infinity, Infinity])
  const [invPPSLimit, setinvPPSLimit] = useState([-Infinity, Infinity])
  const unit = useSelector(state => state.unit.unit)
  const buildings = useSelector(state => state.project.buildings)
  const inverterData = useSelector(state => state.inverter.data).concat(
    useSelector(state => state.inverter.officialData)
  )

  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const spec = buildings[buildingIndex].data[specIndex].inverter_wiring[invIndex]
  const selInv = inverterData.find(inv =>
    inv.inverterID === spec.inverter_model.inverterID
  )

  // 所有使用的逆变器的vac
  const allVac = new Set(buildings.flatMap(building => 
    building.data.flatMap(spec => 
      spec.inverter_wiring.map(inverterSpec => 
        inverterSpec.inverter_model.inverterID ?
        inverterData.find(obj => 
          obj.inverterID === inverterSpec.inverter_model.inverterID
        ).vac :
        null
      ).filter(elem => elem !== null)
    )
  ))
  
  // 根据给定的逆变器接线可选方案，生成SPI区间
  const genSPILimits = (invLimits) => {
    const minSPI = Object.keys(invLimits).reduce((minSPI, val) => 
      val < minSPI ? val : minSPI, Infinity
    )
    const maxSPI = Object.keys(invLimits).reduce((maxSPI, val) => 
      val > maxSPI ? val : maxSPI, -Infinity
    )
    return [minSPI, maxSPI]
  }

  // 根据给定的逆变器接线可选方案，和可给定的SPI,生成PPS区间
  const genPPSLimits = (invLimits, spi=0) => {
    if (spi in invLimits) {
      const minPPS = invLimits[spi].reduce((minPPS, val) => 
        val < minPPS ? val : minPPS, Infinity
      )
      const maxPPS = invLimits[spi].reduce((maxPPS, val) => 
        val > maxPPS ? val : maxPPS, -Infinity
      )
      return [minPPS, maxPPS]
    } else {
      const minPPS = Object.keys(invLimits).reduce((minPPS, spi) => {
        const loclMinPPS = invLimits[spi].reduce((min, val) => 
          val < min ? val : min, Infinity
        )
        return loclMinPPS < minPPS ? loclMinPPS : minPPS
      }, Infinity)
      const maxPPS = Object.keys(invLimits).reduce((maxPPS, spi) => {
        const loclMaxPPS = invLimits[spi].reduce((max, val) => 
          val > max ? val : max, -Infinity
        )
        return loclMaxPPS > maxPPS ? loclMaxPPS : maxPPS
      }, -Infinity)
      return [minPPS, maxPPS]
    }
  }

  // 比较spi与SPI区间，生成警告文本
  const checkSpiWarning = () => {
    if (spec.string_per_inverter > invSPILimit[1]) {
      return <Text type='warning'>{t('project.spec.error.over-max')}</Text>
    } else if (spec.string_per_inverter < invSPILimit[0]) {
      return <Text type='warning'>{t('project.spec.error.under-min')}</Text>
    }
    return null
  }
  // 比较pps与PPS区间，生成警告文本
  const checkPpsWarning = () => {
    if (spec.panels_per_string > invPPSLimit[1]) {
      return <Text type='warning'>{t('project.spec.error.over-max')}</Text>
    } else if (spec.panels_per_string < invPPSLimit[0]) {
      return <Text type='warning'>{t('project.spec.error.under-min')}</Text>
    }
    return null
  }
  // 如果所有逆变器vac不统一，生成警告文本
  const checkVacWarning = () => allVac.size > 1 ? 
    <Text type='warning'>{t('project.spec.inverter.vac-warning')}</Text>: null

  // initInvLimits准备好后计算SPI区间和PPS区间
  useEffect(() => {
    setinvSPILimit(genSPILimits(initInvLimits))
    setinvPPSLimit(genPPSLimits(initInvLimits, spec.string_per_inverter))
  }, [initInvLimits, spec.string_per_inverter])

  return (
    <Descriptions column={{ xl: 2, xxl: 3}}>
      <Item label={t('project.spec.serial')} span={1}>
        <Text style={{color: '#faad14'}}>{spec.inverter_serial_number}</Text>
      </Item>
      <Item label={t('project.spec.inverter')} span={1}>
        <Space>{selInv.name} {checkVacWarning()}</Space>
      </Item>
      <Item label={t('project.spec.string_per_inverter')} span={1}>
        <Space>{spec.string_per_inverter} {checkSpiWarning()}</Space>
      </Item>
      <Item label={t('project.spec.panels_per_string')} span={1}>
        <Space>{spec.panels_per_string} {checkPpsWarning()}</Space>
      </Item>
      <Item label={t('project.spec.ac_cable_len')} span={1}>
        {m2other(unit, spec.ac_cable_len).toFixed(2)} {unit}
      </Item>
      <Item label={t('project.spec.total_panels')} span={1}>
        {spec.string_per_inverter * spec.panels_per_string}
      </Item>
      <Item label={t('project.spec.dc_cable_len')} span={3}>
        {spec.dc_cable_len.map(v => `${m2other(unit, Number(v)).toFixed(2)} ${unit}`).join(', ')}
      </Item>
    </Descriptions>
  )
}
