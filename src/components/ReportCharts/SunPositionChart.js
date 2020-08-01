import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Card, Typography } from 'antd'
import { Chart, Line, Axis, Legend, Point, Guide } from 'bizcharts';
import { titleStyle, legendStyle } from '../../styles.config'
const Title = Typography.Title

export const SunPositionChart = ({buildingID}) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = reportData[buildingID].sunPosition.flatMap((monthData, monthIndex) =>
    monthData[0].map((sunAz, hourIndex) => ({
      month: t(`acPowerChart.month.${monthIndex + 1}`),
      hour: hourIndex,
      azimuth: sunAz,
      el: monthData[1][hourIndex]
    }))
  )
  console.log(dataSource)

  const scale = {
    month: {
      type: 'cat',
      alias: t('acPowerChart.month'),
      tickCount: 12,
    },
    // value: {
    //   alias: t('acPowerChart.production'),
    //   tickCount: 10,
    //   formatter: text => `${text.toFixed(2)} ${reportData[buildingID].month_AC_power.unit}`,
    //   nice: true
    // },
  }

  return (
    <Card
      title={
        <Title style={{textAlign: 'center'}} level={4}>
          {t('acPowerChart.title')}
        </Title>
      }
      hoverable
    >
      <Chart
        // scale={scale}
        padding={[30, 30, 100, 100]}
        autoFit
        height={500}
        data={dataSource}
        interactions={['active-region']}
      >
        <Legend position='bottom' itemName={{style: legendStyle}} offsetY={-10}/>
        <Axis name='azimuth' title={{style: titleStyle}} />
        <Axis name='el' title={{style: titleStyle}} />
        <Line shape="smooth" position="azimuth*el" color='month' />
        <Point position="azimuth*el" color='month' />
        {/* <Guide>
          <Line
            // start={{
            //   "month": "acPowerChart.month.6",
            //   "hour": 12
            // }}
            // end={{
            //   "month": "acPowerChart.month.12",
            //   "hour": 12
            // }}
            // lineStyle={{
            //   "stroke": "red",
            //   "lineDash": [
            //     0,
            //     1,
            //     1
            //   ],
            //   "lineWidth": 1
            // }}
            // text={{
            //   "position": "start",
            //   "autoRotate": false,
            //   "style": {
            //     "fill": "red"
            //   },
            //   "offsetX": 20,
            //   "offsetY": -20,
            //   "content": "待测试"
            // }}
          />
        </Guide> */}
      </Chart>
    </Card>
  )
}
