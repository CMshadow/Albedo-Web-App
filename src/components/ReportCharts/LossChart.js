import React from "react";
import {Chart, Interval, Axis, Annotation, Coordinate} from "bizcharts";
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import { fontFamily } from '../../global.config'

export const LossChart = ({buildingID}) => {
  const {t} = useTranslation()
  const reportData = useSelector(state => state.report)
  const projectData = useSelector(state => state.project)
  const buildingReport = reportData[buildingID]

  const colorMap = {
    irr: 0,
    dc: 1,
    ac: 2,
    loss: 3
  }

  const keys = [
    ['opt_irr', 'irr'], ['p_loss_tilt_azimuth', 'irr'],
    ['p_loss_soiling', 'irr'], ['p_loss_eff_irradiance', 'irr'],
    ['p_loss_temperature', 'dc'], ['p_loss_degradation', 'dc'],
    ['p_loss_degradation_rest', 'dc'], ['p_loss_connection', 'dc'],
    ['p_loss_mismatch', 'dc'], ['p_loss_dc_wiring', 'dc'],
    ['p_loss_conversion', 'ac'], ['p_loss_ac_wiring', 'ac'],
    ['p_loss_combibox_wiring', 'ac'], ['transformer_efficiency', 'ac']
  ]
  let systemStatus = 100
  const dataSource = []
  keys.forEach(([key, cat]) => {
    systemStatus = systemStatus - buildingReport[key] * 100 ||
      systemStatus - (100 - projectData[key]) || systemStatus

    dataSource.push({
      cat: t(`lossChart.${cat}`),
      value: buildingReport[key] * 100 || (100 - projectData[key]) || 0,
      stage: 'loss',
      type: t(`lossChart.${key}`),
      color: colorMap.loss
    })
    dataSource.push({
      cat: t(`lossChart.${cat}`),
      value: systemStatus,
      stage: 'new',
      type: t(`lossChart.${key}`),
      color: colorMap[cat]
    })
  })

  const scale = {
    value: {
      min: 0,
      max: 125
    }
  }

  const label = ['value', {
    style: {
      fill: '#000',
      fontWeight: 'bold',
      fontSize: 12,
      fontFamily: fontFamily
    },
    offset: 10,
    content: originData => {
      if (originData.type === t(`lossChart.opt_irr`) && originData.stage === 'loss') return originData.type
      else if (originData.stage === 'new') return null
      else return `-${originData.value.toFixed(2)}% ${originData.type}`
    },
  }]

  const adjust = [{
    type: 'stack',
    reverseOrder:true
  }]

  const color = ['color', val => {
    switch (val) {
      case 0:
        return '#1890ff'
      case 1:
        return '#faad14'
      case 2:
        return '#bae637'
      default:
        return '#d9d9d9'
    }
  }]

  return (
    <Chart pure scale={scale} height={500} data={dataSource.reverse()} autoFit padding={[0, 20, 0, 100]}>
      <Coordinate transpose/>
      <Axis name='type' label={null} tickLine={null} line={false}/>
      <Axis name='value' label={null} grid={null}/>
      <Interval
        type="interval"
        position="type*value"
        size={20}
        adjust={adjust}
        label={label}
        color={color}
      />
      <Annotation.Text
        top
        position={[t('lossChart.p_loss_ac_wiring'), 0]}
        content={t('lossChart.ac')}
        style={{
          fill: '#000000',
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: fontFamily
        }}
        offsetX={-40}
        offsetY={20}
      />
      <Annotation.Text
        top
        position={[t('lossChart.p_loss_degradation_rest'), 0]}
        content={t('lossChart.dc')}
        style={{
          fill: '#000000',
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: fontFamily
        }}
        offsetX={-40}
        offsetY={20}
      />
      <Annotation.Text
        top
        position={[t('lossChart.p_loss_tilt_azimuth'), 0]}
        content={t('lossChart.irr')}
        style={{
          fill: '#000000',
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          fontFamily: fontFamily
        }}
        offsetX={-40}
        offsetY={20}
      />
      <Annotation.Line
        top
        start={['-9%', "28.5%"]}
        end={['100%', "28.5%"]}
        style={{
          stroke: '#595959',
          lineDash: [2, 2],
          strokeWidth: 5
        }}
      />
      <Annotation.Line
        top
        start={['-9%', "71.5%"]}
        end={['100%', "71.5%"]}
        style={{
          stroke: '#595959',
          lineDash: [2, 2],
          strokeWidth: 5
        }}
      />
    </Chart>
  );
}
