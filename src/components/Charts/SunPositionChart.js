import React, { useState } from 'react'
import { Card, Typography, Row, Space, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { titleStyle } from '../../styles/chartStyles'
import ReactEcharts from "echarts-for-react";
const { Title, Text } = Typography
const { Option } = Select;

export const SunPositionChart = ({buildingID}) => {
  const { t } = useTranslation()
  const projectData = useSelector(state => state.project)
  const reportData = useSelector(state => state.report)
  const [selSpecIndex, setselSpecIndex] = useState(0)
  const uniqueTiltAzimuth = buildingID === 'overview' ?
    projectData.buildings.flatMap(building => 
      building.data.flatMap(setup => ({
        tilt: setup.pv_panel_parameters.tilt_angle,
        azimuth: setup.pv_panel_parameters.azimuth,
      }))
    ) :
    projectData.buildings.find(building => building.buildingID === buildingID)
    .data.map(setup => ({
      tilt: setup.pv_panel_parameters.tilt_angle,
      azimuth: setup.pv_panel_parameters.azimuth,
    }))

  const stringifySetupMonthIrr = reportData[buildingID].setup_month_irr.map(JSON.stringify)
  const uniqueSetupMonthIrr = [...new Set(stringifySetupMonthIrr)].map(JSON.parse)
  const allSetup = uniqueSetupMonthIrr.map(setup => {
    const setupIndex = stringifySetupMonthIrr.indexOf(JSON.stringify(setup))
    return (
      <Space>
        {`${t('irrTable.tilt')}: ${uniqueTiltAzimuth[setupIndex].tilt}°`}
        {`${t('irrTable.azimuth')}: ${uniqueTiltAzimuth[setupIndex].azimuth}°`}
      </Space>
    )
  })

  let behindPVData = reportData[buildingID].setup_behindPV ?
    reportData[buildingID].setup_behindPV.map(setupBehindPVData =>
      setupBehindPVData.map((val, index) => [index, val])
    ) : null

  let horizonData = projectData.horizonData ? 
  [[0, projectData.horizonData.slice(-1)[0][1]], ...JSON.parse(JSON.stringify(projectData.horizonData))] : null

  // 是否北半球
  const northHemisphere = projectData.projectLat > 0
  // 南北半球不同配置
  const coordX = northHemisphere ? 180 : 0
  const labelPosition = (monthIndex) => {
    if (northHemisphere) {
      return [1, 2, 6].includes(monthIndex) ? 'top' : 'bottom'
    } else {
      return [0, 4, 5].includes(monthIndex) ? 'top' : 'bottom'
    }
  }
  const markPointLabel = (hourIndex) => {
    if (northHemisphere) {
      return [0, 1, 2, 3, 4, 5, 6].includes(hourIndex) ? 'left' :
        [10, 11, 12, 13, 14, 15, 16].includes(hourIndex) ? 'right' : 'top'
    } else {
      return [0, 1, 2, 3, 4, 5, 6].includes(hourIndex) ? 'right' :
        [10, 11, 12, 13, 14, 15, 16].includes(hourIndex) ? 'left' : 'top'
    }
  }


  // 制造以月为单位的数据
  let monthlyData = Array(12).fill([]).map(ary => ([]))
  reportData[buildingID].sunPosition.forEach((monthData, monthIndex) =>
    monthData[0].forEach((sunAz, hourIndex) =>
      monthlyData[monthIndex].push([sunAz, monthData[1][hourIndex]])
    )
  )
  // 南半球需要将数据映射到-180°到180°范围
  if (!northHemisphere) {
    // 映射每月数据
    monthlyData = monthlyData.map(monthData => {
      const firstHalf = monthData.slice(0, monthData.indexOf(monthData.find(val => val[0] > 180)))
      const secondHalf = monthData.slice(monthData.indexOf(monthData.find(val => val[0] > 180)), )
      secondHalf.forEach(val => val[0] = -(360 - val[0]))
      return secondHalf.reverse().concat(firstHalf.reverse())
    })
    // 映射在板背后数据
    behindPVData = behindPVData.map(behindPV => {
      const firstHalf = behindPV.slice(0, behindPV.indexOf(behindPV.find(val => val[0] > 180)))
      const secondHalf = behindPV.slice(behindPV.indexOf(behindPV.find(val => val[0] > 180)), )
      secondHalf.forEach(val => val[0] = -(360 - val[0]))
      return secondHalf.concat(firstHalf)
    })
    // 映射地平线数据
    const firstHalf = horizonData.slice(0, horizonData.indexOf(horizonData.find(val => val[0] > 180)))
    const secondHalf = horizonData.slice(horizonData.indexOf(horizonData.find(val => val[0] > 180)), )
    secondHalf.forEach(val => val[0] = -(360 - val[0]))
    horizonData = secondHalf.concat(firstHalf)
  }

  // 制造以小时为单位的数据
  let hourlyData = Array(monthlyData[0].length).fill([]).map(ary => ([]))
  monthlyData.forEach((monthData, monthIndex) =>
    monthData.forEach((pair, hourIndex) =>
      hourlyData[hourIndex].push(pair)
    )
  )
  // 小时数据再补一次首月数据让数据闭环
  hourlyData.forEach(hourData => hourData.push(hourData[0]))
  // 南半球需要反转小时数据
  if (!northHemisphere) hourlyData = hourlyData.reverse()

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
      ...monthlyData.slice(-1).concat(monthlyData.slice(0, 6)).map((monthData, monthIndex) => {
        const setup =  {
          data: monthData,
          smooth: true,
          type: 'line',
          lineStyle: {color: '#1890ff'},
          symbol: 'none'
        }

        const maxY = monthData.reduce((max, val) => val[1] > max ? val[1] : max, 0)
        const text = monthIndex === 0 ?
          `${t(`sunPosition.month.${12}`)} ${t('sunPosition.day.21')}` :
          monthIndex === 6 ?
          `${t(`sunPosition.month.${6}`)} ${t('sunPosition.day.21')}` :
          `${t(`sunPosition.month.${monthIndex}`)}/${t(`sunPosition.month.${12 - monthIndex}`)} ${t('sunPosition.day.21')}`
        setup.markPoint = {
          data: [{
            symbol: 'rect',
            symbolSize: 1,
            coord: [coordX, maxY],
            value: text,
            name: text,
            label: {
              position: labelPosition(monthIndex),
              fontSize: 14,
              color: '#5b8c00',
              backgroundColor: 'rgba(255, 255, 255, 0.3)'
            }
          }]
        }

        return setup
      }),
      // 小时单位数据
      ...hourlyData.map((hourData, hourIndex) => {
        const maxY = hourData.reduce((max, val) => val[1] > max ? val[1] : max, -Infinity)
        const x = hourData.find(pair => pair[1] === maxY)[0]
        const setup = {
          data: hourData,
          smooth: true,
          type: 'line',
          lineStyle: {color: '#fa8c16', width: 3},
          symbolSize: 5,
          itemStyle: {color: '#fa8c16'}
        }
        setup.markPoint = {
          data: [{
            symbol: 'rect',
            symbolSize: 1,
            coord: [x, maxY],
            value: t(`sunPosition.hour.${hourIndex}`),
            name: t(`sunPosition.hour.${hourIndex}`),
            label: {
              position: markPointLabel(hourIndex),
              offset: [0, -20],
              fontSize: 14,
              color: '#c41d7f',
            }
          }]
        }
        return setup
      })
    ]
  }

  // 3.1.0中新增
  // 地平线数据
  if (horizonData) {
    option.series.push({
      data: horizonData,
      smooth: true,
      type: 'line',
      lineStyle: {color: '#8c8c8c', width: 2},
      symbolSize: 0,
      markPoint: {
        data: [{
          symbol: 'rect',
          symbolSize: 1,
          coord: horizonData[2],
          value: t('sunPosition.horizon'),
          name: t('sunPosition.horizon'),
          label: {
            position: 'top',
            offset: [0, -10],
            fontSize: 14,
            color: '#595959',
          }
        }]
      }
    })
  }
  

  // 3.1.0中新增
  // 哪些角度太阳在板正面
  if (behindPVData) {
    option.series.push({
      data: behindPVData[selSpecIndex],
      smooth: true,
      type: 'line',
      lineStyle: {color: '#13c2c2', width: 2},
      symbolSize: 0,
      markPoint: {
        data: [{
          symbol: 'rect',
          symbolSize: 1,
          coord: behindPVData[selSpecIndex][20],
          value: t('sunPosition.behindPV'),
          name: t('sunPosition.behindPV'),
          label: {
            position: 'top',
            offset: [0, 30],
            fontSize: 14,
            color: '#006d75',
          }
        }]
      }
    })
  }

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('sunPosition.title')}
        </Title>
      }
      hoverable
      style={{cursor: 'unset'}}
    >
      <Row justify='center'>
        <Space>
          <Text strong>{t('irrChart.selectspec')}</Text>
          <Select defaultValue={selSpecIndex} onChange={val => setselSpecIndex(val)}>
            {
              allSetup.map((spec, index) => <Option key={index} value={index}>{spec}</Option>)
            }
          </Select>
        </Space>
      </Row>
      <ReactEcharts option={option} style={{height: '600px', width: '100%'}}/>
    </Card>
  )
}
