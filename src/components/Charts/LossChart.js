import React from "react";
import { Card, Typography } from 'antd'
import { Chart, Interval, Axis, Annotation, Coordinate } from "bizcharts";
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { titleStyle, lgTitleStyle } from '../../styles/chartStyles'
const Title = Typography.Title

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
    ['p_loss_far_side_shading', 'irr'],
    ['p_loss_soiling', 'irr'], ['p_loss_eff_irradiance', 'irr'],

    ['p_loss_temperature', 'dc'], ['p_loss_degradation', 'dc'],
    ['p_loss_degradation_rest', 'dc'], ['p_loss_connection', 'dc'],
    ['p_loss_mismatch_withinstring', 'dc'], ['p_loss_mismatch_betweenstrings', 'dc'], 
    ['p_loss_dc_wiring', 'dc'],

    ['p_loss_conversion', 'ac'], ['p_loss_ac_wiring', 'ac'],
    ['p_loss_combibox_wiring', 'ac'], ['p_loss_transformer', 'ac'],
    ['p_loss_transformer_wiring', 'ac'], ['p_loss_availability', 'ac']
  ]
  let systemStatus = 100
  const dataSource = []
  keys.forEach(([key, cat]) => {
    systemStatus = systemStatus - buildingReport[key] * 100 ||
      systemStatus - (100 - projectData[key]) || systemStatus
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

  const scale = {
    value: {
      min: 0,
      max: 130
    }
  }

  const label = ['value', {
    style: titleStyle,
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
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('lossChart.title')}
        </Title>
      }
      bodyStyle={{padding: 0}}
      hoverable
      style={{cursor: 'unset'}}
    >
      <Chart pure scale={scale} height={500} data={dataSource.reverse()} autoFit padding={[0, 30, 0, 80]}>
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
          style={lgTitleStyle}
          offsetX={-40}
          offsetY={40}
        />
        <Annotation.Text
          top
          position={[t('lossChart.p_loss_connection'), 0]}
          content={t('lossChart.dc')}
          style={lgTitleStyle}
          offsetX={-40}
          offsetY={0}
        />
        <Annotation.Text
          top
          position={[t('lossChart.p_loss_far_side_shading'), 0]}
          content={t('lossChart.irr')}
          style={lgTitleStyle}
          offsetX={-40}
          offsetY={0}
        />
        <Annotation.Line
          top
          start={['-9%', "27.75%"]}
          end={['100%', "27.75%"]}
          style={{
            stroke: '#595959',
            lineDash: [2, 2],
            strokeWidth: 5
          }}
        />
        <Annotation.Line
          top
          start={['-9%', "66.75%"]}
          end={['100%', "66.75%"]}
          style={{
            stroke: '#595959',
            lineDash: [2, 2],
            strokeWidth: 5
          }}
        />
      </Chart>
    </Card>
  );
}
