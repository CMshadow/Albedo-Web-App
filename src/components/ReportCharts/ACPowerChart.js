import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Chart, Interval, Axis, Tooltip, Annotation } from 'bizcharts';

export const ACPowerChart = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = reportData[buildingID].month_AC_power.value.map((p, index) => ({
    month: t(`acPowerChart.month.${index + 1}`),
    value: p
  }))
  console.log(dataSource)

  const scale = {
    month: {
      type: 'cat',
      alias: t('acPowerChart.month'),
      tickCount: 12,
    },
    value: {
      alias: t('acPowerChart.production'),
      tickCount: 10,
      formatter: text => `${text.toFixed(2)} ${reportData[buildingID].month_AC_power.unit}`,
      nice: true
    },
  }

  return (
    <Chart
      scale={scale}
      height={400}
      autoFit data={dataSource}
      interactions={['active-region']}
      padding='auto'
    >
      <Axis name='month' title />
      <Axis name='value' title />
      <Interval color='#1890ff' position="month*value" />
      <Tooltip shared />
      <Annotation.Line top start={{month: "5月", value: 1498.53813321092}} end={{month: "12月", value: 2498.53813321092}} lineStyle={{
                stroke: '#999', // 线的颜色
                lineDash: [0, 2, 2], // 虚线的设置
                lineWidth: 10, // 线的宽度
              }}/>
    </Chart>
  )
}
