import React from 'react'
import { Divider } from 'antd'
import { useTranslation } from 'react-i18next'
import { titleStyle } from '../../styles/chartStyles'
import ReactEcharts from 'echarts-for-react'
import { EChartOption } from 'echarts'

type HorizonChartProps = { data: [number, number][] }

export const HorizonChart: React.FC<HorizonChartProps> = ({ data }) => {
  const { t } = useTranslation()

  const symbolSize = 20

  const option: EChartOption = {
    tooltip: {
      triggerOn: 'none',
      position: 'left',
      formatter: params => {
        const param = Array.isArray(params) ? params[0] : params
        return (
          `${t('horizonChart.azi')}: ` +
          param.data[0].toFixed(2) +
          `<br/>${t('horizonChart.elev')}: ` +
          param.data[1].toFixed(2)
        )
      },
    },
    grid: {},
    xAxis: {
      name: t('horizonChart.azi'),
      nameLocation: 'center',
      nameTextStyle: titleStyle,
      nameGap: 25,
      min: 0,
      max: 360,
      splitNumber: 12,
      type: 'value',
      axisLine: { onZero: false },
      axisLabel: { formatter: '{value}°' },
      splitLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      name: t('horizonChart.elev'),
      nameLocation: 'center',
      nameTextStyle: titleStyle,
      nameGap: 35,
      min: 0,
      max: 90,
      splitNumber: 10,
      type: 'value',
      axisLine: { onZero: false, show: false },
      axisLabel: { formatter: '{value}°' },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbolSize: symbolSize,
        data: data,
        lineStyle: { color: '#1890ff' },
        itemStyle: { color: '#1890ff' },
      },
    ],
  }

  return (
    <>
      <Divider style={{ marginBottom: 0 }}>{t('horizonChart.title')}</Divider>
      <ReactEcharts
        option={option}
        style={{ height: '600px', width: '100%' }}
        onChartReady={instance =>
          instance.setOption({
            graphic: data.map((item, index) => ({
              type: 'circle',
              shape: {
                r: symbolSize / 2,
              },
              position: instance.convertToPixel('grid', item),
              draggable: true,
              invisible: true,
              z: 100,
              ondrag: (e: { target: { position: [number, number] } }) => {
                data[index] = [
                  data[index][0],
                  instance.convertFromPixel('grid', e.target.position)[1] > 90
                    ? 90
                    : instance.convertFromPixel('grid', e.target.position)[1] < 0
                    ? 0
                    : instance.convertFromPixel('grid', e.target.position)[1],
                ]
                instance.setOption({
                  series: [{ data: data }],
                  graphic: data.map(item => ({
                    position: instance.convertToPixel('grid', item),
                  })),
                })
                instance.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: index })
              },
              onmousemove: () =>
                instance.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: index }),
              onmouseout: () => instance.dispatchAction({ type: 'hideTip' }),
            })),
          })
        }
      />
    </>
  )
}
