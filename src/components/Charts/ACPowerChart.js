import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Card, Typography } from 'antd'
import { Chart, Interval, Axis, Tooltip } from 'bizcharts'
import { titleStyle } from '../../styles/chartStyles'
const Title = Typography.Title

export const ACPowerChart = ({ buildingID }) => {
  const { t } = useTranslation()
  const reportData = useSelector(state => state.report)

  const dataSource = reportData[buildingID].month_AC_power.value.map((p, index) => ({
    month: t(`acPowerChart.month.${index + 1}`),
    value: p,
  }))

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
      nice: true,
    },
  }

  return (
    <Card
      title={
        <Title style={{ textAlign: 'center' }} level={4}>
          {t('acPowerChart.title')}
        </Title>
      }
      hoverable
      style={{ cursor: 'unset' }}
    >
      <Chart
        scale={scale}
        height={500}
        autoFit
        data={dataSource}
        interactions={['active-region']}
        padding='auto'
      >
        <Axis name='month' title={{ style: titleStyle }} />
        <Axis name='value' title={{ style: titleStyle }} />
        <Interval color='#1890ff' position='month*value' />
        <Tooltip shared />
      </Chart>
    </Card>
  )
}
