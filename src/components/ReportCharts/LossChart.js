import React from "react";
import {Chart, Interval, Axis, Geom, Coordinate} from "bizcharts";
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'


export const LossChart = ({buildingID}) => {
  const {t} = useTranslation()
  const reportData = useSelector(state => state.report)
  const buildingReport = reportData[buildingID]

  const keys = [
    ['opt_irr', 'irr'], ['p_loss_tilt_azimuth', 'irr'],
    ['p_loss_soiling', 'irr'], ['p_loss_eff_irradiance', 'irr'],
    ['p_loss_temperature', 'dc'], ['p_loss_degredation', 'dc'],
    ['p_loss_degredation_rest', 'dc'], ['p_loss_connection', 'dc'],
    ['p_loss_mismatch', 'dc'], ['p_loss_dc_wiring', 'dc'],
    ['p_loss_conversion', 'ac'], ['p_loss_ac_wiring', 'ac'],
    ['p_loss_combibox_wiring', 'ac']
  ]
  let systemStatus = 100
  const dataSource = []
  keys.forEach(([key, cat]) => {
    systemStatus = systemStatus - buildingReport[key] * 100 || systemStatus
    dataSource.splice(0, 0, {
      cat: cat,
      value: buildingReport[key] * 100 || 0,
      stage: 'loss',
      type: key
    })
    dataSource.splice(0, 0, {
      cat: cat,
      value: systemStatus,
      stage: 'new',
      type: key
    })
  })

  const scale = {
    value: {
      min: 0,
      max: 110
    }
  }

  return (
    <Chart scale={scale} height={200} data={dataSource} autoFit>
      <Coordinate transpose/>
      <Axis name='type' tickLine={null} line={false}/>
      <Axis name='value' label={null} grid={null}/>
      <Interval type="interval" position="type*value" color={['cat', ['#face1d', '#37c461']]} size={26}
        style={{
          stroke: '#fff',
          lineWidth: 1
        }}
        adjust={[{
          type: 'stack',
          dodgeBy: 'stage'
        }]}
        label={['value', {
          style: {
            fill: '#8d8d8d',
          },
          offset: 10,
        }]}
      />
    </Chart>
  );
}
