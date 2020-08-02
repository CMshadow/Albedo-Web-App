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

  // 制造以月为单位的数据
  const monthlyData = Array(12).fill([]).map(ary => ([]))
  reportData[buildingID].sunPosition.forEach((monthData, monthIndex) =>
    monthData[0].forEach((sunAz, hourIndex) =>
      monthlyData[monthIndex].push([sunAz, monthData[1][hourIndex]])
    )
  )

  // 制造以小时为单位的数据
  const hourlyData = Array(monthlyData[0].length).fill([]).map(ary => ([]))
  reportData[buildingID].sunPosition.forEach((monthData, monthIndex) =>
    monthData[0].forEach((sunAz, hourIndex) =>
      (hourlyData[hourIndex].push([sunAz, monthData[1][hourIndex]]))
    )
  )
  // 小时数据再补一次首月数据让数据闭环
  hourlyData.forEach(hourData => hourData.push(hourData[0]))

  // 图标配置项
  const option = {
    tooltip: {
      show: false,
      trigger: 'axis',
      axisPointer: {type: 'cross'}
    },
    axisPointer: {
      link: {xAxisIndex: 'all'},
      label: {backgroundColor: '#595959'}
    },
    xAxis: {
      type: 'value',
      name: t('sunPosition.sunAzi'),
      nameLocation: 'center',
      nameTextStyle: titleStyle,
      nameGap: 25,
      min: value => value.min - 10,
      max: value => value.max + 10,
      splitNumber: 10,
      splitLine: {show: false},
      axisLine: {show: false},
      axisTick: {show: false},
      axisLabel: {
        showMinLabel: false,
        showMaxLabel: false,
        formatter: '{value}°'
      },
      axisPointer: {
        show: true,
        lineStyle: {
          width: 2,
          type: 'dashed',
          color: '#bfbfbf'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: t('sunPosition.sunElev'),
      nameLocation: 'center',
      nameTextStyle: titleStyle,
      nameGap: 35,
      min: 0,
      max: 90,
      splitNumber: 10,
      axisLine: {show: false},
      axisTick: {show: false},
      axisLabel: {formatter: '{value}°'},
      axisPointer: {
        show: true,
        lineStyle: {
          width: 2,
          type: 'dashed',
          color: '#bfbfbf'
        }
      }
    },
    series: [
      // 月单位数据
      ...monthlyData.map((monthData, monthIndex) => {
        const setup =  {
          data: monthData,
          smooth: true,
          type: 'line',
          lineStyle: {color: '#1890ff'},
          symbol: 'none'
        }
        // 仅这些月份有线上标识
        if ([12, 1, 2, 3, 4, 5, 6].includes(monthIndex + 1)) {
          const maxY = monthData.reduce((max, val) => val[1] > max ? val[1] : max, 0)
          const text = [12, 6].includes(monthIndex + 1) ?
            `${t(`sunPosition.month.${monthIndex + 1}`)} ${t('sunPosition.day.21')}` :
            `${t(`sunPosition.month.${monthIndex + 1}`)}/${t(`sunPosition.month.${12 - (monthIndex + 1)}`)} ${t('sunPosition.day.21')}`
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
                color: '#5b8c00',
                backgroundColor: 'rgba(255, 255, 255, 0.3)'
              }
            }]
          }
        }
        return setup
      }),
      // 小时单位数据
      ...hourlyData.map((hourData, hourIndex) => {
        const allZero = hourData.every(pair => pair[1] === 0)
        const maxY = hourData.reduce((max, val) => val[1] > max ? val[1] : max, 0)
        const x = hourData.find(pair => pair[1] === maxY)[0]
        const setup = {
          data: hourData,
          smooth: true,
          type: 'line',
          lineStyle: {color: '#fa8c16', width: 3},
          symbolSize: 5,
          itemStyle: {color: '#fa8c16'}
        }
        // 不同月份标识位置不同
        const position = [0, 1, 2, 3, 4, 5, 6].includes(hourIndex) ? 'left' :
          [10, 11, 12, 13, 14, 15, 16].includes(hourIndex) ? 'right' : 'top'
        // 数据不全为0时渲染标识
        if (!allZero) {
          setup.markPoint = {
            data: [{
              symbol: 'rect',
              symbolSize: 1,
              coord: [x, maxY],
              value: t(`sunPosition.hour.${hourIndex}`),
              name: t(`sunPosition.hour.${hourIndex}`),
              label: {
                position: position,
                offset: [0, -10],
                fontSize: 14,
                color: '#c41d7f',
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
          {t('sunPosition.title')}
        </Title>
      }
      hoverable
    >
      <ReactEcharts option={option} style={{height: '600px', width: '100%'}}/>
    </Card>
  )
}
