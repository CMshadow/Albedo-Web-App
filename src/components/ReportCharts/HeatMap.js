import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactEcharts from "echarts-for-react";
import 'echarts-gl'

export const HeatMap = ({buildingID}) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const poaMax = Math.max(...projectData.tiltAzimuthPOA.map(ary => ary[2]))
  const poaMin = Math.min(...projectData.tiltAzimuthPOA.map(ary => ary[2]))

  const option = {
    backgroundColor: '#fff',
    tooltip: {
      formatter: (a,b,c,d) => `
        ${a.marker}<br/>
        ${t('heatMap.tilt')}: ${a.value[0]} °<br/>
        ${t('heatMap.azimuth')}: ${a.value[1]} °<br/>
        ${t('heatMap.poa')}: ${(a.value[2]/1000).toFixed(2)}  kWh/㎡<br/>
      `
    },
    visualMap: {
      show: true,
      dimension: 2,
      min: poaMin,
      max: poaMax,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    xAxis3D: {
      type: 'value',
      name: t('heatMap.tilt'),
      min: 0,
      max: 90,
      axisLabel: {
        formatter: text => `${text} °`
      }
    },
    yAxis3D: {
      type: 'value',
      name: t('heatMap.azimuth'),
      min: 0,
      max: 360,
      axisLabel: {
        formatter: text => `${text} °`
      }
    },
    zAxis3D: {
      type: 'value',
      name: t('heatMap.poa'),
      axisLabel: {
        formatter: text => `${(text/1000).toFixed(2)} kWh/㎡`
      }
    },
    grid3D: {
      viewControl: {
        rotateSensitivity: 2
      }
    },
    series: [{
      type: 'scatter3D',
      data: projectData.tiltAzimuthPOA
    }]
}

  return (
    <ReactEcharts option={option} style={{height: '800px', width: '100%'}}/>
  )
}