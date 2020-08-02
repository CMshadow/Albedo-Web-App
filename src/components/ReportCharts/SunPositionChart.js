import React from 'react'
import { Card, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { titleStyle } from '../../styles.config'
import ReactEcharts from "echarts-for-react";
const Title = Typography.Title

export const SunPositionChart = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const monthlyData = Array(12).fill([]).map(ary => ([]))
  reportData[buildingID].sunPosition.forEach((monthData, monthIndex) =>
    monthData[0].forEach((sunAz, hourIndex) =>
      monthlyData[monthIndex].push([sunAz, monthData[1][hourIndex]])
    )
  )

  const hourlyData = Array(monthlyData[0].length).fill([]).map(ary => ([]))
  reportData[buildingID].sunPosition.forEach((monthData, monthIndex) =>
    monthData[0].forEach((sunAz, hourIndex) =>
      (hourlyData[hourIndex].push([sunAz, monthData[1][hourIndex]]))
    )
  )

  const option = {
    xAxis: {
      type: 'value',
      name: 'Azimuth',
      nameLocation: 'center',
      nameTextStyle: titleStyle,
      nameGap: 25,
      min: value => value.min - 10,
      max: value => value.max + 10,
      splitNumber: 10,
      splitLine: {show: false}
    },
    yAxis: {
      type: 'value',
      name: 'El',
      nameLocation: 'center',
      nameTextStyle: titleStyle,
      nameGap: 25,
      min: 0,
      max: 90,
      splitNumber: 10
    },
    series: [
      ...monthlyData.map((monthData, monthIndex) => {
        const setup =  {
          data: monthData,
          smooth: true,
          type: 'line',
          lineStyle: {color: '#1890ff'},
        }
        if ([12, 1, 2, 3, 4, 5, 6].includes(monthIndex + 1)) {
          const maxY = monthData.reduce((max, val) => val[1] > max ? val[1] : max, 0)
          const text = [12, 6].includes(monthIndex + 1) ?
            t(`acPowerChart.month.${monthIndex + 1}`) :
            `${t(`acPowerChart.month.${monthIndex + 1}`)} & ${t(`acPowerChart.month.${12 - (monthIndex + 1)}`)}`
          setup.markPoint = {
            data: [{
              symbol: 'rect',
              symbolSize: 1,
              coord: [180, maxY],
              value: text,
              name: text,
              label: {
                position: [12, 4, 5, 6].includes(monthIndex + 1) ? 'bottom' : 'top',
                fontSize: 14,
                color: '#000',
              }
            }]
          }
        }
        return setup
      }),
      ...hourlyData.map((hourData, hourIndex) => {
        const allZero = hourData.every(pair => pair[1] === 0)
        const maxY = hourData.reduce((max, val) => val[1] > max ? val[1] : max, 0)
        const x = hourData.find(pair => pair[1] === maxY)[0]
        const setup = {
          data: hourData,
          smooth: true,
          type: 'line',
          lineStyle: {color: '#fa8c16', width: 3},
        }
        if (!allZero) {
          setup.markPoint = {
            data: [{
              symbol: 'rect',
              symbolSize: 1,
              coord: [x, maxY],
              value: t(`sunPosition.hour.${hourIndex}`),
              name: t(`sunPosition.hour.${hourIndex}`),
              label: {
                position: 'top',
                fontSize: 14,
                color: '#5b8c00',
              }
            }]
          }
        }
        return setup
      })
    ]
}

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('heatMap.title')}
        </Title>
      }
      hoverable
    >
      <ReactEcharts option={option} style={{height: '600px', width: '100%'}}/>
    </Card>
  )
}
