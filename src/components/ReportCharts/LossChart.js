import React from "react";
import ReactEcharts from 'echarts-for-react';
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'


export const LossChart = ({buildingID}) => {
  const {t} = useTranslation()
  const reportData = useSelector(state => state.report)
  const buildingReport = reportData[buildingID]

  const irrKeys = [
    'opt_irr', 'p_loss_tilt_azimuth', 'p_loss_soiling', 'p_loss_eff_irradiance'
  ]
  const dcKeys = [
    'p_loss_temperature', 'p_loss_degradation', 'p_loss_degradation_rest',
    'p_loss_connection', 'p_loss_mismatch', 'p_loss_dc_wiring'
  ]
  const acKeys = [
    'p_loss_conversion', 'p_loss_ac_wiring', 'p_loss_combibox_wiring'
  ]

  const genColor = (record) => {
    if (record.seriesName === 'loss') return '#d9d9d9'
    else if (irrKeys.includes(record.name)) return '#1890ff'
    else if (dcKeys.includes(record.name)) return '#faad14'
    else return '#bae637'
  }

  const genLabel = (record) => {
    if (record.name === 'opt_irr') return t('lossChart.opt')
    else return `-${record.value.toFixed(2)}% ${t(`lossChart.${record.name}`)}`
  }

  let systemStatus = 100
  const series = [
    {
      name: 'new',
      type: 'bar',
      stack: '总量',
      data: [],
      markPoint: {
        data: [
          {name: '某个屏幕坐标', x: '10%', y: '15.38%'}
        ]
      },
      itemStyle: {
        normal: {
          color: record => genColor(record)
        }
      }
    }, {
      name: 'loss',
      type: 'bar',
      stack: '总量',
      label: {
          show: true,
          position: 'right',
          offset: [5, 0],
          color: '#000',
          fontWeight: 'bold',
          formatter: record => genLabel(record)
      },
      data: [],
      itemStyle: {
        normal: {
          color: record => genColor(record)
        }
      }
    }
  ]
  irrKeys.concat(dcKeys).concat(acKeys).forEach(key => {
    systemStatus = systemStatus - buildingReport[key] * 100 || systemStatus
    series[0].data.splice(0, 0, systemStatus)
    series[1].data.splice(0, 0, buildingReport[key] * 100 || 0)
  })
  console.log(series)

  const option = {
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'value',
      max: 130,
      show: false
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    yAxis: {
        type: 'category',
        data: irrKeys.concat(dcKeys).concat(acKeys).reverse(),
        show: false
    },
    series: series
};

  return (
    <ReactEcharts option={option} style={{height: 500, width: '100%'}} />
  );
}
