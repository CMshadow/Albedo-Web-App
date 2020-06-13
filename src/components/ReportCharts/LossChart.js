import React from "react";
import {Chart, Interval, Axis, Annotation, Coordinate} from "bizcharts";
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'


export const LossChart = ({buildingID}) => {
  const {t} = useTranslation()
  const reportData = useSelector(state => state.report)
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
    ['p_loss_combibox_wiring', 'ac']
  ]
  let systemStatus = 100
  const dataSource = []
  keys.forEach(([key, cat]) => {
    systemStatus = systemStatus - buildingReport[key] * 100 || systemStatus

    dataSource.push({
      cat: t(`lossChart.${cat}`),
      value: buildingReport[key] * 100 || 0,
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
  console.log(dataSource)

  const scale = {
    value: {
      min: 0,
      max: 120
    }
  }

  const label = ['value', {
    style: {
      fill: '#8d8d8d',
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
    <Chart pure scale={scale} height={500} data={dataSource.reverse()} autoFit padding={[0, 0, 0, 150]}>
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
          fontSize: 18,
          fontWeight: '300',
          textAlign: 'center',
        }}
        offsetX={-70}
      />
    </Chart>
  );
}
