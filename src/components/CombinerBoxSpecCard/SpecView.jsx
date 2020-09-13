import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { Descriptions, Typography, Space } from 'antd'
import { useSelector } from 'react-redux'
import { m2other } from '../../utils/unitConverter'
const Item = Descriptions.Item
const Text = Typography.Text

export const SpecView = ({buildingID, combiboxIndex, setediting, disabled}) => {
  const { t } = useTranslation()
  const unit = useSelector(state => state.unit.unit)
  const buildings = useSelector(state => state.project.buildings)
  const buildingIndex = buildings.map(building => building.buildingID).indexOf(buildingID)
  const combiboxData = buildings[buildingIndex].combibox[combiboxIndex]


  // initInvLimits准备好后计算SPI区间和PPS区间
  useEffect(() => {

  }, [])

  return (
    <Descriptions column={{ lg:2, xl: 3}}>
      <Item label={t('project.spec.combibox_name')} span={1}>
        {combiboxData.combibox_name}
      </Item>
      <Item label={t('project.spec.combibox_serial')} span={1}>
        {combiboxData.combibox_serial_num}
      </Item>
      <Item label={t('project.spec.combibox_cable_len')} span={1}>
        {combiboxData.combibox_cable_len} {unit}
      </Item>
      <Item label={t('project.spec.linked_inverter_serial_num')} span={3}>
        {combiboxData.linked_inverter_serial_num.join(', ')}
      </Item>
    </Descriptions>
  )
}
