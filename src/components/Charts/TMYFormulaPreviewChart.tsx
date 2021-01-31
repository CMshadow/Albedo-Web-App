import React from 'react'
import ReactEcharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import { EChartOption } from 'echarts'
import { ScaleOption } from 'bizcharts/lib/interface'
import { titleStyle } from '../../styles/chartStyles'
import { wh2kwh } from '../../utils/unitConverter'

type TMYFormulaPreviewChartProps = {
  dataSource: { userGHI: number; refGHI: number }[]
  coeff: [number, number]
  r: number
}

export const TMYFormulaPreviewChart: React.FC<TMYFormulaPreviewChartProps> = props => {
  const { t } = useTranslation()
  const minX = props.dataSource.reduce(
    (min: number, val) => (val.refGHI < min ? val.refGHI : min),
    Infinity
  )
  const maxX = props.dataSource.reduce(
    (max: number, val) => (val.refGHI > max ? val.refGHI : max),
    -Infinity
  )

  const option: EChartOption = {
    tooltip: {
      show: false,
    },
    grid: {
      left: '15%',
      right: '5%',
      top: 10,
    },
    xAxis: {
      type: 'value',
      name: t('IntermediaChart.refGHI'),
      nameLocation: 'center',
      nameTextStyle: { ...titleStyle, color: '#000' },
      splitNumber: 8,
      nameGap: 30,
      scale: true,
      axisLine: { show: false, lineStyle: { color: '#8c8c8c' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        showMinLabel: false,
        showMaxLabel: false,
        formatter: (val: number) => `${Number(wh2kwh(val).toString()).toFixed(2)} kWh/㎡`,
      },
    },
    yAxis: {
      type: 'value',
      name: t('IntermediaChart.userGHI'),
      nameLocation: 'center',
      nameTextStyle: { ...titleStyle, color: '#000' },
      splitNumber: 8,
      nameGap: 90,
      scale: true,
      axisLine: { show: false, lineStyle: { color: '#8c8c8c' } },
      axisTick: { show: false },
      splitLine: { lineStyle: { type: 'solid', color: '#f0f0f0' } },
      axisLabel: {
        formatter: (val: number) => `${Number(wh2kwh(val).toString()).toFixed(2)} kWh/㎡`,
      },
    },
    series: [
      {
        name: 'line',
        type: 'line',
        symbol: 'none',
        lineStyle: { color: '#E9AF34', width: 4 },
        zlevel: 1,
        data: [
          [minX, props.coeff[0] * minX + props.coeff[1]],
          [maxX, props.coeff[0] * maxX + props.coeff[1]],
        ],
        markPoint: {
          label: {
            formatter: () =>
              `y = ${props.coeff[0].toFixed(2)} * x + ${props.coeff[1].toFixed(
                2
              )}\nR = ${props.r.toFixed(2)}`,
            fontSize: 14,
            color: '#595959',
            backgroundColor: '#ffffff',
            shadowColor: '#59595920',
            shadowBlur: 10,
            padding: 20,
            align: 'left',
            lineHeight: 30,
          },
          symbolSize: [200, 50],
          itemStyle: {
            color: 'transparent',
          },
          data: [
            {
              symbol: 'rect',
              x: '20%',
              y: '20%',
            },
          ] as any,
        },
      },
      {
        name: 'scatter',
        type: 'scatter',
        symbol: 'roundRect',
        itemStyle: { color: '#1890ff' },
        zlevel: 0,
        data: props.dataSource.map(entry => [entry.refGHI, entry.userGHI]),
      },
    ],
  }

  return <ReactEcharts option={option} style={{ height: '500px', width: '100%' }} />
}
