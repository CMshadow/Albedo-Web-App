import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Chart, Interval, Axis, Tooltip } from 'bizcharts';
import { createDateSource } from '../../utils/createGainData'
import { money2Other } from '../../utils/unitConverter'

export const CashFlowChart = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = createDateSource(reportData[buildingID]).map((record, index) => ({
    year: index,
    value: record['acc-net-cash-flow-togrid'],
    type: t('cashflowChart.togrid')
  })).concat(
    createDateSource(reportData[buildingID]).map((record, index) => ({
      year: index,
      value: record['acc-net-cash-flow-selfuse'],
      type: t('cashflowChart.selfuse')
    }))
  )

  const scale = {
    year: {
      type: 'cat',
      alias: t('cashflowChart.year'),
      tickCount: 25,
    },
    value: {
      type: 'linear',
      alias: t('cashflowChart.gain'),
      tickCount: 10,
      nice: true,
      formatter: text => {
        const newVal = money2Other(text)
        return `${newVal.value.toFixed(2)}${t(`money.${newVal.unit}`)}`
      }
    },
  }

  const adjust = [{
    type: 'dodge',
    marginRatio: 0,
  }]

  const color = ['type', ['#1890ff', '#faad14']]

  return (
    <Chart
      scale={scale}
      height={400}
      autoFit data={dataSource}
      interactions={['active-region']}
      padding='auto'
    >
      <Axis name='year' title />
      <Axis name='value' title />
      <Interval adjust={adjust} color={color} position="year*value" />
      <Tooltip shared />
    </Chart>
  )
}
