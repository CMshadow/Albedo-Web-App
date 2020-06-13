import React from "react";
import {Chart, Interval, Axis, Geom, Coordinate} from "bizcharts";
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'



export const LossChart = ({buildingID}) => {
  const {t} = useTranslation()
  const reportData = useSelector(state => state.report)
  const buildingReport = reportData[buildingID]

  const genDataSource = (systemStatus, keys) => {
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
    return dataSource
  }

  const irrKeys = [
    ['opt_irr', 'irr'],
    ['p_loss_tilt_azimuth', 'irr'], ['p_loss_soiling', 'irr'],
    ['p_loss_eff_irradiance', 'irr']
  ]
  const dcKeys = [
    ['opt_dc', 'dc'],
    ['p_loss_temperature', 'dc'], ['p_loss_degredation', 'dc'],
    ['p_loss_degredation_rest', 'dc'], ['p_loss_connection', 'dc'],
    ['p_loss_mismatch', 'dc'], ['p_loss_dc_wiring', 'dc']
  ]
  let systemStatus = 100
  const irrDataSource = genDataSource(systemStatus, irrKeys)
  const dcDataSource = genDataSource(systemStatus, dcKeys)

  const title = {
    style: {
      rotate: 90
    },
    offset: -10,
  }

  return (
    <>
      <Chart pure height={200} data={irrDataSource} autoFit>
        <Coordinate transpose/>
        <Axis name='cat' title={title} label={null} grid={null} tickLine={null} line={false}/>
        <Axis name='value' label={null} grid={null} tickLine={null} line={false}/>
        <Interval type="interval" position="cat*value" color='stage'
          style={{
            stroke: '#fff',
            lineWidth: 1
          }}
          adjust={[
            {
              type: 'dodge',
              dodgeBy: 'type', // 按照 type 字段进行分组
              marginRatio: 0, // 分组中各个柱子之间不留空隙
            }, {
              type: 'stack',
              dodgeBy: 'stage'
            }
          ]} />

      </Chart>
      <Chart pure height={400} data={dcDataSource} autoFit="autoFit">
        <Coordinate transpose/>
        <Geom type="interval" position="cat*value" color={'stage'}
          style={{
            stroke: '#fff',
            lineWidth: 1
          }}
          adjust={[
            {
              type: 'dodge',
              dodgeBy: 'type', // 按照 type 字段进行分组
              marginRatio: 0, // 分组中各个柱子之间不留空隙
            }, {
              type: 'stack',
              dodgeBy: 'stage'
            }
          ]}>
          </Geom>
      </Chart>
    </>
  );
}
