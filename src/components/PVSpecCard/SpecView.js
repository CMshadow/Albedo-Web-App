import React from 'react';
import { Descriptions } from 'antd'
import { useSelector } from 'react-redux'
const Item = Descriptions.Item

export const SpecView = ({buildingID, specIndex}) => {
  const buildings = useSelector(state =>
    state.project.buildings
  )
  const buildingIndex = buildings.map(building => building.buildingID)
    .indexOf(buildingID)
  const spec = buildings[buildingIndex].data[specIndex].pv_panel_parameters

  return (
    <Descriptions bordered title="Custom Size">
      <Item label="PV" span={3}>{spec.pvID}</Item>
      <Item label="tilt">{spec.tilt_angle}</Item>
      <Item label="azimuth">{spec.azimuth}</Item>
    </Descriptions>
  )
}
