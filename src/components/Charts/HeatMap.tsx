import React from 'react'
import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactEcharts from 'echarts-for-react'
import 'echarts-gl'
import { RootState } from '../../@types'
import { EChartOption } from 'echarts'
const { Title } = Typography

export const HeatMap: React.FC = () => {
  const { t } = useTranslation()
  const projectData = useSelector((state: RootState) => state.project)
  const tiltAzimuthPOA = projectData?.tiltAzimuthPOA || [[0, 0, 0]]
  const poaMax = Math.max(...tiltAzimuthPOA.map(ary => ary[2]))
  const poaMin = Math.min(...tiltAzimuthPOA.map(ary => ary[2]))

  const option = {
    backgroundColor: '#fff',
    tooltip: {
      formatter: params => {
        const param = Array.isArray(params) ? params[0] : params
        return `
        ${param.marker}<br/>
        ${t('heatMap.tilt')}: ${(param.value as number[])[0]} °<br/>
        ${t('heatMap.azimuth')}: ${(param.value as number[])[1]} °<br/>
        ${t('heatMap.poa')}: ${((param.value as number[])[2] / 1000).toFixed(2)}  kWh/㎡<br/>
      `
      },
    },
    visualMap: [
      {
        show: true,
        dimension: 2,
        min: poaMin,
        max: poaMax,
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026',
          ],
        },
      },
    ],
    xAxis3D: {
      type: 'value',
      name: t('heatMap.tilt'),
      min: 0,
      max: 90,
      axisLabel: {
        formatter: (text: number) => `${text} °`,
      },
    },
    yAxis3D: {
      type: 'value',
      name: t('heatMap.azimuth'),
      min: 0,
      max: 360,
      axisLabel: {
        formatter: (text: number) => `${text} °`,
      },
    },
    zAxis3D: {
      type: 'value',
      name: t('heatMap.poa'),
      axisLabel: {
        formatter: (text: number) => `${(text / 1000).toFixed(2)} kWh/㎡`,
      },
    },
    grid3D: {
      viewControl: {
        rotateSensitivity: 2,
      },
    },
    series: [
      {
        type: 'scatter3D',
        data: tiltAzimuthPOA,
      },
    ],
  } as EChartOption

  return (
    <Card
      bodyStyle={{ padding: '50px' }}
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('heatMap.title')}
        </Title>
      }
      hoverable
      style={{ cursor: 'unset' }}
    >
      <ReactEcharts option={option} style={{ height: '800px', width: '100%' }} />
    </Card>
  )
}
